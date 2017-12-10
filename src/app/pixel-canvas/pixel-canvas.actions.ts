import { Injectable } from "@angular/core";
import { Action, AnyAction } from "redux";

@Injectable()
export class CanvasActions {
    public static readonly CANVAS_CLICK = "pixelChange.canvasClick";
    public static readonly CHANGE_COLOR = "pixelChange.changeColor";
    public static readonly CHANGE_HEIGHT = "pixelChange.changeHeight";
    public static readonly CHANGE_WIDTH = "pixelChange.changeWidth";
    public static readonly CLEAR_CANVAS = "pixelChange.clearCanvas";

    public canvasClick(xCoord: number, yCoord: number) {
        return {
            type: CanvasActions.CANVAS_CLICK,
            value: [xCoord, yCoord],
        };
    }

    public changeColor(color: string): AnyAction {
        return {
            type: CanvasActions.CHANGE_COLOR,
            value: color,
        };
    }

    public changeHeight(height: number): AnyAction {
        return {
            type: CanvasActions.CHANGE_HEIGHT,
            value: height,
        };
    }

    public changeWidth(width: number): AnyAction {
        return {
            type: CanvasActions.CHANGE_WIDTH,
            value: width,
        };
    }

    public clearCanvas(): Action {
        return {
            type: CanvasActions.CLEAR_CANVAS,
        };
    }
}
