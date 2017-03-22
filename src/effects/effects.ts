import * as R from 'ramda';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
// import { of } from 'rxjs/observable/of';
import { MyAction } from '../actions/actions';
import { ActionPair, ActionCtor } from '../actions/actions';
import { Actions } from '@ngrx/effects';
// import { Observable } from 'rxjs';

export let unJson = <T>(resp: Response): T => resp.json();
// export let always = R.pipe(R.always, Observable.of);

// context dependencies: this.actions$: Actions;
export function makeEffect <T,U,V,W>(pair: ActionPair<T>, completeAction: ActionCtor<U>, mapper: (v: T) => { obs: Observable<U>, complete?: V, fail?: W }, opts: {
  init?: T,  // trigger this effect immediately on startup
  debounce?: number, // 0
  read?: boolean,  // cancel previous results (good for read: GET, not for write: POST/PUT/PATCH/DELETE)
  fallback?: U,  // default value rather than failure
  failAction?: ActionCtor<Error>,
} = {}) {
  let { init, debounce, read, fallback, failAction } = opts;
  // let actions$: Actions = this.actions$;
  let actions$: Actions = this.actions$;
  let filtered$: Observable<MyAction<T>> = actions$.ofType(pair.type); // could the exact action be inferred using a string-based lookup?
  let initialized$ = init ? filtered$.startWith(new (pair.action)(init)) : filtered$;
  let payload$ = initialized$
      .debounceTime(debounce || 0)
      .map(R.prop('payload'));
  let lambda = (v: T) => {
    let { obs, complete, fail } = mapper(v);
    let defaulted$ = !R.isNil(fallback) ? obs.catch(() => Observable.of(<U> fallback)) : obs;
    let created$ = defaulted$.map((d: U) => new completeAction(<any>complete || d));
    let caught$ = failAction /*instanceof Object*/ ? created$.catch((error: Error) => Observable.of(new (<ActionCtor<Error>>failAction)( <any>fail || error ))) : created$;
    return caught$;
  };
  return read ? payload$.switchMap(<any>lambda) : payload$.mergeMap(<any>lambda);
}
