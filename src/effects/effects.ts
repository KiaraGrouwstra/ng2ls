import * as R from 'ramda';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
// import { of } from 'rxjs/observable/of';
import { MyAction, ActionCtor, ActionPair } from '../actions/actions';

export let unJson = <T>(resp: Response): T => resp.json();
// export let always = R.pipe(R.always, Observable.of);

// context dependencies: this.actions$: Actions;
export let makeEffect = <T,U,V,W>(pair: ActionPair<T>, okAction: ActionCtor<U|V>, mapper: (v: T) => { obs: Observable<U>, ok?: (v: U) => V, fail?: (e: Error) => W }, opts: {
  init?: T,  // trigger this effect immediately on startup
  debounce?: number, // 0
  read?: boolean,  // cancel previous results (good for read: GET, not for write: POST/PUT/PATCH/DELETE)
  fallback?: U,  // default value rather than failure
  failAction?: ActionCtor<Error|W>,
} = {}) => {
  let { init, debounce, read, fallback, failAction } = opts;
  let actions$: Actions = this.actions$;
  let filtered$: Observable<MyAction<T>> = actions$.ofType(pair.type); // could the exact action be inferred using a string-based lookup?
  let initialized$ = init ? filtered$.startWith(new (pair.action)(init)) : filtered$;
  let payload$ = initialized$
      .debounceTime(debounce || 0)
      .map(R.prop('payload'));
  let lambda = (v: T) => {
    let { obs, ok, fail } = mapper(v);
    let defaulted$ = !R.isNil(fallback) ? obs.catch(() => Observable.of(<U> fallback)) : obs;
    let created$ = defaulted$.map((v: U) => new okAction(ok ? ok(v) : v));
    let caught$ = failAction /*instanceof Object*/ ? created$.catch((error: Error) => Observable.of(new (<ActionCtor<Error|W>>failAction)(fail ? fail(error) : error))) : created$;
    return caught$;
  };
  return read ? payload$.switchMap(lambda) : payload$.mergeMap(lambda);
}
