import { AnyAction } from 'redux';
import { CanvasActions } from './pixel-canvas.actions';

export interface IPixelCanvas {
    height: number;
    width: number;
};

export const INITIAL_STATE: IPixelCanvas = {
    height: 4,
    width: 6
};

export function reducer(lastState: IPixelCanvas = INITIAL_STATE, action: AnyAction): IPixelCanvas {
    let newState;

    switch (action.type) {
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