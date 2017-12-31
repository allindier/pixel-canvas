import { Injectable } from "@angular/core";
import { Action } from "redux";

@Injectable()
export class AppActions {
    public static readonly SAVE_CANVAS = "pixelChange.saveCanvas";

    public saveCanvas(): Action {
        return {
            type: AppActions.SAVE_CANVAS,
        };
    }
}
