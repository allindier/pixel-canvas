import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CanvasControlsComponent } from './canvas-controls/canvas-controls.component';
import { PixelCanvasComponent } from './pixel-canvas.component';
import { CanvasComponent } from './canvas/canvas.component';
import { CanvasActions } from './pixel-canvas.actions';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    CanvasControlsComponent,
    PixelCanvasComponent,
    CanvasComponent
  ],
  exports: [
    PixelCanvasComponent
  ],
  providers: [
    CanvasActions
  ]
})
export class PixelCanvasModule { }
