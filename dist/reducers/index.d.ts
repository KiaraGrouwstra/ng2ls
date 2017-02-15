import { ActionReducer } from '@ngrx/store';
import { Obj } from '../models/models';
export declare type House = {};
export declare type Device = {};
export declare type StateNav = string;
export declare type StateHouses = House[];
export declare type StateProjects = {}[];
export declare type StateDevices = Obj<Device>;
export interface State {
    houses: StateHouses;
}
export declare let reducer: ActionReducer<State>;
