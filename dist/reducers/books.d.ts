import { Observable } from 'rxjs/Observable';
import { Book } from '../models/models';
export interface State {
    ids: string[];
    entities: {
        [id: string]: Book;
    };
    selectedBookId: string | null;
}
export declare const initialState: State;
export declare let reducers: {
    [x: number]: ((state: State, books: any[]) => {
        ids: {}[];
        entities: any;
        selectedBookId: string | null;
    }) | ((state: State, book: any) => {
        ids: any[];
        entities: {
            [id: string]: any;
        } & {
            [x: number]: any;
        };
        selectedBookId: string | null;
    }) | ((state: State, selectedBookId: number) => {
        ids: string[];
        entities: {
            [id: string]: any;
        };
        selectedBookId: number;
    });
};
export declare let selectors: {
    selectedBook(state$: Observable<State>): Observable<any>;
    allBooks(state$: Observable<State>): Observable<any[]>;
};
