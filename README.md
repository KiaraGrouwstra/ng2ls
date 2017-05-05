# ng2ls
Useful tools for Angular 2

### CLI usage
```bash
cd src
ts-node store-gen.ts
```

### dynamic ngrx generation

Add the following to your `app.module.ts`:
```ts
import 'reflect-metadata';
```
Without this, you will receive the following error:
```
Cannot read property 'length' of undefined
    at Object.curry
```
