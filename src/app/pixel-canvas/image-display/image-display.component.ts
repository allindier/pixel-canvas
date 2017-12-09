import { NgRedux } from "@angular-redux/store";
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ChangeDetectionStrategy } from "@angular/core";
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
  public canvasData: Observable<IPixelCanvas>;

  private context: CanvasRenderingContext2D;
  private subscription: Subscription;
  private amplification = 5;

  constructor(private ngRedux: NgRedux<IAppState>, private actions: CanvasActions) {
    // Empty for now, probably going to use later
    this.canvasData = ngRedux.select<IPixelCanvas>(["canvas", "present"]);
  }

  public ngAfterViewInit() {
    const canvasElement = this.canvas.nativeElement as HTMLCanvasElement;
    const context = canvasElement.getContext("2d");
    if (context === null) {
      throw new Error("Unable to obtain 2D context for canvas.");
    } else {
      this.context = context;
    }

    this.subscription = this.canvasData.subscribe(this.drawCanvas.bind(this));
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

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

}
