import { Injectable } from '@angular/core';
import { Action, AnyAction } from 'redux';

@Injectable()
export class CanvasActions {
    static readonly CHANGE_COLOR = 'pixelChange.changeColor';
    static readonly CHANGE_HEIGHT = 'pixelChange.changeHeight';
    static readonly CHANGE_WIDTH = 'pixelChange.changeWidth';

    changeColor(color: string): AnyAction {
        return {
            type: CanvasActions.CHANGE_COLOR,
            value: color
        };
    }

    changeHeight(height: number): AnyAction {
        return {
            type: CanvasActions.CHANGE_HEIGHT,
            value: height
        };
    }
    
    changeWidth(width: number): AnyAction {
        return {
            type: CanvasActions.CHANGE_WIDTH,
            value: width
        };
    }
}
