import { NgRedux } from "@angular-redux/store";
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ChangeDetectionStrategy } from "@angular/core";
import "rxjs/add/operator/skip";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { IAppState } from "../../store";
import { CanvasActions } from "../pixel-canvas.actions";
import { IPixelCanvas } from "../pixel-canvas.store";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-image-display",
  templateUrl: "./image-display.html",
})
export class ImageDisplayComponent implements AfterViewInit {

  @ViewChild("displayCanvas") public canvas: ElementRef;
  @ViewChild("downloadLink") public downloadLink: ElementRef;

  public appData: Observable<symbol>;
  public canvasData: Observable<IPixelCanvas>;

  private appSubscription: Subscription;
  private canvasSubscription: Subscription;

  private context: CanvasRenderingContext2D;
  private readonly amplification = 5;

  constructor(private ngRedux: NgRedux<IAppState>, private actions: CanvasActions) {
    this.canvasData = ngRedux.select<IPixelCanvas>(["canvas", "present"]);

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

    this.canvasSubscription = this.canvasData.subscribe((canvas: IPixelCanvas) => {
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
  private drawCanvas(canvas: IPixelCanvas) {
    // Directly modify the canvas like this so we retain a reference to the object on the page
    const element: HTMLCanvasElement = this.canvas.nativeElement;
    element.width = canvas.width * this.amplification;
    element.height = canvas.height * this.amplification;

    canvas.pixels.forEach((column: string[], xIndex: number) => {
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
  private drawCurrentOutline(canvas: IPixelCanvas) {
    this.context.strokeStyle = "red";

    const amplification = this.amplification * 10 / canvas.zoom;
    const dimensionOffset = this.amplification / 400;
    this.context.strokeRect(canvas.xOffset * canvas.width * dimensionOffset,
      canvas.yOffset * canvas.height * dimensionOffset, amplification * canvas.width,
      amplification * canvas.height);
  }

}
