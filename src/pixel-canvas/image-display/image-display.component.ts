import { NgRedux } from "@angular-redux/store";
import { ChangeDetectionStrategy } from "@angular/core";
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import "rxjs/add/observable/combineLatest";
import "rxjs/add/operator/skip";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { IAppState, ICanvas } from "../../store";
import { IPixelCanvasData } from "../pixel-canvas-data.store";
import { IPixelCanvasView } from "../pixel-canvas-view.store";
import { CanvasActions } from "../pixel-canvas.actions";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-image-display",
  templateUrl: "./image-display.html",
})
export class ImageDisplayComponent implements AfterViewInit {

  @ViewChild("displayCanvas") public canvas: ElementRef;
  @ViewChild("downloadLink") public downloadLink: ElementRef;

  public appData: Observable<symbol>;
  public canvasData: Observable<ICanvas>;

  private appSubscription: Subscription;
  private canvasSubscription: Subscription;

  private context: CanvasRenderingContext2D;
  private readonly amplification = 5;

  constructor(private ngRedux: NgRedux<IAppState>, private actions: CanvasActions) {
    this.canvasData = Observable.combineLatest(ngRedux.select<IPixelCanvasData>(["canvasData", "present"]),
      ngRedux.select<IPixelCanvasView>(["canvasView"]),
      (canvasData: IPixelCanvasData, canvasView: IPixelCanvasView): ICanvas => {
        return {
          canvasData,
          canvasView,
        };
    });

    // Need to skip the first call to avoid the save dialog on initialization
    this.appData = ngRedux.select<symbol>("app").skip(1);
  }

  public ngAfterViewInit() {
    const canvasElement = this.canvas.nativeElement as HTMLCanvasElement;
    const context = canvasElement.getContext("2d");
    if (context === null) {
      throw new Error("Unable to obtain 2D context for canvas.");
    } else {
      this.context = context;
    }

    this.canvasSubscription = this.canvasData.subscribe((canvas: ICanvas) => {
      this.drawCanvas(canvas);
      this.drawCurrentOutline(canvas);
    });

    this.appSubscription = this.appData.subscribe(() => {
      const linkElement = this.downloadLink.nativeElement as HTMLLinkElement;
      linkElement.href = (this.canvas.nativeElement as HTMLCanvasElement).toDataURL();
      linkElement.click();
    });
  }

  /**
   * Called on destroy.  Cleans up subscriptions in this class.
   */
  public ngOnDestroy() {
    this.canvasSubscription.unsubscribe();
    this.appSubscription.unsubscribe();
  }

  /**
   * Draws the current canvas data onto the display canvas
   *
   * @param canvas Canvas data to use when drawing on the canvas
   */
  private drawCanvas(canvas: ICanvas) {
    const data = canvas.canvasData;
    // Directly modify the canvas like this so we retain a reference to the object on the page
    const element: HTMLCanvasElement = this.canvas.nativeElement;
    element.width = data.width * this.amplification;
    element.height = data.height * this.amplification;

    data.pixels.forEach((column: string[], xIndex: number) => {
      column.forEach((pixel: string, yIndex: number) => {
        this.context.fillStyle = pixel;
        this.context.fillRect(xIndex * this.amplification, yIndex * this.amplification,
          this.amplification, this.amplification);
      });
    });
  }

  /**
   * Draws the outline of the current zoom context.
   * TODO: Connect the magic 400 in here to the other canvas
   * @param canvas Canvas data to use
   */
  private drawCurrentOutline(canvas: ICanvas) {
    const data = canvas.canvasData;
    const view = canvas.canvasView;
    this.context.strokeStyle = "red";

    const amplification = this.amplification * 10 / view.zoom;
    const dimensionOffset = this.amplification / 400;
    this.context.strokeRect(view.xOffset * data.width * dimensionOffset,
      view.yOffset * data.height * dimensionOffset, amplification * data.width,
      amplification * data.height);
  }

}
