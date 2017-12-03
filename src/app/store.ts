import {
    INITIAL_STATE as CANVAS_INITAL_STATE,
    IPixelCanvas,
    reducer as canvas
} from './pixel-canvas/pixel-canvas.store';
import { combineReducers } from 'redux';

export interface IAppState {
    canvas: IPixelCanvas;
}

export const INITIAL_STATE: IAppState = {
    canvas: CANVAS_INITAL_STATE
}

export const rootReducer = combineReducers<IAppState>({
    canvas
});