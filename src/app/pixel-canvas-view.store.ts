import { AnyAction } from "redux";
import { WasmUtil } from "../utils.wasm";
import { CanvasActions } from "./pixel-canvas.actions";

export interface IPixelCanvasView {
  xOffset: number;
  yOffset: number;
  zoom: number;
}

const SOLID_WHITE = "#FFFFFF";
const MIN_ZOOM = 10;
const MAX_ZOOM = 40;
const CANVAS_HEIGHT = 400;
const CANVAS_WIDTH = 400;

/**
 * Builds the initial state object.
 */
export function getInitialState(): IPixelCanvasView {
  return {
    xOffset: 0,
    yOffset: 0,
    zoom: MIN_ZOOM,
  };
}

/**
 * Reducer for view based logic of the canvas.
 * @param lastState Last state of this reducer
 * @param action Action to take
 */
export function viewReducer(lastState: IPixelCanvasView = getInitialState(), action: AnyAction): IPixelCanvasView {
  switch (action.type) {
    case CanvasActions.ZOOM_CANVAS:
      return changeZoom(lastState, action.value.zoomIn, action.value.xCoord, action.value.yCoord);
    case CanvasActions.PAN_CANVAS:
      return panCanvas(lastState, action.value.xCoord, action.value.yCoord);
    default:
      return lastState;
  }
}

/**
 * Alters the zoom for the canvas.  Modifies the zoom factor, but also recalculates the xOffset and yOffset that
 * are used for the bounding box of the view.
 * @param state Last state of the canvas
 * @param zoomIn New zoom level of the canvas
 * @param xCoord Position of the mouse (x) for the new zoom
 * @param yCoord Position of the moues (y) for the new zoom
 */
function changeZoom(state: IPixelCanvasView, zoomIn: boolean, xCoord: number, yCoord: number): IPixelCanvasView {
  let zoom = state.zoom;
  if (zoomIn) {
    zoom++;
  } else {
    zoom--;
  }

  // Quick check to make sure zoom does not go outside the allowed bounds.
  if (zoom < MIN_ZOOM || zoom > MAX_ZOOM) {
    return state;
  } else {
    const oldZoom = state.zoom / 10;
    const newState = Object.assign({}, state);
    newState.zoom = zoom;
    const newZoom = newState.zoom / 10;
    newState.xOffset = WasmUtil.calculateZoomOffset(xCoord, newState.xOffset, oldZoom, newZoom, CANVAS_WIDTH);
    newState.yOffset = WasmUtil.calculateZoomOffset(yCoord, newState.yOffset, oldZoom, newZoom, CANVAS_HEIGHT);
    return newState;
  }
}

/**
 * "Pans" the canvas and modifies the offset to allow the view area to move around freely
 * @param state Last state of the canvas
 * @param xCoord Change in x position of the mouse
 * @param yCoord Change in y position of the mouse
 */
function panCanvas(state: IPixelCanvasView, xCoord: number, yCoord: number) {
  const newState = Object.assign({}, state);
  const zoom = newState.zoom / 10;

  newState.xOffset = WasmUtil.calculatePanOffset(xCoord, newState.xOffset, zoom, CANVAS_WIDTH);
  newState.yOffset = WasmUtil.calculatePanOffset(yCoord, newState.yOffset, zoom, CANVAS_HEIGHT);

  return newState;
}
