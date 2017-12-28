import { AnyAction } from "redux";
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

export function viewReducer(lastState: IPixelCanvasView = getInitialState(), action: AnyAction): IPixelCanvasView {

  switch (action.type) {
    case CanvasActions.ZOOM_CANVAS:
      return changeZoom(lastState, action.value.zoomIn, action.value.xCoord, action.value.yCoord);
    default:
      return lastState;
  }
}

function changeZoom(state: IPixelCanvasView, zoomIn: boolean, xCoord: number, yCoord: number): IPixelCanvasView {
  let zoom = state.zoom;
  if (zoomIn) {
    zoom++;
  } else {
    zoom--;
  }

  if (zoom < MIN_ZOOM || zoom > MAX_ZOOM) {
    return state;
  } else {
    const oldZoom = state.zoom / 10;
    const newState = Object.assign({}, state);
    newState.zoom = zoom;
    const newZoom = newState.zoom / 10;
    newState.xOffset = calculateOffset(xCoord, newState.xOffset, oldZoom, newZoom, CANVAS_WIDTH);
    newState.yOffset = calculateOffset(yCoord, newState.yOffset, oldZoom, newZoom, CANVAS_HEIGHT);
    return newState;
  }
}

function calculateOffset(coord: number, offset: number, oldZoom: number, newZoom: number, size: number) {
  const newValue = size / newZoom;

  const gap = size - newValue;
  let firstSide = offset;
  if (firstSide < 0) {
    firstSide = 0;
  } else if (firstSide > gap) {
    firstSide = gap;
  }

  let secondSide = offset + size / oldZoom - newValue;
  if (secondSide > gap) {
    secondSide = gap;
  } else if (secondSide < 0) {
    secondSide = 0;
  }

  const boundary = [firstSide, secondSide];
  let newOffset = coord - newValue / 2;
  if (newOffset < boundary[0]) {
    newOffset = boundary[0];
  } else if (newOffset > boundary[1]) {
    newOffset = boundary[1];
  }
  return newOffset;
}
