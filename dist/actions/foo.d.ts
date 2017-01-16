import { ActionCtor } from './actions';
export declare let pairs: {
    search: {
        type: string;
        action: ActionCtor<string>;
    };
    searchComplete: {
        type: string;
        action: ActionCtor<string>;
    };
};
export declare const Types: {
    search: string;
    searchComplete: string;
};
export declare let actions: {
    search: ActionCtor<string>;
    searchComplete: ActionCtor<string>;
};
export declare type Actions = typeof actions.search | typeof actions.searchComplete;
