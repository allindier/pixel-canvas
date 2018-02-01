import { NgRedux } from "@angular-redux/store/lib/src/components/ng-redux";
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";
import "rxjs/add/observable/combineLatest";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { IAppState } from "../../store";
import { IPixelCanvasData } from "../pixel-canvas-data.store";
import { IPixelCanvasView } from "../pixel-canvas-view.store";
import { CanvasActions } from "../pixel-canvas.actions";
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

  private canvasData: IPixelCanvasData;
  private canvasView: IPixelCanvasView;
  private subscription: Subscription;
  private pixelWidth: number;
  private pixelHeight: number;
  private zoom: number = 10;
  private canvas: CanvasUtility;

  // Used to track mouse properties for clicking/dragging
  private mouseMove: boolean = false;
  private mousePosition: Coordinate | null;

  constructor(private readonly ngRedux: NgRedux<IAppState>, private actions: CanvasActions) { }

  /**
   * Fetches the reference to the canvas object on the page after construction and then subscribes to redux for
   * changes in the state of things.
   */
  public ngAfterViewInit() {
    this.canvas = new CanvasUtility(this.canvasElem.nativeElement, this.canvasWidth, this.canvasHeight);

    this.subscription = this.ngRedux.select<IAppState>().subscribe((canvas: IAppState) => {
      this.canvasView = canvas.canvasView;
      this.canvasData = canvas.canvasData.present;
      this.pixelHeight = this.canvasHeight / this.canvasData.height;
      this.pixelWidth = this.canvasWidth / this.canvasData.width;

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
    event.preventDefault();
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

    this.mousePosition = null;
  }

  /**
   * Called when a mousedown event occurs on the canvas.  Used to track dragging and provide a reference point.
   * @param event Mouse position for the mouse down
   */
  public canvasMouseDown(event: MouseEvent) {
    this.mouseMove = false;
    this.mousePosition = this.canvas.getEventPosition(event);
  }

  /**
   * Called when a mousemove event occurs on the canvas.  Used to fire dragging event when the mouse is down.
   * @param event Mouse position for the movement
   */
  public canvasMouseMove(event: MouseEvent) {
    this.mouseMove = true;

    if (this.mousePosition) {
      const coordinate = this.canvas.getEventPosition(event);
      this.ngRedux.dispatch(this.actions.panCanvas(coordinate[0] - this.mousePosition[0],
        coordinate[1] - this.mousePosition[1]));
    }
  }

  /**
   * Sets the zoom for the canvas and then redraws the whole thing using the utility.
   */
  private redrawCanvas() {
    this.canvas.zoom = this.canvasView.zoom;
    this.canvas.xOffset = this.canvasView.xOffset;
    this.canvas.yOffset = this.canvasView.yOffset;

    this.canvas.clearCanvas();
    this.canvas.drawPixels(this.canvasData.pixels, this.canvasData.width, this.canvasData.height);
    this.canvas.drawPixelOutlines(this.canvasData.width, this.canvasData.height);
  }

}
