import { NgRedux } from "@angular-redux/store/lib/src/components/ng-redux";
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";
import { Subscription } from "rxjs/Subscription";
import { IAppState } from "../../store";
import { CanvasActions } from "../pixel-canvas.actions";
import { IPixelCanvas } from "../pixel-canvas.store";

type Coordinate = [number, number];

@Component({
  selector: "app-canvas",
  styleUrls: ["./canvas.css"],
  templateUrl: "./canvas.html",
})
export class CanvasComponent implements AfterViewInit, OnDestroy {

  private static readonly DASH_ARRAY = [8, 4];

  public readonly canvasWidth = 400;
  public readonly canvasHeight = 400;
  @ViewChild("canvas") public canvas: ElementRef;

  private context: CanvasRenderingContext2D;
  private canvasData: IPixelCanvas;
  private subscription: Subscription;
  private pixelWidth: number;
  private pixelHeight: number;
  private zoom: number = 10;

  constructor(private readonly ngRedux: NgRedux<IAppState>, private actions: CanvasActions) { }

  public ngAfterViewInit() {
    const canvasElement = this.canvas.nativeElement as HTMLCanvasElement;
    const context = canvasElement.getContext("2d");
    if (context === null) {
      throw new Error("Unable to obtain 2D context for canvas.");
    } else {
      this.context = context;
    }

    this.subscription = this.ngRedux.select<IPixelCanvas>(["canvas", "present"]).subscribe((canvas: IPixelCanvas) => {
      this.canvasData = canvas;
      this.pixelHeight = this.canvasHeight / canvas.height;
      this.pixelWidth = this.canvasWidth / canvas.width;

      this.redrawCanvas();
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Dispatches an event to modify the zoom level of the canvas.
   * Pretty sure the type is wrong for this event...
   * @param event Event from the mouse scrolling
   */
  public zoomCanvas(event: WheelEvent) {
    if (event.detail < 0) {
      this.zoom++;
    } else {
      this.zoom--;
    }

    this.redrawCanvas();
  }

  /**
   * Dispatches a canvas click event.  Does a little quick math to determine where on the canvas the click
   * happened.
   *
   * @param event Mouse event from the HTML
   */
  public canvasClick(event: MouseEvent) {
    const boundingRect = (this.canvas.nativeElement as HTMLCanvasElement).getBoundingClientRect();

    const xValue = Math.floor((event.clientX - boundingRect.left)
      * this.canvasData.width / this.canvasWidth);
    const yValue = Math.floor((event.clientY - boundingRect.top)
      * this.canvasData.height / this.canvasHeight);

    this.ngRedux.dispatch(this.actions.canvasClick(xValue, yValue));
  }

  /**
   * Clears the contents of the canvas.  Does not account for transforms to the canvas.
   */
  private clearCanvas(zoom: number) {
    this.context.clearRect(0, 0, this.canvasWidth / zoom, this.canvasHeight / zoom);
  }

  /**
   * Draws the outlines of the pixels on the canvas.  Draws a dashed line, but does reset that back
   * to its old value.
   * @param zoom Zoom level to draw the outlines for.  Only affects the size of the line.
   */
  private drawPixelOutlines(zoom: number) {
    const oldLineDash = this.context.getLineDash();
    this.context.setLineDash(CanvasComponent.DASH_ARRAY);
    this.context.lineWidth = 1 / zoom;

    // TODO: Don't dupe the code
    // Draw the horizontal lines
    const barWidth = this.canvasWidth / this.canvasData.width;
    let linePosition = barWidth;
    for (let i = 1; i < this.canvasData.width; i++) {
      this.drawLine(this.context, [linePosition, 0], [linePosition, this.canvasHeight]);

      linePosition += barWidth;
    }

    // Draw the vertical lines
    const barHeight = this.canvasHeight / this.canvasData.height;
    linePosition = barHeight;
    for (let i = 1; i < this.canvasData.height; i++) {
      this.drawLine(this.context, [0, linePosition], [this.canvasWidth, linePosition]);

      linePosition += barHeight;
    }
    this.context.setLineDash(oldLineDash);
  }

  /**
   * Draws the pixels from the canvas data into the context
   */
  private drawPixels() {
    this.canvasData.pixels.forEach((column, xIndex) => {
      column.forEach((pixel, yIndex) => {
        this.context.fillStyle = pixel;
        this.context.fillRect(xIndex * this.pixelWidth, yIndex * this.pixelHeight,
          this.pixelWidth, this.pixelHeight);
      });
    });
  }

  /**
   * Draws a single line from the given start coordinate to the end.
   * @param context Canvas context to draw the line on
   * @param start Start coordinate to use
   * @param end End coordinate to use
   */
  private drawLine(context: CanvasRenderingContext2D, start: Coordinate, end: Coordinate) {
    context.beginPath();
    context.moveTo(start[0], start[1]);
    context.lineTo(end[0], end[1]);
    context.stroke();
  }

  private redrawCanvas() {
    const zoomValue = this.zoom / 10;
    this.context.setTransform(zoomValue, 0, 0, zoomValue, 0, 0);

    this.clearCanvas(zoomValue);
    this.drawPixels();
    this.drawPixelOutlines(zoomValue);
  }

}
