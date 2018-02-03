import { NgRedux, NgReduxModule } from "@angular-redux/store";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ColorPickerModule } from "ngx-color-picker";
import { CanvasControlsComponent } from "./canvas-controls/canvas-controls.component";
import { CanvasComponent } from "./canvas/canvas.component";
import { ImageDisplayComponent } from "./image-display/image-display.component";
import { MaterialModule } from "./material.module";
import { CanvasActions } from "./pixel-canvas.actions";
import { PixelCanvasComponent } from "./pixel-canvas.component";
import { SaveCanvasService } from "./save-canvas.service";
import { IAppState, INITIAL_STATE, rootReducer } from "./store";

@NgModule({
  bootstrap: [
    PixelCanvasComponent,
  ],
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
    BrowserAnimationsModule,
    BrowserModule,
    ColorPickerModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    NgReduxModule,
  ],
  providers: [
    CanvasActions,
    SaveCanvasService,
  ],
})
export class PixelCanvasModule {
  constructor(ngRedux: NgRedux<IAppState>) {
    ngRedux.configureStore(rootReducer, INITIAL_STATE);
  }
}
