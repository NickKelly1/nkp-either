/* eslint-disable @typescript-eslint/no-unused-vars */
export enum EitherTag {
  Left = 'left',
  Right = 'right',
}

export type LeftValue<T extends EitherBase<unknown, unknown>> = T['zL'];
export type RightValue<T extends EitherBase<unknown, unknown>> = T['zR'];

export interface Left<L> extends EitherBase<never, L> {
  tag: EitherTag;
  unwrap(): L;
}

export interface Right<R> extends EitherBase<R, never> {
  tag: EitherTag;
  unwrap(): R;
}

export type Either<R, L> = Right<R> | Left<L>;

export class EitherBase<R, L> {
  // virtual values
  readonly zR!: R;
  readonly zL!: L;

  constructor(tag: EitherTag.Left, value: L)
  constructor(tag: EitherTag.Right, value: R)
  constructor(readonly tag: EitherTag, protected readonly value: L | R) {
    //
  }


  /**
   * Get the value
   *
   * @returns
   */
  unwrapLeft(): L {
    if (this.isRight()) throw new TypeError('Failed to unwrap left: Either is Right');
    return this.value as L;
  }

  /**
   * Get the value
   *
   * @returns
   */
  unwrapRight(): R {
    if (this.isLeft()) throw new TypeError('Failed to unwrap left: Either is Left');
    return this.value as R;
  }

  /**
   * Get the value
   *
   * @returns
   */
  unwrap(): L | R {
    return this.value;
  }

  /**
   * Is this Either a Left?
   *
   * @returns
   */
  isLeft(): this is Left<L> {
    return this.tag === EitherTag.Left;
  }

  /**
   * is this Either a Right?
   *
   * @returns
   */
  isRight(): this is Right<R> {
    return this.tag === EitherTag.Right;
  }

  /**
   * Map both-sides of the either
   *
   * @param onRight
   * @param onLeft
   * @returns
   */
  bimap<NR, NL>(onRight: (rval: R) => NR, onLeft: (lval: L) => NL): Either<NR, NL> {
    if (this.isRight()) {
      return Either.right(onRight(this.value as R));
    }
    return Either.left(onLeft(this.value as L));
  }

  /**
   * Map the right-side of the either
   *
   * @param onRight
   * @returns
   */
  map<NR>(onRight: (rval: R) => NR): Either<NR, L> {
    if (this.isRight()) {
      return Either.right(onRight(this.value as R));
    }
    return this as unknown as Left<L>;
  }

  /**
   * Map the left-side of the either
   *
   * @param onLeft
   * @returns
   */
  mapLeft<NL>(onLeft: (lval: L) => NL): Either<R, NL> {
    if (this.isLeft()) {
      return Either.left(onLeft(this.value as L));
    }
    return this as unknown as Right<R>;
  }

  /**
   * Flat-map the right-side of the either
   *
   * @param onRight
   * @returns
   */
  flatMap<NR, NL>(onRight: (rval: R) => Right<NR>): Either<NR, L>;
  flatMap<NR, NL>(onRight: (rval: R) => Left<NL>): Left<L | NL>;
  flatMap<NR, NL>(onRight: (rval: R) => Either<NR, NL>): Either<NR, L | NL>;
  flatMap<NR, NL>(onRight: (rval: R) => Either<NR, NL>): Either<NR, L | NL> {
    if (this.isRight()) {
      return onRight(this.value as R);
    }
    return this as unknown as Left<L>;
  }

  /**
   * Flat-map the left-side of the either
   *
   * @param onLeft
   * @returns
   */
  flatMapLeft<NR, NL>(onLeft: (lval: L) => Right<NR>): Right<R | NR>;
  flatMapLeft<NR, NL>(onLeft: (lval: L) => Left<NL>): Either<R, NL>;
  flatMapLeft<NR, NL>(onLeft: (lval: L) => Either<NR, NL>): Either<R | NR, NL>;
  flatMapLeft<NR, NL>(onLeft: (lval: L) => Either<NR, NL>): Either<R | NR, NL> {
    if (this.isLeft()) {
      return onLeft(this.value as L);
    }
    return this as unknown as Right<R>;
  }

  /**
   * Map left-values to the right
   *
   * @param onLeft
   * @returns
   *
   * If RightValue is never, we the callee decide what RightValue becomes
   */
  orElse<NR = RightValue<this>>(onLeft: (lval: L) => NR): Right<NR | R> {
    if (this.isRight()) return this;
    return Either.right(onLeft(this.value as L));
  }

  /**
   * Flatten the right-side of the either
   *
   * @param this
   * @returns
   *
   * Generic NL causes TS to union this left value with the mapped left value
   */
  flat<NR, NL = LeftValue<this>>(this: Either<Either<NR, NL>, NL>): Either<NR, NL> {
    if (this.isLeft()) return this;
    return this.value as Either<NR, NL>;
  }

  /**
   * Flatten the left-side of the either
   *
   * @param this
   * @returns
   *
   * Generic NR causes TS to union this left value with the mapped right value
   */
  flatLeft<NL, NR = RightValue<this>>(this: Either<NR, Either<NR, NL>>): Either<NR, NL> {
    if (this.isRight()) return this;
    return this.value as Either<NR, NL>;
  }

  /**
   * Swap right-to-left and left-to-right
   *
   * @returns
   */
  swap(): Either<L, R> {
    if (this.isRight()) return Either.left(this.value as R);
    return Either.right(this.value as L);
  }
}

export const Either = {
  /**
   * Is the Either a Left?
   *
   * @param either
   * @returns
   */
  isLeft<R, L>(either: Either<R, L>): either is Left<L> {
    return either.isLeft();
  },

  /**
   * Is the Either a Right?
   *
   * @param either
   * @returns
   */
  isRight<R, L>(either: Either<R, L>): either is Right<R> {
    return either.isRight();
  },

  /**
   * Create an Either from the right value
   *
   * @param value
   * @returns
   */
  from<R, L>(value: R): Either<R, L> {
    return Either.right(value);
  },

  /**
   * Create an Either from the left value
   *
   * @param value
   * @returns
   */
  fromLeft<R, L>(value: L): Either<R, L> {
    return Either.left(value);
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
    return Either.right(value);
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
    if (value == null) return Either.left(value as null | undefined);
    return Either.right(value);
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
    if (value) return Either.right(value);
    return Either.left(value);
  },

  /**
   * Create a Right from the value
   *
   * @param rval
   * @returns
   */
  right<R>(rval: R): Right<R> {
    return new EitherBase(EitherTag.Right, rval) as Right<R>;
  },

  /**
   * Create an Left from the value
   *
   * @param lval
   * @returns
   */
  left<L>(lval: L): Left<L> {
    return new EitherBase(EitherTag.Left, lval) as Left<L>;
  },
};
