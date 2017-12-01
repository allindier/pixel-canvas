import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CanvasControlsComponent } from './canvas-controls/canvas-controls.component';
import { PixelCanvasComponent } from './pixel-canvas.component';
import { CanvasComponent } from './canvas/canvas.component';

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
  ]
})
export class PixelCanvasModule { }
