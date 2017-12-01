import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PixelCanvasModule } from './pixel-canvas/pixel-canvas.module'

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PixelCanvasModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
