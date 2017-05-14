import * as R from 'ramda';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { makeEffect } from '../../effects/effects';
import { actions as foo, Types } from '../foo/actions';

@Injectable()
export class FooEffects {

  constructor(
    // private http: Http,
    private actions$: Actions,
  ) {}

  @Effect() log$ = makeEffect.call(this, { action: foo.log, type: Types.log }, foo.logOk, (pl: number) => {
    let blah = pl;
    return {
      obs: <any> Observable.from([0]),
      ok: (res: number) => blah,
      fail: (e: Error) => 'bar',
    };
  }, { init: 0, debounce: 0, read: false, fallback: 0, failAction: foo.logNg });

  @Effect() bar$ = makeEffect.call(this, { action: foo.bar, type: Types.bar }, foo.barOk, (pl: number) => (<any> { obs: Observable.from([0]) }), {});

}
