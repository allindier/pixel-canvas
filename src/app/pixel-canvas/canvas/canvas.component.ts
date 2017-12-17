import { NgRedux } from "@angular-redux/store/lib/src/components/ng-redux";
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";
import { Subscription } from "rxjs/Subscription";
import { IAppState } from "../../store";
import { CanvasActions } from "../pixel-canvas.actions";
import { IPixelCanvas } from "../pixel-canvas.store";
import { CanvasUtility } from "../utility/canvas-utility";

type Coordinate = [number, number];

@Component({
  selector: "app-canvas",
  styleUrls: ["./canvas.css"],
  templateUrl: "./canvas.html",
})
export class CanvasComponent implements AfterViewInit, OnDestroy {

  @ViewChild("canvas") public canvasElem: ElementRef;
  public readonly canvasWidth = 400;
  public readonly canvasHeight = 400;

  private canvasData: IPixelCanvas;
  private subscription: Subscription;
  private pixelWidth: number;
  private pixelHeight: number;
  private zoom: number = 10;
  private canvas: CanvasUtility;

  constructor(private readonly ngRedux: NgRedux<IAppState>, private actions: CanvasActions) { }

  public ngAfterViewInit() {
    this.canvas = new CanvasUtility(this.canvasElem.nativeElement, this.canvasWidth, this.canvasHeight);

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

    if (this.zoom < 10) {
      this.zoom = 10;
    } else if (this.zoom > 25) {
      this.zoom = 25;
    } else {
      this.redrawCanvas();
    }
  }

  /**
   * Dispatches a canvas click event.  Does a little quick math to determine where on the canvas the click
   * happened.
   *
   * @param event Mouse event from the HTML
   */
  public canvasClick(event: MouseEvent) {
    const coordinate = this.canvas.getEventPosition(event);

    const zoom = this.zoom / 10;
    const xValue = Math.floor(coordinate[0] / zoom * this.canvasData.width / this.canvasWidth);
    const yValue = Math.floor(coordinate[1] / zoom * this.canvasData.height / this.canvasHeight);

    this.ngRedux.dispatch(this.actions.canvasClick(xValue, yValue));
  }

  private redrawCanvas() {
    const zoomValue = this.zoom / 10;
    this.canvas.setZoom(zoomValue);

    this.canvas.clearCanvas(zoomValue);
    this.canvas.drawPixels(this.canvasData.pixels, this.canvasData.width, this.canvasData.height);
    this.canvas.drawPixelOutlines(zoomValue, this.canvasData.width, this.canvasData.height);
  }

}
