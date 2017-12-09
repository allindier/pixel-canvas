import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CanvasControlsComponent } from './canvas-controls/canvas-controls.component';
import { PixelCanvasComponent } from './pixel-canvas.component';
import { CanvasComponent } from './canvas/canvas.component';
import { CanvasActions } from './pixel-canvas.actions';
import { ImageDisplayComponent } from './image-display/image-display.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    CanvasControlsComponent,
    PixelCanvasComponent,
    CanvasComponent,
    ImageDisplayComponent
  ],
  exports: [
    PixelCanvasComponent
  ],
  providers: [
    CanvasActions
  ]
})
export class PixelCanvasModule { }
