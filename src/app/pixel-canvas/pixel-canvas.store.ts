import { Action } from 'redux';

export interface IPixelCanvas {

};

export const INITIAL_STATE: IPixelCanvas = {

};

export function reducer(lastState: IPixelCanvas = INITIAL_STATE, action: Action): IPixelCanvas {
    return lastState;
}