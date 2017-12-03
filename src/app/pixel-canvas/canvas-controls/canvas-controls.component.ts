import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { IAppState } from '../../store';
import { IPixelCanvas } from '../pixel-canvas.store';
import { CanvasActions } from '../pixel-canvas.actions';

@Component({
  selector: 'app-canvas-controls',
  templateUrl: './canvas-controls.html',
  styleUrls: ['./canvas-controls.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasControlsComponent {
  static readonly UNIMPLEMENTED_ERROR = 'This feature is not yet implemented';

  canvas: Observable<IPixelCanvas>;

  constructor(private ngRedux: NgRedux<IAppState>, private actions: CanvasActions) {
    // Empty for now, probably going to use later
    this.canvas = ngRedux.select<IPixelCanvas>('canvas');
  }
  
  /**
   * Blurs the targeted input to trigger the change event
   * 
   * @param input Input on the page to target 
   */
  blurInput(input: any) {
    input.target.blur();
  }

  /**
   * Tell the canvas to create a new blank slate
   */
  createNew() {
    throw CanvasControlsComponent.UNIMPLEMENTED_ERROR;
  }

  /**
   * Redo the last action undone
   */
  redo() {
    throw CanvasControlsComponent.UNIMPLEMENTED_ERROR;
  }

  /**
   * Save the current state of the canvas
   */
  save() {
    throw CanvasControlsComponent.UNIMPLEMENTED_ERROR;
  }

  /**
   * Undo the last action done
   */
  undo() {
    throw CanvasControlsComponent.UNIMPLEMENTED_ERROR;
  }

  /**
   * Dispatches an action to change the color
   * TODO: Validation of the color string
   *
   * @param color Color string
   */
  updateColor(color: string) {
    this.ngRedux.dispatch(this.actions.changeColor(color));
  }

  /**
   * Dispatches an action to update the height
   *
   * @param height Height (in pixels)
   */
  updateHeight(height: string) {
    this.ngRedux.dispatch(this.actions.changeHeight(parseInt(height)));
  }

  /**
   * Dispatches an action to update the width
   * 
   * @param width Width (in pixels)
   */
  updateWidth(width: string) {
    this.ngRedux.dispatch(this.actions.changeWidth(parseInt(width)));
  }

}
