import { Action } from "redux";
import { AppActions } from "./app.actions";

export function reducer(lastState: symbol = Symbol(), action: Action) {
  switch (action.type) {
    case AppActions.SAVE_CANVAS:
      return Symbol();
    default:
      return lastState;
  }
}
