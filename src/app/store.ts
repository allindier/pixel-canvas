import { combineReducers } from "redux";
import undoable from "redux-undo";
import { reducer as app } from "./app.store";
import {
    getInitialState,
    IPixelCanvas,
    reducer as canvas,
} from "./pixel-canvas/pixel-canvas.store";

export interface IAppState {
    canvas: IPixelCanvas;
}

export const INITIAL_STATE: IAppState = {
    canvas: getInitialState(),
};

export const rootReducer = combineReducers<IAppState>({
    app,
    canvas: undoable(canvas, {
        limit: 20,
    }),
});
