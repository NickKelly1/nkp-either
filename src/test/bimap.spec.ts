/* eslint-disable @typescript-eslint/no-unused-vars */
import { Right, Either, Left } from '..';
import { val } from './value.spec.util';

describe('Either', () => {
  describe('.bimap(...)', () => {
    it('Right', () => {
      const e1: Right<val.r1> = Either.right(val.r1);
      const e2: Right<val.r2> = e1.bimap( (_: val.r1) => val.r2, (_: val.l1) => val.l2);
      const e3: Right<val.r3> = e2.bimap( (_: val.r2) => val.r3, (_: val.l2) => val.l3);

      const vRight: val.r3 = e3.value;
      expect(vRight).toEqual(val.r3);
    });


    it('Left', () => {
      const e1: Left<val.l1> = Either.left(val.l1);
      const e2: Left<val.l2> = e1.bimap( (_: val.r1) => val.r2, (_: val.l1) => val.l2);
      const e3: Left<val.l3> = e2.bimap( (_: val.r2) => val.r3, (_: val.l2) => val.l3);

      const vLeft: val.l3 = e3.value;
      expect(vLeft).toEqual(val.l3);
    });


    it('Either (Right)', () => {
      const e1: Either<val.r1, val.l1> = Either.right(val.r1) as Either<val.r1, val.l1>;
      const e2: Either<val.r2, val.l2> = e1.bimap( (_: val.r1) => val.r2, (_: val.l1) => val.l2);
      const e3: Either<val.r3, val.l3> = e2.bimap( (_: val.r2) => val.r3, (_: val.l2) => val.l3);

      // @ts-expect-error
      const vRight: val.r3 = e3.value;
      expect(vRight).toEqual(val.r3);

      // @ts-expect-error
      const vLeft: val.l3 = e3.value;
      expect(vLeft).toEqual(val.r3);

      const vBoth: val.r3 | val.l3 = e3.value;
      expect(vBoth).toEqual(val.r3);
    });


    it('Either (Left)', () => {
      const e1: Either<val.r1, val.l1> = Either.left(val.l1) as Either<val.r1, val.l1>;
      const e2: Either<val.r2, val.l2> = e1.bimap( (_: val.r1) => val.r2, (_: val.l1) => val.l2);
      const e3: Either<val.r3, val.l3> = e2.bimap( (_: val.r2) => val.r3, (_: val.l2) => val.l3);

      // @ts-expect-error
      const vRight: val.r3 = e3.value;
      expect(vRight).toEqual(val.l3);

      // @ts-expect-error
      const vLeft: val.l3 = e3.value;
      expect(vLeft).toEqual(val.l3);

      const vBoth: val.r3 | val.l3 = e3.value;
      expect(vBoth).toEqual(val.l3);
    });
  });
});
