import * as R from 'ramda';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { actions } from './actions';
let { foo } = actions;

@Injectable()
export class FooEffects {

  constructor(
    private http: Http,
    private actions$: Actions,
  ) {}

  @Effect() log$ = makeEffect(foo.log, foo.logOk, (pl: number) => {
    let blah = pl;
    return {
      obs: Observable.from([0]),
      ok: blah,
      ng: 'bar',
    };
  }, { init: 0, debounce: 0, read: false, fallback: 0, failAction: foo.logNg });

  @Effect() bar$ = makeEffect(foo.bar, foo.barOk, (pl: number) => ({ obs: Observable.from([0]) }), {});

}
