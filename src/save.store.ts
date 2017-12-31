import { Action } from "redux";
import { SaveActions } from "./save.actions";

export function reducer(lastState: symbol = Symbol(), action: Action) {
  switch (action.type) {
    case SaveActions.SAVE_CANVAS:
      return Symbol();
    default:
      return lastState;
  }
}
