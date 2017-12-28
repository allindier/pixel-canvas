import { combineReducers } from "redux";
import undoable from "redux-undo";
import { reducer as app } from "./app.store";
import {
  dataReducer,
  getInitialState as getInitialDataState,
  IPixelCanvasData,
} from "./pixel-canvas/pixel-canvas-data.store";
import {
  getInitialState as getInitialViewState,
  IPixelCanvasView,
  viewReducer,
} from "./pixel-canvas/pixel-canvas-view.store";

export interface ICanvas {
  canvasData: IPixelCanvasData;
  canvasView: IPixelCanvasView;
}

export interface IAppState extends ICanvas {
  app: symbol;
}

export const INITIAL_STATE: IAppState = {
  app: Symbol(),
  canvasData: getInitialDataState(),
  canvasView: getInitialViewState(),
};

export const rootReducer = combineReducers<IAppState>({
  app,
  canvasData: undoable(dataReducer, {
    limit: 20,
  }),
  canvasView: viewReducer,
});
