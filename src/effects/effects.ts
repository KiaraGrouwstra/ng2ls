import * as R from 'ramda';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MyAction } from '../actions/actions';

export let unJson = <T>(resp: Response): T => resp.json();
// export let always = R.pipe(R.always, of);
