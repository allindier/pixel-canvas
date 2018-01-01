import { NgRedux, NgReduxModule } from "@angular-redux/store";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ColorPickerModule } from "ngx-color-picker";
import { CanvasControlsComponent } from "./canvas-controls/canvas-controls.component";
import { CanvasComponent } from "./canvas/canvas.component";
import { ImageDisplayComponent } from "./image-display/image-display.component";
import { CanvasActions } from "./pixel-canvas.actions";
import { PixelCanvasComponent } from "./pixel-canvas.component";
import { SaveActions } from "./save.actions";
import { IAppState, INITIAL_STATE, rootReducer } from "./store";

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
    BrowserAnimationsModule,
    ColorPickerModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    NgReduxModule,
  ],
  providers: [
    CanvasActions,
    SaveActions,
  ],
})
export class PixelCanvasModule {
  constructor(ngRedux: NgRedux<IAppState>) {
    ngRedux.configureStore(rootReducer, INITIAL_STATE);
  }
}
