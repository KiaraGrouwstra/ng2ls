import * as R from 'ramda';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { actions } from './actions';

@Injectable()
export class FooEffects {
  constructor(
    private http: Http,
    private actions$: Actions,
  ) {}

    @Effect() log$ = makeEffect(actions.foo.log, actions.foo.logComplete, (pl: number) => {
      let blah = pl;
      return {
        obs: Observable.from([0]),
        complete: blah,
        fail: 'bar',
      };
    }, { init: 0, debounce: 0, read: false, fallback: 0, failAction: actions.foo.logFailure });

    @Effect() bar$ = makeEffect(actions.foo.bar, actions.foo.barComplete, (pl: number) => ({ obs: Observable.from([0]) }), {});

}
