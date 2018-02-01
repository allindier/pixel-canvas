import { NgRedux, NgReduxModule } from "@angular-redux/store";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { PixelCanvasModule } from "./pixel-canvas/pixel-canvas.module";

import { AppComponent } from "./app.component";
import { SaveCanvasService } from "./pixel-canvas/save-canvas.service";
import { IAppState, INITIAL_STATE, rootReducer } from "./store";

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgReduxModule,
    PixelCanvasModule,
  ],
  providers: [
    SaveCanvasService,
  ],
})
export class AppModule {
  constructor(ngRedux: NgRedux<IAppState>) {
    ngRedux.configureStore(rootReducer, INITIAL_STATE);
  }
}
