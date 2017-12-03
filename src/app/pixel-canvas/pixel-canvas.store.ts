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
            const coordinate: number[] = action.value;
            newState.pixels[coordinate[0]][coordinate[1]] = newState.color;
            return newState;
        case CanvasActions.CHANGE_COLOR:
            newState = Object.assign({}, lastState);
            newState.color = action.value;
            return newState;
        case CanvasActions.CHANGE_HEIGHT:
            newState = Object.assign({}, lastState);
            const lastHeight = lastState.height;
            const newHeight: number = action.value;

            pixelArray.forEach(column => {
                column.length = newHeight;
                for (let i = lastHeight; i < newHeight; i++) {
                    column[i] = SOLID_WHITE;
                }
            });

            newState.height = newHeight;
            return newState;
        case CanvasActions.CHANGE_WIDTH:
            newState = Object.assign({}, lastState);
            const lastWidth = lastState.width;
            const newWidth: number = action.value;

            let newColumn: string[] = [];
            for (let i = 0; i < newState.height; i++) {
                newColumn.push(SOLID_WHITE);
            }

            pixelArray.length = newWidth;
            for (let i = lastWidth; i < newWidth; i++) {
                pixelArray[i] = newColumn.slice(0);
            }

            newState.width = action.value;
            return newState;
        default:
            return lastState;
    }
}