import { AnyAction } from 'redux';
import { CanvasActions } from './pixel-canvas.actions';

export interface IPixelCanvas {
    color: string;
    height: number;
    pixels: string[][];
    width: number;
};

const SOLID_WHITE = '#FFFFFF';
let pixelArray: string[][] = [];
pixelArray.length = 6;
for (let i = 0; i < 6; i++) {
    pixelArray[i] = [SOLID_WHITE, SOLID_WHITE, SOLID_WHITE, SOLID_WHITE];
}

export const INITIAL_STATE: IPixelCanvas = {
    color: '#CCCCCC',
    height: 4,
    pixels: pixelArray,
    width: 6
};

export function reducer(lastState: IPixelCanvas = INITIAL_STATE, action: AnyAction): IPixelCanvas {
    let newState: IPixelCanvas;

    switch (action.type) {
        case CanvasActions.CANVAS_CLICK:
            newState = Object.assign({}, lastState);
            const x = action.value[0],
                y = action.value[1];
            newState.pixels = newState.pixels.slice();
            newState.pixels[x] = newState.pixels[x].slice();
            newState.pixels[x][y] = newState.color;

            return newState;
        case CanvasActions.CHANGE_COLOR:
            newState = Object.assign({}, lastState);
            newState.color = action.value;
            return newState;
        case CanvasActions.CHANGE_HEIGHT:
            return changeHeight(lastState, action.value);
        case CanvasActions.CHANGE_WIDTH:
            return changeWidth(lastState, action.value);
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
    let newState = Object.assign({}, state);
    const lastHeight = state.height;

    pixelArray.forEach(column => {
        column.length = newHeight;
        for (let i = lastHeight; i < newHeight; i++) {
            column[i] = SOLID_WHITE;
        }
    });

    newState.height = newHeight;
    return newState;
}

/**
 * Takes in the state of the canvas and returns a new canvas state with the given height.
 * All new cells are colored solid white.
 * @param state Current state object
 * @param newWidth New width to use for the canvas
 */
function changeWidth(state: IPixelCanvas, newWidth: number): IPixelCanvas {
    let newState = Object.assign({}, state);
    const lastWidth = state.width;

    let newColumn: string[] = [];
    for (let i = 0; i < newState.height; i++) {
        newColumn.push(SOLID_WHITE);
    }

    pixelArray.length = newWidth;
    for (let i = lastWidth; i < newWidth; i++) {
        pixelArray[i] = newColumn.slice(0);
    }

    newState.width = newWidth;
    return newState;
}