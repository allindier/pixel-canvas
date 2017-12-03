import { AnyAction } from 'redux';
import { CanvasActions } from './pixel-canvas.actions';

export interface IPixelCanvas {
    color: string;
    height: number;
    width: number;
};

export const INITIAL_STATE: IPixelCanvas = {
    color: '#CCCCCC',
    height: 4,
    width: 6
};

export function reducer(lastState: IPixelCanvas = INITIAL_STATE, action: AnyAction): IPixelCanvas {
    let newState: IPixelCanvas;

    switch (action.type) {
        case CanvasActions.CHANGE_COLOR:
            newState = Object.assign({}, lastState);
            newState.color = action.value;
            return newState;
        case CanvasActions.CHANGE_HEIGHT:
            newState = Object.assign({}, lastState);
            newState.height = action.value;
            return newState;
        case CanvasActions.CHANGE_WIDTH:
            newState = Object.assign({}, lastState);
            newState.width = action.value;
            return newState;
        default:
            return lastState;
    }
}