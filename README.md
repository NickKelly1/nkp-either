# @nkp/either

[![npm version](https://badge.fury.io/js/%40nkp%2Feither.svg)](https://www.npmjs.com/package/@nkp/either)
[![Node.js Package](https://github.com/NickKelly1/nkp-either/actions/workflows/release.yml/badge.svg)](https://github.com/NickKelly1/nkp-either/actions/workflows/release.yml)
![Known Vulnerabilities](https://snyk.io/test/github/NickKelly1/nkp-either/badge.svg)

`@nkp/either` handles values of two possible types by wrapping the value in an `Either<R, L>`.

`Either<R, L>` is the union of `Right<R>` and `Left<L>` such that `Either<R, L> = Right<R> | Left<L>`.

Either provides utility methods to help the flow and transformation of values between the left and right sides.

```ts
const input = '0.5';

const result: string =
  // read the input
  toNumber(input)
    // if failed to parse, default to 50
    .orElse(() => 50)
    // must be less-than or equal-to 100
    .flatMap((number) => number <= 100
      ? Either.right(number)
      : Either.left(new Error('must be lte 100')))
    // transform to percentage
    .map(number => number * 100)
    // transform to string
    .map(percent => `the parsed value is: ${percent}%`)
    // throw if on a failure path
    .throwLeft()
    // extract the value
    .unwrap();

function toNumber(unknown: unknown): Either<number, string> {
  switch (typeof unknown) {
  case 'bigint': return Either.right(Number(unknown));
  case 'number': return Either.right(unknown);
  case 'string': {
    const num = Number(unknown);
    if (!Number.isFinite(num))
      return Either.left('Failed to parse number: string value is not numeric');
    return Either.right(num);
  }
  default: return Either.left(`Failed to parse number: unhandled type "${typeof unknown}""`);
  }
}
```

## Table of Contents

- [Installation](#installation)
  - [npm](#npm)
  - [yarn](#yarn)
  - [Exports](#exports)
- [Usage](#usage)
  - [Creating an Either](#creating-an-either)
  - [Methods](#methods)
    - [bimap](#bimap)
    - [bitap](#bitap)
    - [flat](#flat)
    - [flatMap](#flatmap)
    - [flatMapLeft](#flatmapleft)
    - [isLeft](#isleft)
    - [isRight](#isright)
    - [map](#map)
    - [mapLeft](#mapleft)
    - [mapSelf](#mapself)
    - [orElse](#orelse)
    - [tap](#tap)
    - [tapLeft](#tapleft)
    - [tapSelf](#tapself)
    - [throwLeft](#throwleft)
    - [throwRight](#throwright)
    - [unwrap](#unrwap)
    - [unwrapLeft](#unwrapleft)

## Installation

### NPM

```sh
npm install @nkp/either
```

### Yarn

```sh
yarn add @nkp/either
```

### Exports

`@nkp/either` targets CommonJS and ES modules. To utilise ES modules consider using a bundler like `webpack` or `rollup`.

## Usage

### Creating an Either

```ts
import { Either, Right, Left } from '@nkp/either';

// Right<number>
const right: Right<number> = Either.right(5);

// Left<string>
const left: Left<string> = Either.left('hello');

// Either<number, Error> (Right)
const right: Either<number, Error> = Either.fromRight<number, Error>(5);

// Either<number, Error> (Left)
const left: Left<string> = Either.fromLeft(new Error('an unknown error occured'));
```

### Methods

#### bimap

Maps both sides of the Either.

```ts
import { Either } from '@nkp/either';

const either: Either<number, string> = Either.fromRight<number. string>(5).

const bimapped: Either<string, Error> = either.bimap(
  function onRight(rval: number) {
    return `value is: ${rval}`;
  },
  function onLeft(lval: string) {
    return new Error(lval);
  },
)
```

#### bitap

Fire a callback on both sides of the Either.

```ts
import { Either } from '@nkp/either';

const either: Either<number, string> = Either.fromRight<number, string>(5).

const unaffected: Either<number, string> = either.bitap(
  function onRight(rval: number) {
    console.log(`right: ${rval}`);
  },
  function onLeft(lval: string) {
    console.log(`left: ${rval}`);
  },
)

either === unaffected; // true
```

#### flat

Flatten the right-side of the Either.

```ts
import { Either } from '@nkp/either';

const either: Either<Either<boolean, number>, string> =
  Either.fromRight<Either<boolean, number>, string>(Either.right(true)).

const flattened: Either<boolean, number | string> = either.flat();
```

#### flatmap

Map the right-side of the Either and flatten the result.

```ts
import { Either } from '@nkp/either';

const either: Either<number, Error> = Either.fromRight<number, Error>(100).

const flattened: Either<number, Error> either.flatMap((number) => number > 100
  ? Either.left(new Error('value must be lte 100'))
  : Either.right(number)
)
```

#### flatMapleft

Map the left-side of the Either and flatten the result.

```ts
import { Either } from '@nkp/either';

class HttpError extends Error {
  public readonly code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

const either: Either<number, HttpError> =
  Either.fromLeft<string, HttpError>(new HttpError('Unauthenticated', 401)).

const flattened: Either<string, HttpError> either.flatMapLeft((error) => error.code === 401
  ? Either.right('recovered from unauthorised error :)')
  : Either.left(error);
)
```

#### isleft

Is the Either a Left?

```ts
import { Either } from '@nkp/either';

const either = Either.fromRight<number, string>(5);

if (either.isLeft()) {
  either.value; // string
} else {
  either.value; // number
}
```

#### isRight

Is the Either a Right?

```ts
import { Either } from '@nkp/either';

const either = Either.fromRight<number, string>(5);

if (either.isRight()) {
  either.value; // number
} else {
  either.value; // string
}
```

#### map

Map the Either's right-side to a new value.

```ts
import { Either } from '@nkp/either';

const either = Either.fromRight<number, string>(5);

const mapped: Either<string, string> = either.map(number => `value: ${number}`);
```

#### mapleft

Map the Either's left-side to a new value.

```ts
import { Either } from '@nkp/either';

const either = Either.fromRight<number, string>(5);

const mapped: Either<string, boolean> = either.mapLeft(lval => !!lval);
```

#### mapSelf

Map this Either insance to some value.

```ts
import { Either, Right } from '@nkp/either';

const either = Either.fromRight<number, string>(5);

const mapped: boolean = either.mapSelf(self => self.isRight());
```

#### orElse

Map the the left-side of the Either into the right-side.

```ts
import { Either, Right } from '@nkp/either';

const either = Either.fromRight<number, string>(5);

const mapped: Right<number> = either.orElse(lval => Number(lval));
```

#### tap

Fire a callback on the right-side of the Either.

```ts
import { Either } from '@nkp/either';

const either: Either<number, string> = Either.fromRight<number, string>(5).

const unaffected: Either<number, string> = either.tap((rval: number) => {
  console.log(`right value is: ${rval}`);
});

either === unaffected; // true
```

#### tapLeft

Fire a callback on the left-side of the Either.

```ts
import { Either } from '@nkp/either';

const either: Either<number, string> = Either.fromRight<number, string>(5).

const unaffected: Either<number, string> = either.tapLeft((rval: string) => {
  console.log(`left value is: ${rval}`);
});

either === unaffected; // true
```

#### tapSelf

Fire a callback on the Either instance.

```ts
import { Either } from '@nkp/either';

const either: Either<number, string> = Either.fromRight<number, string>(5).

const unaffected: Either<number, string> =
  either.tapSelf((self: Either<number, sting>) => {
    console.log(`the either is: ${self}`);
  });

either === unaffected; // true
```

#### throwLeft

Throw on the left-side of the Either.

```ts
import { Either } from '@nkp/either';

const either: Either<number, Error> = Either.fromRight<number, Error>(5).

const afterThrow: Right<number> = either.throwLeft();
```

#### throwRight

Throw on the right-side of the Either.

```ts
import { Either } from '@nkp/either';

const either: Either<Error, number> =
  Either.fromRight<Error, number>(new Error('something went wrong')).

const afterThrow: Left<number> = either.throwRight();
```

#### unrwap

Extract the right-side of the Either.

Throws if the Either is Left.

```ts
import { Either } from '@nkp/either';

const either: Either<number, boolean> =
  Either.fromRight<number, boolean>(5).

const value: number = either.unwrap();
```

#### unwrapLeft

Extract the left-side of the Either.

Throws if the Either is Right.

```ts
import { Either } from '@nkp/either';

const either: Either<number, boolean> =
  Either.fromRight<number, boolean>(5).

const value: boolean = either.unwrapLeft();
```

## Publishing

To a release a new version:

1. Update the version number in package.json
2. Push the new version to the `master` branch on GitHub
3. Create a `new release` on GitHub for the latest version

This will trigger a GitHub action that tests and publishes the npm package.
