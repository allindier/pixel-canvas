import { NgRedux } from "@angular-redux/store";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { IAppState } from "../../store";
import { IPixelCanvas } from "../pixel-canvas.store";

import { ActionCreators } from "redux-undo";
import { AppActions } from "../../app.actions";
import { CanvasActions } from "../pixel-canvas.actions";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-canvas-controls",
  styleUrls: ["./canvas-controls.css"],
  templateUrl: "./canvas-controls.html",
})
export class CanvasControlsComponent {
  public static readonly UNIMPLEMENTED_ERROR = "This feature is not yet implemented";

  public canvas: Observable<IPixelCanvas>;

  constructor(private ngRedux: NgRedux<IAppState>, private actions: CanvasActions, private appActions: AppActions) {
    // Empty for now, probably going to use later
    this.canvas = ngRedux.select<IPixelCanvas>(["canvas", "present"]);
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
    this.ngRedux.dispatch(this.appActions.saveCanvas());
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
