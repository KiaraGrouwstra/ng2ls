export default {
  entry: './release/index.js',
  dest: './release/bundles/ng2ls.umd.js',
  format: 'umd',
  moduleName: 'ng2ls',
  globals: {
    '@angular/core': 'ng.core',
    'rxjs/Observable': 'Rx',
    'rxjs/Subject': 'Rx',
    // 'rxjs/operator/mergeMap': 'Rx.Observable.prototype',
    // 'rxjs/operator/do': 'Rx.Observable.prototype',
    // 'rxjs/observable/from': 'Rx.Observable'
  }
}