import { elemToArr, arrToArr, elemToSet, arrToSet, setToSet, loggers, notify, combLastObs, mapComb } from './rx_helpers';  //, emitter
import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/from';
import * as R from 'ramda';
// // let test = (obs, val, txt) => obs.subscribe(e => console.log(JSON.stringify(e) == JSON.stringify(val), txt, JSON.stringify(e)));
// let rxit = require('jasmine-rx').rxit;
let fail = (e: string) => alert(e);

describe('Rx Helpers', () => {

  let do_obs = <T>(done: () => void, obs: Observable<T>, test: (v: any) => boolean, not_done = false) => obs.subscribe(not_done ? R.pipe(test, done) : test, R.pipe(fail, done), done);
  // let obs_it = (desc, obs, test) => it(desc, (done) => obs.subscribe(test, fail(done), done));
  let people = [{"id":1,"name":"Brad"},{"id":2,"name":"Jules"},{"id":3,"name":"Jeff"}];
  let keys = ["id","name"]; //R.keys(people);
  let obs: Observable<any>, flat: Observable<any>;

  beforeEach(() => {
    // obs = http.get(`api/people.json`).map(y => y.json())
    obs = Observable.from([people])
    flat = obs.mergeMap((x,i) => x);
  })

  it('spits out the original array (like http)', (d) => do_obs(d,
    obs,
    (v: any) => expect(v).toEqual(people)
  ))

  it("if it's just one array then toArray() wraps it in another", (d) => do_obs(d,
    obs.toArray(),
    (v: any) => expect(v).toEqual([people])
  ))

  it('flatMap() flattens an array, toArray() merges it back', (d) => do_obs(d,
    flat.toArray(),
    (v: any) => expect(v).toEqual(people)
  ))

  it('elemToArr gradually merge items', (d) => do_obs(d,
    flat.scan(elemToArr, []).last(),
    (v: any) => expect(v).toEqual(people)
  ))

  it('arrToArr gradually merges arrays', (d) => do_obs(d,
    flat.map(e => [e]).scan(arrToArr, []).last(),
    (v: any) => expect(v).toEqual(people)
  ))

  it('elemToSet gradually merges items into a set', (d) => do_obs(d,
    flat
      .map(e => R.keys(e))
      .mergeMap((x,i) => x)
      .scan(elemToSet, new Set)
      .last()
      .map(Array.from),
    (v: any) => expect(v).toEqual(keys)
  ))

  it('arrToSet gradually merges arrays into a set', (d) => do_obs(d,
    flat
      .map(e => R.keys(e))
      .scan(arrToSet, new Set)
      .last()
      .map(Array.from),
    (v: any) => expect(v).toEqual(keys)
  ))

  it('setToSet gradually merges sets into a set', (d) => do_obs(d,
    flat
      .map(e => new Set(R.keys(e)))
      .scan(setToSet, new Set)
      .last()
      .map(Array.from),
    (v: any) => expect(v).toEqual(keys)
  ))

  it('combLastObs combines the latest values from multiple Observables for use in one', (d) => do_obs(d,
    combLastObs([1,2,3].map(v => new BehaviorSubject(v))),
    (r: any) => expect(r).toEqual([1,2,3])
    , true
  ))

  it('mapComb maps the latest values of a set of Observables to a lambda', (d) => do_obs(d,
    mapComb(
      ['foo','bar'].map(v => new BehaviorSubject(v)),
      (foo: string, bar: string) => foo + bar
    ),
    (r: string) => expect(r).toEqual('foobar')
    , true
  ))

  // it('emitter makes an ng2 EventEmitter (wrapped Rx Subject) with an initial value', (d) => do_obs(d,
  //   emitter('foo'),
  //   (v) => expect(v).toEqual('foo')
  // ))

  // CAN'T STRINGIFY SETS without Array.from(set)

})
