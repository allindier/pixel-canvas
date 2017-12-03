import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
export class CanvasControlsComponent implements OnInit {

  canvas: Observable<IPixelCanvas>;

  constructor(private ngRedux: NgRedux<IAppState>, private actions: CanvasActions) {
    // Empty for now, probably going to use later
    this.canvas = ngRedux.select<IPixelCanvas>('canvas');
  }

  ngOnInit() {
    // Empty for now, probably going to use later
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
    console.log('Create New!!!!!!!');
  }

  /**
   * Redo the last action undone
   */
  redo() {
    console.log('Redo');
  }

  /**
   * Save the current state of the canvas
   */
  save() {
    console.log('Save');
  }

  /**
   * Undo the last action done
   */
  undo() {
    console.log('Undo');
  }

  /**
   * Method to call to indicate that the height has changed
   *
   * @param height Height (in pixels)
   */
  updateHeight(height: string) {
    this.ngRedux.dispatch(this.actions.changeHeight(parseInt(height)));
  }

  /**
   * Method to call to indicate the width has changed
   * 
   * @param width Width (in pixels)
   */
  updateWidth(width: string) {
    this.ngRedux.dispatch(this.actions.changeWidth(parseInt(width)));
  }

}
