import { AnyAction } from "redux";
import { CanvasActions } from "./pixel-canvas.actions";

export interface IPixelCanvas {
    color: string;
    height: number;
    pixels: string[][];
    width: number;
}

const SOLID_WHITE = "#FFFFFF";

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
            return changeHeight(lastState, action.value);
        case CanvasActions.CHANGE_WIDTH:
            return changeWidth(lastState, action.value);
        case CanvasActions.CLEAR_CANVAS:
            return getInitialState();
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

    state.pixels.forEach((column) => {
        column.length = newHeight;
        for (let i = lastHeight; i < newHeight; i++) {
            column[i] = SOLID_WHITE;
        }
        column = column.slice();
    });
    state.pixels = state.pixels.slice();

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

    state.pixels.length = newWidth;
    for (let i = lastWidth; i < newWidth; i++) {
        state.pixels[i] = newColumn.slice();
    }
    state.pixels = state.pixels.slice();

    newState.width = newWidth;
    return newState;
}
