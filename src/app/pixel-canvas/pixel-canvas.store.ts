import { AnyAction } from "redux";
import { CanvasActions } from "./pixel-canvas.actions";

export interface IPixelCanvas {
  color: string;
  height: number;
  pixels: string[][];
  width: number;
  xOffset: number;
  yOffset: number;
  zoom: number;
}

const SOLID_WHITE = "#FFFFFF";
const MIN_ZOOM = 10;
const MAX_ZOOM = 40;
const CANVAS_HEIGHT = 400;
const CANVAS_WIDTH = 400;

export function getInitialState(): IPixelCanvas {
  const pixelArray: string[][] = [];
  pixelArray.length = 6;
  for (let i = 0; i < 6; i++) {
    pixelArray[i] = [SOLID_WHITE, SOLID_WHITE, SOLID_WHITE, SOLID_WHITE];
  }

  return {
    color: "#CCCCCC",
    height: 4,
    pixels: pixelArray,
    width: 6,
    xOffset: 0,
    yOffset: 0,
    zoom: MIN_ZOOM,
  };
}

export function reducer(lastState: IPixelCanvas = getInitialState(), action: AnyAction): IPixelCanvas {
  let newState: IPixelCanvas;

  switch (action.type) {
    case CanvasActions.CANVAS_CLICK:
      const x = action.value[0];
      const y = action.value[1];

      if (lastState.pixels[x][y] === lastState.color) {
        newState = lastState;
      } else {
        newState = Object.assign({}, lastState);
        newState.pixels = newState.pixels.slice();
        newState.pixels[x] = newState.pixels[x].slice();
        newState.pixels[x][y] = newState.color;
      }

      return newState;
    case CanvasActions.CHANGE_COLOR:
      newState = Object.assign({}, lastState);
      newState.color = action.value;
      return newState;
    case CanvasActions.CHANGE_HEIGHT:
      if (!(action.value > 1)) {
        return Object.assign({}, lastState);
      }
      return changeHeight(lastState, action.value);
    case CanvasActions.CHANGE_WIDTH:
      if (!(action.value > 1)) {
        return Object.assign({}, lastState);
      }
      return changeWidth(lastState, action.value);
    case CanvasActions.CLEAR_CANVAS:
      return getInitialState();
    case CanvasActions.ZOOM_CANVAS:
      return changeZoom(lastState, action.value.zoomIn, action.value.xCoord, action.value.yCoord);
    default:
      return lastState;
  }
}

/**
 * Takes in the state of the canvas and returns a new canvas state with the given height.
 * All new cells are colored solid white.
 * @param state Current state object
 * @param newHeight New height to use for the canvas
 */
function changeHeight(state: IPixelCanvas, newHeight: number): IPixelCanvas {
  const newState = Object.assign({}, state);
  const lastHeight = state.height;

  newState.pixels = newState.pixels.map((column) => {
    column = column.slice();
    column.length = newHeight;
    for (let i = lastHeight; i < newHeight; i++) {
      column[i] = SOLID_WHITE;
    }
    return column;
  });

  newState.height = newHeight;
  return newState;
}

/**
 * Takes in the state of the canvas and returns a new canvas state with the given width.
 * All new cells are colored solid white.
 * @param state Current state object
 * @param newWidth New width to use for the canvas
 */
function changeWidth(state: IPixelCanvas, newWidth: number): IPixelCanvas {
  const newState = Object.assign({}, state);
  const lastWidth = state.width;

  const newColumn: string[] = [];
  for (let i = 0; i < newState.height; i++) {
    newColumn.push(SOLID_WHITE);
  }

  newState.pixels = newState.pixels.slice();
  newState.pixels.length = newWidth;
  for (let i = lastWidth; i < newWidth; i++) {
    newState.pixels[i] = newColumn.slice();
  }

  newState.width = newWidth;
  return newState;
}

function changeZoom(state: IPixelCanvas, zoomIn: boolean, xCoord: number, yCoord: number): IPixelCanvas {
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
