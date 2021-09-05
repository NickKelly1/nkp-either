/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export type LEFT = 'left';
export const LEFT: LEFT = 'left';

export type RIGHT = 'right';
export const RIGHT: RIGHT = 'right';

// compatibility types
export interface EitherKindLike<R, L> {
  readonly value: L | R;
  readonly tag: LEFT | RIGHT;
  isLeft(): this is DefiniteLeftLike<L>;
  isRight(): this is DefiniteRightLike<R>;
  readonly zL: L;
  readonly zR: R;
}
export type LeftValue<T extends EitherKindLike<unknown, unknown>> = T['zL'];
export type RightValue<T extends EitherKindLike<unknown, unknown>> = T['zR'];
export type TagValue<T extends EitherKindLike<unknown, unknown>> = T['tag'];

export interface LeftLike<L> extends EitherKindLike<never, L> { readonly tag: LEFT; readonly value: L; }
export interface RightLike<R> extends EitherKindLike<R, never> { readonly tag: RIGHT; readonly value: R; }
export type MaybeEitherLike<R, L> = LeftLike<L> | RightLike<R>;
export type DefiniteLeftLike<L> = L extends never ? never : LeftLike<L>
export type DefiniteRightLike<R> = R extends never ? never : RightLike<R>
export type EitherLike<R, L> = DefiniteRightLike<R> | DefiniteLeftLike<L> ;

export interface Left<L> extends EitherKind<never, L> { readonly tag: LEFT; readonly value: L; }
export interface Right<R> extends EitherKind<R, never> { readonly tag: RIGHT; readonly value: R; }
export type MaybeEither<R, L> = Left<L> | Right<R>;
export type DefiniteLeft<L> = L extends never ? never : Left<L>;
export type DefiniteRight<R> = R extends never ? never : Right<R>;
export type Either<R, L> = | DefiniteRight<R> | DefiniteLeft<L>;

export class EitherKind<R, L> implements EitherKindLike<R, L> {
  // virtual values
  readonly zR!: R;
  readonly zL!: L;

  constructor(tag: LEFT, value: L)
  constructor(tag: RIGHT, value: R)
  constructor(readonly tag: LEFT | RIGHT, public readonly value: L | R) {
    //
  }


  /**
   * Get the value
   *
   * @returns
   */
  unwrapLeft(): L {
    if (this.isRight()) throw new TypeError('Failed to unwrapLeft: Either is Right');
    return this.value as L;
  }

  /**
   * Get the value
   *
   * @returns
   */
  unwrap(): R {
    if (this.isLeft()) throw new TypeError('Failed to unwrap: Either is Left');
    return this.value as R;
  }

  /**
   * Is this Either a Left?
   *
   * @returns
   */
  isLeft(): this is DefiniteLeft<L> {
    return this.tag === LEFT;
  }

  /**
   * is this Either a Right?
   *
   * @returns
   */
  isRight(): this is DefiniteRight<R> {
    return this.tag === RIGHT;
  }

  /**
   * Map both-sides of the either
   *
   * @param onRight
   * @param onLeft
   * @returns
   */
  bimap<NR, NL>(onRight: (rval: R) => NR, onLeft: (lval: L) => NL):
    this extends RightLike<R> ? DefiniteRight<NR>
    : this extends LeftLike<L> ? DefiniteLeft<NL>
    : Either<NR, NL>
  {
    if (this.isRight()) {
      return Either.right(onRight(this.value as R)) as any;
    }
    return Either.left(onLeft(this.value as L)) as any;
  }

  /**
   * Map the right-side of the either
   *
   * @param onRight
   * @returns
   */
  map<NR>(onRight: (rval: R) => NR):
    this extends RightLike<R> ? DefiniteRight<NR>
    : this extends LeftLike<L> ? DefiniteLeft<L>
    : Either<NR, L>
  {
    if (this.isRight()) {
      return Either.right(onRight(this.value as R)) as any;
    }
    return this as unknown as DefiniteLeft<L> as any;
  }

  /**
   * Map the left-side of the either
   *
   * @param onLeft
   * @returns
   */
  mapLeft<NL>(onLeft: (lval: L) => NL):
    this extends RightLike<R> ? DefiniteRight<R>
    : this extends LeftLike<L> ? DefiniteLeft<NL>
    : Either<R, NL>
  {
    if (this.isLeft()) {
      return Either.left(onLeft(this.value as L)) as any;
    }
    return this as unknown as DefiniteRight<R> as any;
  }

  /**
   * Flat-map the right-side of the either
   *
   * @param onRight
   * @returns
   */
  flatMap<E extends EitherLike<unknown, unknown>>(onRight: (rval: R) => E):
    this extends RightLike<R> ? Either<RightValue<E>, LeftValue<E>>
    : this extends LeftLike<L> ? DefiniteLeft<L>
    : Either<RightValue<E>, LeftValue<E> | L>
  {
    if (this.isRight()) {
      const inner = onRight(this.value);
      if (inner.isRight()) return Either.right(inner.value) as any;
      return Either.left((inner).value) as any;
    }
    return this as unknown as DefiniteLeft<L>;
  }

  /**
   * Flat-map the left-side of the either
   *
   * @param onLeft
   * @returns
   */
  flatMapLeft<E extends EitherLike<unknown, unknown>>(onLeft: (lval: L) => E):
    this extends RightLike<R> ? DefiniteRight<R>
    : this extends LeftLike<L> ? Either<RightValue<E>, LeftValue<E>>
    :  Either<RightValue<E> | R, LeftValue<E>>
  {
    if (this.isLeft()) {
      const inner = onLeft(this.value);
      if (inner.isRight()) return Either.right(inner.value) as any;
      return Either.left(inner.value) as any;
    }
    return this as any;
  }

