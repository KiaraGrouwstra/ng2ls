import { Type } from '@angular/core';
import { Action, Dispatcher, Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import 'rxjs/operator/withLatestFrom';
import 'rxjs/operator/switchMap';
export interface Interception {
    intercept(store: Store<any>, action: Action): Observable<Action>;
}
export declare class Interceptor extends Subject<Action> {
    private _store;
    private _dispatcher;
    private _interceptor;
    constructor(_store: Store<any>, _dispatcher: Dispatcher, _interceptor: Interception);
    dispatch(action: Action): void;
}
export declare function _interceptorFactory(store: Store<any>, dispatcher: Dispatcher, interception: Interception): Interceptor;
export declare class InterceptModule {
    static provideInterceptor(type: Type<any>): {
        ngModule: typeof InterceptModule;
        providers: (Type<any> | {
            provide: typeof Interceptor;
            useFactory: (store: Store<any>, dispatcher: Dispatcher, interception: Interception) => Interceptor;
            deps: Type<any>[];
        })[];
    };
}
