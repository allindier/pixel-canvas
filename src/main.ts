import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { PixelCanvasModule } from "./app/pixel-canvas.module";
import { environment } from "./environments/environment";
import { WasmUtil } from "./utils.wasm";

const initAngular = () => {
  if (environment.production) {
    enableProdMode();
  }
  // tslint:disable-next-line no-console
  platformBrowserDynamic().bootstrapModule(PixelCanvasModule).catch((err) => console.log(err));
};

WasmUtil.initialize().then(initAngular).catch(initAngular);
