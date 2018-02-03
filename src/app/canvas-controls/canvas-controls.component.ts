import { NgRedux } from "@angular-redux/store";
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from "@angular/core";
import { ActionCreators } from "redux-undo";
import { Observable } from "rxjs/Observable";
import { IPixelCanvasData } from "../pixel-canvas-data.store";
import { CanvasActions } from "../pixel-canvas.actions";
import { SaveCanvasService } from "../save-canvas.service";
import { IAppState } from "../store";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-canvas-controls",
  styleUrls: ["./canvas-controls.css"],
  templateUrl: "./canvas-controls.html",
})
export class CanvasControlsComponent {

  @ViewChild("colorPicker")
  public colorPicker: ElementRef;

  public canvas: Observable<IPixelCanvasData>;

  constructor(private ngRedux: NgRedux<IAppState>, private actions: CanvasActions,
              private saveService: SaveCanvasService) {
    // Empty for now, probably going to use later
    this.canvas = ngRedux.select<IPixelCanvasData>(["canvasData", "present"]);
  }

  /**
   * Blurs the targeted input to trigger the change event
   *
   * @param input Input on the page to target
   */
  public blurInput(input: Event) {
    (input.target as HTMLElement).blur();
  }

  /**
   * Tell the canvas to create a new blank slate
   */
  public createNew() {
    this.ngRedux.dispatch(this.actions.clearCanvas());
  }

  public focusInput(element: ElementRef, event: Event) {
    event.stopPropagation();
    element.focus();
  }

  public openColorPicker() {
    this.colorPicker.nativeElement.click();
  }

  /**
   * Redo the last action undone
   */
  public redo() {
    this.ngRedux.dispatch(ActionCreators.redo());
  }

  /**
   * Save the current state of the canvas
   */
  public save() {
    this.saveService.next();
  }

  /**
   * Undo the last action done
   */
  public undo() {
    this.ngRedux.dispatch(ActionCreators.undo());
  }

  /**
   * Dispatches an action to change the color
   * TODO: Validation of the color string
   *
   * @param color Color string
   */
  public updateColor(color: string) {
    this.ngRedux.dispatch(this.actions.changeColor(color));
  }

  /**
   * Dispatches an action to update the height
   *
   * @param height Height (in pixels)
   */
  public updateHeight(height: string) {
    this.ngRedux.dispatch(this.actions.changeHeight(parseInt(height, 10)));
  }

  /**
   * Dispatches an action to update the width
   *
   * @param width Width (in pixels)
   */
  public updateWidth(width: string) {
    this.ngRedux.dispatch(this.actions.changeWidth(parseInt(width, 10)));
  }

}