  /**
   * Map left-values to the right
   *
   * @param onLeft
   * @returns
   */
  orElse<NR>(onLeft: (lval: L) => NR): Right<NR | R> {
    if (this.isRight()) return this as any;
    return Either.right(onLeft(this.value as L)) as any;
  }

  /**
   * Flatten the right-side of the either
   *
   * @param this
   * @returns
   */
  flat():
    this extends RightLike<RightLike<any>> ? DefiniteRight<RightValue<RightValue<this>>>
    : this extends RightLike<LeftLike<any>> ? DefiniteLeft<LeftValue<RightValue<this>>>
    : this extends RightLike<EitherLike<any, any>> ? Either<RightValue<RightValue<this>>, LeftValue<RightValue<this>>>
    : this extends LeftLike<L> ? DefiniteLeft<L>
    : Either<R, L>
  {
    if (this.isLeft()) return this as any;
    return this.value as any;
  }

  /**
   * Fire a side-effect on the right-value
   *
   * @param onRight
   * @returns
   */
  tap(onRight: (value: R) => unknown): this {
    if (this.isRight()) onRight(this.value);
    return this;
  }

  /**
   * Fire a side-effect on the left-value
   *
   * @param onLeft
   * @returns
   */
  tapLeft(onLeft: (value: L) => unknown): this {
    if (this.isLeft()) onLeft(this.value);
    return this;
  }

  /**
   * Fire a side-effect on both sides
   *
   * @param onRight
   * @param onLeft
   * @returns
   */
  bitap(onRight: (value: R) => unknown, onLeft: (value: L) => unknown): this {
    if (this.isRight()) onRight(this.value);
    else onLeft(this.value as L);
    return this;
  }

  /**
   * Fire a side-effect on the Either
   *
   * @param callbackfn
   * @returns
   */
  tapSelf(callbackfn: (self: this) => unknown): this {
    callbackfn(this);
    return this;
  }

  /**
   * Map the Either to some other value
   *
   * @param callbackfn
   * @returns
   */
  mapSelf<R>(callbackfn: (self: this) => R): R {
    return callbackfn(this);
  }

  /**
   * If isLeft, throw on the value
   *
   * @returns
   */
  throwLeft(): DefiniteRight<R> {
    if (this.isLeft()) throw this.value;
    return this as unknown as DefiniteRight<R>;
  }

  /**
   * If isLeft, throw on the value
   *
   * @returns
   */
  throwRight(): DefiniteLeft<L> {
    if (this.isRight()) throw this.value;
    return this as unknown as DefiniteLeft<L>;
  }

  /**
   * Swap right-to-left and left-to-right
   *
   * @returns
   */
  swap(): Either<L, R> {
    if (this.isRight()) return Either.left(this.value as R) as any;
    return Either.right(this.value as L) as any;
  }
}

export const Either = {
  /**
   * Is the Either a Left?
   *
   * @param either
   * @returns
   */
  isLeft<R, L>(either: Either<R, L>): either is DefiniteLeft<L> {
    return either.isLeft();
  },

  /**
   * Is the Either a Right?
   *
   * @param either
   * @returns
   */
  isRight<R, L>(either: Either<R, L>): either is DefiniteRight<R> {
    return either.isRight();
  },

  /**
   * Create an Either from the value
   *
   * Right if not null
   * Left if null
   *
   * @param value
   * @returns
   */
  fromNull<R>(value: R | null): Either<R, null> {
    if (value === null) return Either.left(null);
    return Either.right(value) as Either<R, null>;
  },

  /**
   * Create an Either from the value
   *
   * Right if not null and not undefined
   * Left if null or undefined
   *
   * @param value
   * @returns
   */
  fromNullable<R>(value: R | null | undefined): Either<R, null | undefined> {
    if (value == null) return Either.left(value as null | undefined) as Either<R, null | undefined>;
    return Either.right(value) as Either<R, null | undefined>;
  },

  /**
   * Create an Either from the value
   * Right if truthy
   * Left if falsy
   *
   * @param value
   * @returns
   */
  fromTruthy<R>(value: R): Either<R, R> {
    if (value) return Either.right(value) as Either<R,R>;
    return Either.left(value) as Either<R, R>;
  },

  /**
   * Create an Either (Right) from the value
   *
   * @param rval
   * @returns
   */
  fromRight<R, L>(rval: R): Either<R, L> {
    return Either.right(rval) as Either<R, L>;
  },

  /**
   * Create an Either (Left) from the value
   *
   * @param lval
   * @returns
   */
  fromLeft<R, L>(lval: L): Either<R, L> {
    return Either.left(lval) as Either<R, L>;
  },

  /**
   * Create a Right from the value
   *
   * @param rval
   * @returns
   */
  // right<R>(rval: R): DefiniteRight<R> {
  right<R>(rval: R): Right<R> {
    return new EitherKind(RIGHT, rval) as any;
  },

  /**
   * Create a Left from the value
   *
   * @param lval
   * @returns
   */
  left<L>(lval: L): Left<L> {
    return new EitherKind(LEFT, lval) as any; // Left<L> as DefiniteLeft<L>;
  },
};
