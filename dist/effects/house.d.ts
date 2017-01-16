import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/debounceTime';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Http } from '@angular/http';
import { Actions } from '@ngrx/effects';
import { MyAction } from '../actions/actions';
export declare class HouseEffects {
    private http;
    private actions$;
    constructor(http: Http, actions$: Actions);
    /**
     * `dispatch`: doesn't yield actions back to the store so ignore. `defer` makes an observable when subscribed to.
     */
    openDB$: Observable<any>;
    search$: Observable<Action>;
    search$2: Observable<MyAction<Error>> | Observable<MyAction<string>>;
    search$3: Observable<MyAction<Error>> | Observable<MyAction<{}>>;
}
