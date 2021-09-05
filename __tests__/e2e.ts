import { Either, Right } from '../src';

describe('e2e', () => {
  it('1', () => {
    const result: Right<number> = Either
      .right(5)
      .map((rval) => `value: ${rval}`)
      .map((rval) => ({ rval, }))
      .swap()
      .flatMapLeft(({ rval, }) => Either
        .right({ rval, })
        .swap()
        .mapLeft(({ rval, }) => Number(rval.match(/^value: (\d+)$/)![1]))
        .swap()
      );

    expect(result.isRight()).toEqual(true);
    expect(result.value).toEqual(5);
  });

  it('2', () => {
    const result = Either
      .right(5)
      .map((r) => r + 2)
      .swap()
      .mapLeft(r => r - 1)
      .swap()
      .flatMap(r => r >= 6
        ? Either.right(r)
        : Either.left(':(')
      )
      .map(rval => !!rval)
      .mapLeft(lval => `lval: ${lval}`)
      .swap();

    // @ts-expect-error
    const r1: Right<string> = result;
    expect(r1.isLeft()).toEqual(true);

    // @ts-expect-error
    const r2: Left<boolean> = result;
    expect(r2.isLeft()).toEqual(true);

    const r3: Either<string, boolean> = result;
    expect(r3.isLeft()).toEqual(true);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toEqual(true);
  });

  it('3', () => {
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

  });
});
