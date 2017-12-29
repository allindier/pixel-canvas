export type CalculatePanOffset = (coord: number, offset: number, zoom: number, size: number) => number;
export type CalculateZoomOffset =
  (coord: number, offset: number, oldZoom: number, newZoom: number, size: number) => number;

// Shim type
interface IWebAssemblyModule {
  instance: {
    exports: IExports;
  };
}

interface IExports {
  calculatePanOffset: CalculatePanOffset;
  calculateZoomOffset: CalculateZoomOffset;
}

// Shim Type
declare var WebAssembly: any;

export class WasmUtil {

  public static get calculatePanOffset(): CalculatePanOffset {
    return WasmUtil.importObject.calculatePanOffset;
  }

  public static get calculateZoomOffset(): CalculateZoomOffset {
    return WasmUtil.importObject.calculateZoomOffset;
  }

  /**
   * Attempts to load the wasm into the browser
   */
  public static initialize(): Promise<void> {
    return fetch("assets/rust-utils.wasm").then((response) => {
      return response.arrayBuffer();
    }).then((bytes) => {
      return WebAssembly.instantiate(bytes, WasmUtil.importObject);
    }).then((object: IWebAssemblyModule) => {
      WasmUtil.importObject = object.instance.exports;
      WasmUtil.isInit = true;
    }).catch(console.error);
  }

  public static get initialized() {
    return WasmUtil.isInit;
  }

  private static importObject: IExports;

  private static isInit = false;

  private constructor() {
    // This class is a singleton.  Or really just a static container.
  }
}
