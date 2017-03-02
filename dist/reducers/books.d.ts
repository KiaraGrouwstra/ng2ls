import { Observable } from 'rxjs/Observable';
export declare type Book = {
    id: string;
};
export interface State {
    ids: string[];
    entities: {
        [id: string]: Book;
    };
    selectedBookId: string | null;
}
export declare const initialState: State;
export declare let reducers: {
    [x: number]: ((state: State, books: {
        id: string;
    }[]) => {
        ids: {}[];
        entities: any;
        selectedBookId: string | null;
    }) | ((state: State, book: {
        id: string;
    }) => {
        ids: string[];
        entities: any;
        selectedBookId: string | null;
    }) | ((state: State, selectedBookId: number) => {
        ids: string[];
        entities: {
            [id: string]: {
                id: string;
            };
        };
        selectedBookId: number;
    });
};
export declare let selectors: {
    selectedBook: (state$: Observable<{}>) => Observable<any>;
    allBooks: (state$: Observable<{}>) => Observable<any>;
};
