import { combineReducers } from "redux";
import undoable from "redux-undo";
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

export interface IAppState {
  canvasData: {
    // Technically there are also past and future fields.  I don't care about those.
    present: IPixelCanvasData;
  };
  canvasView: IPixelCanvasView;
}

/*
  Sort of a workaround.  redux-undo messes with the state of the object, so while this is basically
  the same type as IAppState, it must lack the present field
*/
export const INITIAL_STATE: any = {
  canvasData: getInitialDataState(),
  canvasView: getInitialViewState(),
};

export const rootReducer = combineReducers<IAppState>({
  canvasData: undoable(dataReducer, {
    limit: 20,
  }),
  canvasView: viewReducer,
});
