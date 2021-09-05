/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Right, Either, Left } from '../either';
import { val } from './value.spec.util';

describe('Either', () => {
  describe('.flatMap(...)', () => {
    describe('Right ->', () => {
      it('Right', () => {
        const e1: Right<val.r1> = Either.right(val.r1);
        const e2: Right<val.r2> = e1.flatMap((_: val.r1): Right<val.r2> => Either.right(val.r2));

        expect(e1.isRight()).toEqual(true);

        const value: val.r2 = e2.value;
        expect(value).toEqual(val.r2);
      });


      it('Either (Right)', () => {
        const e1: Right<val.r1> = Either.right(val.r1);
        const e2: Either<val.r2, val.l2> = e1.flatMap((_: val.r1): Either<val.r2, val.l2> => Either.right(val.r2));

        expect(e2.isRight()).toEqual(true);

        // @ts-expect-error
        const vRight: val.r2 = e2.value;
        expect(vRight).toEqual(val.r2);

        // @ts-expect-error
        const vLeft: val.l2 = e2.value;
        expect(vLeft).toEqual(val.r2);

        const vBoth: val.r2 | val.l2 = e2.value;
        expect(vBoth).toEqual(val.r2);
      });


      it('Left', () => {
        const e1: Right<val.r1> = Either.right(val.r1);
        const e2: Left<val.l2> = e1.flatMap((_: val.r1): Left<val.l2> => Either.left(val.l2));

        expect(e2.isRight()).toEqual(false);

        const vLeft: val.l2 = e2.value;
        expect(vLeft).toEqual(val.l2);
      });


      it('Either (Left)', () => {
        const e1: Right<val.r1> = Either.right(val.r1);
        const e2: Either<val.r2, val.l2> = e1.flatMap((_: val.r1): Either<val.r2, val.l2> => Either.left(val.l2));

        expect(e2.isRight()).toEqual(false);

        // @ts-expect-error
        const vRight: val.r2 = e2.value;
        expect(vRight).toEqual(val.l2);

        // @ts-expect-error
        const vLeft: val.l2 = e2.value;
        expect(vLeft).toEqual(val.l2);

        const vBoth: val.r2 | val.l2 = e2.value;
        expect(vBoth).toEqual(val.l2);
      });
    });


    describe('Either (Right) ->', () => {
      it('Right', () => {
        const e1: Either<val.r1, val.l1> = Either.right(val.r1) as Either<val.r1, val.l1>;
        const e2: Either<val.r2, val.l1> = e1.flatMap((_: val.r1): Right<val.r2> => Either.right(val.r2));

        expect(e1.isRight()).toEqual(true);

        // @ts-expect-error
        const vRight: val.r2 = e2.value;
        expect(vRight).toEqual(val.r2);

        // @ts-expect-error
        const vLeft: val.l1 = e2.value;
        expect(vLeft).toEqual(val.r2);

        const vBoth: val.r2 | val.l1 = e2.value;
        expect(vBoth).toEqual(val.r2);
      });


      it('Either (Right)', () => {
        const e1: Either<val.r1, val.l1> = Either.right(val.r1) as Either<val.r1, val.l1>;

        // expect eithers merge properly

        // @ts-expect-error
        const e2: Either<val.r2, val.l1> = e1.flatMap((_: val.r1): Either<val.r2, val.l2> => Either.right(val.r2));
        expect(e2.isRight()).toEqual(true);

        // @ts-expect-error
        const e3: Either<val.r2, val.l2> = e1.flatMap((_: val.r1): Either<val.r2, val.l2> => Either.right(val.r2));
        expect(e3.isRight()).toEqual(true);

        const e4: Either<val.r2, val.l1 | val.l2> = e1.flatMap((_: val.r1): Either<val.r2, val.l2> => Either.right(val.r2));
        expect(e2.isRight()).toEqual(true);

        // expect values merge properly

        // @ts-expect-error
        const vRight: val.r2 = e4.value;
        expect(vRight).toEqual(val.r2);

        // @ts-expect-error
        const vLeft2: val.l1 | val.l2 = e4.value;
        expect(vLeft2).toEqual(val.r2);

        const vBoth: val.r2 | val.l1 | val.l2 = e4.value;
        expect(vBoth).toEqual(val.r2);
      });


      it('Left', () => {
        const e1: Either<val.r1, val.l1> = Either.right(val.r1) as Either<val.r1, val.l1>;

        // expect eithers merge properly

        // @ts-expect-error
        const e2: Left<val.l1> = e1.flatMap((_: val.r1): Left<val.l2> => Either.left(val.l2));
        expect(e2.isLeft()).toEqual(true);

        // @ts-expect-error
        const e3: Left<val.l2> = e1.flatMap((_: val.r1): Left<val.l2> => Either.left(val.l2));
        expect(e3.isLeft()).toEqual(true);

        const e4: Left<val.l1 | val.l2> = e1.flatMap((_: val.r1): Left<val.l2> => Either.left(val.l2));
        expect(e4.isLeft()).toEqual(true);

        // expect values to merge properly

        // @ts-expect-error
        const vRight: val.r2 = e4.value;
        expect(vRight).toEqual(val.l2);

        // @ts-expect-error
        const vLeft1: val.l1 = e4.value;
        expect(vLeft1).toEqual(val.l2);

        // @ts-expect-error
        const vLeft2: val.l2 = e4.value;
        expect(vLeft2).toEqual(val.l2);

        const vLeftBoth: val.l1 | val.l2 = e4.value;
        expect(vLeftBoth).toEqual(val.l2);
      });


      it('Either (Left)', () => {
        const e1: Either<val.r1, val.l1> = Either.right(val.r1) as Either<val.r1, val.l1>;

        // expect eithers merge properly

        // @ts-expect-error
        const e2: Either<val.r2, val.l1> = e1.flatMap((_: val.r1): Either<val.r2, val.l2> => Either.left(val.l2));
        expect(e2.isLeft()).toEqual(true);

        // @ts-expect-error
        const e3: Either<val.r2, val.l2> = e1.flatMap((_: val.r1): Either<val.r2, val.l2> => Either.left(val.l2));
        expect(e3.isLeft()).toEqual(true);

        const e4: Either<val.r2, val.l1 | val.l2> = e1.flatMap((_: val.r1): Either<val.r2, val.l2> => Either.left(val.l2));
        expect(e4.isLeft()).toEqual(true);

        // expect values to merge properly

        // @ts-expect-error
        const vRight: val.r2 = e4.value;
        expect(vRight).toEqual(val.l2);

        // @ts-expect-error
        const vLeft: val.l1 | val.l2 = e4.value;
        expect(vLeft).toEqual(val.l2);

        const vBoth: val.r2 | val.l1 | val.l2 = e4.value;
        expect(vBoth).toEqual(val.l2);
      });
    });


    describe('Left ->', () => {
      it('Right', () => {
        const e1: Left<val.l1> = Either.left(val.l1);
        const e2: Left<val.l1> = e1.flatMap((_: never): Right<val.r2> => Either.right(val.r2));

        expect(e1.isLeft()).toEqual(true);

        const vLeft: val.l1 = e2.value;
        expect(vLeft).toEqual(val.l1);
      });


      it('Either (Right)', () => {
        const e1: Left<val.l1> = Either.left(val.l1);
        const e2: Left<val.l1> = e1.flatMap((_: never): Either<val.r2, val.l2> => Either.right(val.r2));

        expect(e2.isLeft()).toEqual(true);

        const vLeft: val.l1 = e2.value;
        expect(vLeft).toEqual(val.l1);
      });


      it('Left', () => {
        const e1: Left<val.l1> = Either.left(val.l1);

        const e2: Left<val.l1> = e1.flatMap((_: val.r1): Left<val.l2> => Either.left(val.l2));
        expect(e2.isLeft()).toEqual(true);

        const vLeft2: val.l1 = e2.value;
        expect(vLeft2).toEqual(val.l1);
      });


      it('Either (Left)', () => {
        const e1: Left<val.l1> = Either.left(val.l1);
        const e2: Left<val.l1> = e1.flatMap((_: val.r1): Either<val.r2, val.l2> => Either.left(val.l2));

        expect(e2.isLeft()).toEqual(true);

        const vLeft: val.l1 = e2.value;
        expect(vLeft).toEqual(val.l1);
      });
    });


    describe('Either (Left) ->', () => {
      it('Right', () => {
        const e1: Either<val.r1, val.l1> = Either.left(val.l1) as Either<val.r1, val.l1>;
        const e2: Either<val.r2, val.l1> = e1.flatMap((_: val.r1): Right<val.r2> => Either.right(val.r2));

        expect(e1.isLeft()).toEqual(true);

        // @ts-expect-error
        const vRight: val.r2 = e2.value;
        expect(vRight).toEqual(val.l1);

        // @ts-expect-error
        const vLeft: val.l1 = e2.value;
        expect(vLeft).toEqual(val.l1);

        const vBoth: val.r2 | val.l1 = e2.value;
        expect(vLeft).toEqual(val.l1);
      });


      it('Either (Right)', () => {
        const e1: Either<val.r1, val.l1> = Either.left(val.l1) as Either<val.r1, val.l1>;

        // expect eithers merge properly

        // @ts-expect-error
        const e2: Either<val.r2, val.l1> = e1.flatMap((_: val.r1): Either<val.r2, val.l2> => Either.right(val.r2));
        expect(e2.isLeft()).toEqual(true);

        // @ts-expect-error
        const e3: Either<val.r2, val.l2> = e1.flatMap((_: val.r1): Either<val.r2, val.l2> => Either.right(val.r2));
        expect(e3.isLeft()).toEqual(true);

        const e4: Either<val.r2, val.l1 | val.l2> = e1.flatMap((_: val.r1): Either<val.r2, val.l2> => Either.right(val.r2));
        expect(e2.isLeft()).toEqual(true);

        // expect values merge properly

        // @ts-expect-error
        const vRight: val.r2 = e4.value;
        expect(vRight).toEqual(val.l1);

        // @ts-expect-error
        const vLeft2: val.l1 | val.l2 = e4.value;
        expect(vLeft2).toEqual(val.l1);

        const vBoth: val.r2 | val.l1 | val.l2 = e4.value;
        expect(vBoth).toEqual(val.l1);
      });


      it('Left', () => {
        const e1: Either<val.r1, val.l1> = Either.left(val.l1) as Either<val.r1, val.l1>;

        // expect eithers merge properly

        // @ts-expect-error
        const e2: Left<val.l1> = e1.flatMap((_: val.r1): Left<val.l2> => Either.left(val.l2));
        expect(e2.isLeft()).toEqual(true);

        // @ts-expect-error
        const e3: Left<val.l2> = e1.flatMap((_: val.r1): Left<val.l2> => Either.left(val.l2));
        expect(e3.isLeft()).toEqual(true);

        const e4: Left<val.l1 | val.l2> = e1.flatMap((_: val.r1): Left<val.l2> => Either.left(val.l2));
        expect(e4.isLeft()).toEqual(true);

        // expect values to merge properly

        // @ts-expect-error
        const vRight: val.r2 = e4.value;
        expect(vRight).toEqual(val.l1);

        // @ts-expect-error
        const vLeft1: val.l1 = e4.value;
        expect(vLeft1).toEqual(val.l1);

        // @ts-expect-error
        const vLeft2: val.l2 = e4.value;
        expect(vLeft2).toEqual(val.l1);

        const vLeftBoth: val.l1 | val.l2 = e4.value;
        expect(vLeftBoth).toEqual(val.l1);
      });


      it('Either (Left)', () => {
        const e1: Either<val.r1, val.l1> = Either.left(val.l1) as Either<val.r1, val.l1>;

        // expect eithers merge properly

        // @ts-expect-error
        const e2: Either<val.r2, val.l1> = e1.flatMap((_: val.r1): Either<val.r2, val.l2> => Either.left(val.l2));
        expect(e2.isLeft()).toEqual(true);

        // @ts-expect-error
        const e3: Either<val.r2, val.l2> = e1.flatMap((_: val.r1): Either<val.r2, val.l2> => Either.left(val.l2));
        expect(e3.isLeft()).toEqual(true);

        const e4: Either<val.r2, val.l1 | val.l2> = e1.flatMap((_: val.r1): Either<val.r2, val.l2> => Either.left(val.l2));
        expect(e4.isLeft()).toEqual(true);

        // expect values to merge properly

        // @ts-expect-error
        const vRight: val.r2 = e4.value;
        expect(vRight).toEqual(val.l1);

        // @ts-expect-error
        const vLeft: val.l1 | val.l2 = e4.value;
        expect(vLeft).toEqual(val.l1);

        const vBoth: val.r2 | val.l1 | val.l2 = e4.value;
        expect(vBoth).toEqual(val.l1);
      });
    });
  });
});
