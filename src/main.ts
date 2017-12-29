import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
import { WasmUtil } from "./utils.wasm";

const initAngular = () => {
  if (environment.production) {
    enableProdMode();
  }
  // tslint:disable-next-line no-console
  platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.log(err));
};

WasmUtil.initialize().then(initAngular).catch(initAngular);
