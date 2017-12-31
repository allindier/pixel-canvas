import { Injectable } from "@angular/core";
import { Action } from "redux";

@Injectable()
export class SaveActions {
    public static readonly SAVE_CANVAS = "canvasSave.saveCanvas";

    public saveCanvas(): Action {
        return {
            type: SaveActions.SAVE_CANVAS,
        };
    }
}
