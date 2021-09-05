import { Either, Left, Right } from '..';
import { val } from './value.spec.util';

describe('Either', () => {
  describe('.flat(...)', () => {
    describe('Right ->', () => {
      it('Right', () => {
        const e1: Right<Right<val.r2>> = Either.right(Either.right(val.r2));
        const e2: Right<val.r2> = e1.flat();

        expect(e2.isRight()).toEqual(true);
        const vRight: val.r2 = e2.value;
        expect(vRight).toEqual(val.r2);
      });


      it('Left', () => {
        const e1: Right<Left<val.l2>> = Either.right(Either.left(val.l2));
        const e2: Left<val.l2> = e1.flat();

        expect(e2.isLeft()).toEqual(true);
        const vLeft: val.l2 = e2.value;
        expect(vLeft).toEqual(val.l2);
      });


      it('Either (Right)', () => {
        const e0: Either<val.r2, val.l2> = Either.fromRight<val.r2, val.l2>(val.r2);
        const e1: Right<Either<val.r2, val.l2>> = Either.right(e0);
        const e2: Either<val.r2, val.l2> = e1.flat();

        expect(e2.isRight()).toEqual(true);
        const eitval: val.r2 | val.l2 = e2.value;
        expect(eitval).toEqual(val.r2);
      });


      it('Either (Left)', () => {
        const e0: Either<val.r2, val.l2> = Either.fromLeft<val.r2, val.l2>(val.l2);
        const e1: Right<Either<val.r2, val.l2>> = Either.right(e0);
        const e2: Either<val.r2, val.l2> = e1.flat();

        expect(e2.isLeft()).toEqual(true);
        const eitval: val.r2 | val.l2 = e2.value;
        expect(eitval).toEqual(val.l2);
      });
    });


    describe('Either (Right) ->', () => {
      it('Right', () => {
        const e1: Either<Right<val.r2>, val.l1> = Either.fromRight<Right<val.r2>, val.l1>(Either.right(val.r2));
        const e2: Either<val.r2, val.l1> = e1.flat();

        expect(e2.isRight()).toEqual(true);

        // @ts-expect-error
        const vRight: val.r2 = e2.value;
        expect(vRight).toEqual(val.r2);

        // @ts-expect-error
        const vLeft: val.l1 = e2.value;
        expect(vLeft).toEqual(val.r2);

        const vBoth: val.r2 | val.l1 = e2.value;
        expect(vBoth).toEqual(val.r2);
      });


      it('Left', () => {
        const e1: Either<Left<val.l2>, val.l1> = Either.fromRight<Left<val.l2>, val.l1>(Either.left(val.l2));
        const e2: Left<val.l2 | val.l1> = e1.flat();

        expect(e2.isLeft()).toEqual(true);

        // @ts-expect-error
        const vLeft1: val.l2 = e2.value;
        expect(vLeft1).toEqual(val.l2);

        // @ts-expect-error
        const vLeft2: val.l1 = e2.value;
        expect(vLeft2).toEqual(val.l2);

        const vLeftboth: val.l2 | val.l1 = e2.value;
        expect(vLeftboth).toEqual(val.l2);
      });


      it('Either (Right)', () => {
        const e0 = Either.fromRight<val.r2, val.l2>(val.r2);
        const e1: Either<Either<val.r2, val.l2>, val.l1> = Either.fromRight<Either<val.r2, val.l2>, val.l1>(e0);
        const e2: Either<val.r2, val.l2 | val.l1> = e1.flat();

        expect(e2.isRight()).toEqual(true);

        // @ts-expect-error
        const vRight: val.r2 = e2.value;
        expect(vRight).toEqual(val.r2);

        // @ts-expect-error
        const vLeft1: val.l2 = e2.value;
        expect(vLeft1).toEqual(val.r2);

        // @ts-expect-error
        const vLeft2: val.l1 = e2.value;
        expect(vLeft2).toEqual(val.r2);

        const vBoth: val.r2 | val.l2 | val.l1 = e2.value;
        expect(vBoth).toEqual(val.r2);
      });


      it('Either (Left)', () => {
        const e0 = Either.fromLeft<val.r2, val.l2>(val.l2);
        const e1: Either<Either<val.r2, val.l2>, val.l1> = Either.fromRight<Either<val.r2, val.l2>, val.l1>(e0);
        const e2: Either<val.r2, val.l2 | val.l1> = e1.flat();

        expect(e2.isLeft()).toEqual(true);

        // @ts-expect-error
        const vRight: val.r2 = e2.value;
        expect(vRight).toEqual(val.l2);

        // @ts-expect-error
        const vLeft1: val.l2 = e2.value;
        expect(vLeft1).toEqual(val.l2);

        // @ts-expect-error
        const vLeft2: val.l1 = e2.value;
        expect(vLeft2).toEqual(val.l2);

        const vBoth: val.r2 | val.l2 | val.l1 = e2.value;
        expect(vBoth).toEqual(val.l2);
      });
    });

    describe('Left ->', () => {
      it('Right', () => {
        const e1: Left<Right<val.r2>> = Either.left(Either.right(val.r2));
        const e2: Left<Right<val.r2>> = e1.flat();

        expect(e2.isLeft()).toEqual(true);

        const vRight: Right<val.r2> = e2.value;
        expect(vRight).toEqual(Either.right(val.r2));
      });


      it('Left', () => {
        const e1: Left<Left<val.l2>> = Either.left(Either.left(val.l2));
        const e2: Left<Left<val.l2>> = e1.flat();

        expect(e2.isLeft()).toEqual(true);

        const vLeft: Left<val.l2> = e2.value;
        expect(vLeft).toEqual(Either.left(val.l2));
      });


      it('Either (Right)', () => {
        const e0: Either<val.r2, val.l2> = Either.fromRight<val.r2, val.l2>(val.r2);
        const e1: Left<Either<val.r2, val.l2>> = Either.left(e0);
        const e2: Left<Either<val.r2, val.l2>> = e1.flat();

        expect(e2.isLeft()).toEqual(true);

        const eitval: Either<val.r2, val.l2> = e2.value;
        expect(eitval).toEqual(Either.right(val.r2));
      });


      it('Either (Left)', () => {
        const e0: Either<val.r2, val.l2> = Either.fromLeft<val.r2, val.l2>(val.l2);
        const e1: Left<Either<val.r2, val.l2>> = Either.left(e0);
        const e2: Left<Either<val.r2, val.l2>> = e1.flat();

        expect(e2.isLeft()).toEqual(true);

        const eitval: Either<val.r2, val.l2> = e2.value;
        expect(eitval).toEqual(Either.left(val.l2));
      });
    });


    describe('Either (Left) ->', () => {
      it('Right', () => {
        const e1: Either<Right<val.r2>, val.l1> = Either.fromLeft<Right<val.r2>, val.l1>(val.l1);
        const e2: Either<val.r2, val.l1> = e1.flat();

        expect(e2.isLeft()).toEqual(true);

        // @ts-expect-error
        const vRight: val.r2 = e2.value;
        expect(vRight).toEqual(val.l1);

        // @ts-expect-error
        const vLeft: val.l1 = e2.value;
        expect(vLeft).toEqual(val.l1);

        const vBoth: val.r2 | val.l1 = e2.value;
        expect(vBoth).toEqual(val.l1);
      });


      it('Left', () => {
        const e1: Either<Left<val.l2>, val.l1> = Either.fromLeft<Left<val.l2>, val.l1>(val.l1);
        const e2: Left<val.l2 | val.l1> = e1.flat();

        expect(e2.isLeft()).toEqual(true);

        // @ts-expect-error
        const vLeft1: val.l2 = e2.value;
        expect(vLeft1).toEqual(val.l1);

        // @ts-expect-error
        const vLeft2: val.l1 = e2.value;
        expect(vLeft2).toEqual(val.l1);

        const vLeftboth: val.l2 | val.l1 = e2.value;
        expect(vLeftboth).toEqual(val.l1);
      });


      it('Either (Right)', () => {
        const e1: Either<Either<val.r2, val.l2>, val.l1> = Either.fromLeft<Either<val.r2, val.l2>, val.l1>(val.l1);
        const e2: Either<val.r2, val.l2 | val.l1> = e1.flat();

        expect(e2.isLeft()).toEqual(true);

        // @ts-expect-error
        const vRight: val.r2 = e2.value;
        expect(vRight).toEqual(val.l1);

        // @ts-expect-error
        const vLeft1: val.l2 = e2.value;
        expect(vLeft1).toEqual(val.l1);

        // @ts-expect-error
        const vLeft2: val.l1 = e2.value;
        expect(vLeft2).toEqual(val.l1);

        const vBoth: val.r2 | val.l2 | val.l1 = e2.value;
        expect(vBoth).toEqual(val.l1);
      });


      it('Either (Left)', () => {
        const e1: Either<Either<val.r2, val.l2>, val.l1> = Either.fromLeft<Either<val.r2, val.l2>, val.l1>(val.l1);
        const e2: Either<val.r2, val.l2 | val.l1> = e1.flat();

        expect(e2.isLeft()).toEqual(true);

        // @ts-expect-error
        const vRight: val.r2 = e2.value;
        expect(vRight).toEqual(val.l1);

        // @ts-expect-error
        const vLeft1: val.l2 = e2.value;
        expect(vLeft1).toEqual(val.l1);

        // @ts-expect-error
        const vLeft2: val.l1 = e2.value;
        expect(vLeft2).toEqual(val.l1);

        const vBoth: val.r2 | val.l2 | val.l1 = e2.value;
        expect(vBoth).toEqual(val.l1);
      });
    });
  });
});
