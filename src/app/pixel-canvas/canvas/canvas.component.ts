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

  private static readonly MIN_ZOOM = 10;
  private static readonly MAX_ZOOM = 40;

  @ViewChild("canvas") public canvasElem: ElementRef;
  public readonly canvasWidth = 400;
  public readonly canvasHeight = 400;

  private canvasData: IPixelCanvas;
  private subscription: Subscription;
  private pixelWidth: number;
  private pixelHeight: number;
  private zoom: number = 10;
  private canvas: CanvasUtility;
  private mouseMove: boolean = false;

  constructor(private readonly ngRedux: NgRedux<IAppState>, private actions: CanvasActions) { }

  /**
   * Fetches the reference to the canvas object on the page after construction and then subscribes to redux for
   * changes in the state of things.
   */
  public ngAfterViewInit() {
    this.canvas = new CanvasUtility(this.canvasElem.nativeElement, this.canvasWidth, this.canvasHeight);

    this.subscription = this.ngRedux.select<IPixelCanvas>(["canvas", "present"]).subscribe((canvas: IPixelCanvas) => {
      this.canvasData = canvas;
      this.pixelHeight = this.canvasHeight / canvas.height;
      this.pixelWidth = this.canvasWidth / canvas.width;

      this.redrawCanvas();
    });
  }

  /**
   * Destroys the subscription created after the view initializes.
   */
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Dispatches an event to modify the zoom level of the canvas.
   * Pretty sure the type is wrong for this event...
   * @param event Event from the mouse scrolling
   */
  public zoomCanvas(event: WheelEvent) {
    const eventLocation = this.canvas.getEventPosition(event);
    this.ngRedux.dispatch(this.actions.zoomCanvas(event.detail < 0, eventLocation[0], eventLocation[1]));
  }

  /**
   * Dispatches a canvas click event.  Does a little quick math to determine where on the canvas the click
   * happened.
   *
   * @param event Mouse event from the HTML
   */
  public canvasClick(event: MouseEvent) {
    if (!this.mouseMove) {
      const coordinate = this.canvas.getEventPosition(event);

      const xValue = Math.floor(coordinate[0] * this.canvasData.width / this.canvasWidth);
      const yValue = Math.floor(coordinate[1] * this.canvasData.height / this.canvasHeight);

      this.ngRedux.dispatch(this.actions.canvasClick(xValue, yValue));
    }
  }

  public canvasMouseDown(event: MouseEvent) {
    this.mouseMove = false;
  }

  public canvasMouseMove(event: MouseEvent) {
    this.mouseMove = true;
  }

  /**
   * Sets the zoom for the canvas and then redraws the whole thing using the utility.
   */
  private redrawCanvas() {
    this.canvas.zoom = this.canvasData.zoom;
    this.canvas.xOffset = this.canvasData.xOffset;
    this.canvas.yOffset = this.canvasData.yOffset;

    this.canvas.clearCanvas();
    this.canvas.drawPixels(this.canvasData.pixels, this.canvasData.width, this.canvasData.height);
    this.canvas.drawPixelOutlines(this.canvasData.width, this.canvasData.height);
  }

}
