import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ColorPickerModule } from "ngx-color-picker";
import { CanvasControlsComponent } from "./canvas-controls/canvas-controls.component";
import { CanvasComponent } from "./canvas/canvas.component";
import { ImageDisplayComponent } from "./image-display/image-display.component";
import { CanvasActions } from "./pixel-canvas.actions";
import { PixelCanvasComponent } from "./pixel-canvas.component";

@NgModule({
  declarations: [
    CanvasComponent,
    CanvasControlsComponent,
    ImageDisplayComponent,
    PixelCanvasComponent,
  ],
  exports: [
    PixelCanvasComponent,
  ],
  imports: [
    ColorPickerModule,
    CommonModule,
    FormsModule,
  ],
  providers: [
    CanvasActions,
  ],
})
export class PixelCanvasModule { }
