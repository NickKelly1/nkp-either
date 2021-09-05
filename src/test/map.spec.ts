import { Right, Either, Left } from '..';
import { val } from './value.spec.util';

describe('Either', () => {
  describe('.map(...)', () => {
    it('Right', () => {
      const e1: Right<val.r1> = Either.right(val.r1);
      const e2: Right<{ r: val.r1 }> = e1.map(r => ({ r, }));
      const e3: Right<{ r: { r: val.r1 } }> = e2.map(r => ({ r, }));

      const vRight: { r: { r: val.r1 }} = e3.value;
      expect(vRight).toEqual({ r: { r: val.r1, },});
    });


    it('Left', () => {
      const e1: Left<val.l1> = Either.left(val.l1);
      const e2: Left<val.l1> = e1.map(r => ({ r, }));

      // @ts-expect-error
      const vRight: { r: { r: never }} = e2.value;
      expect(vRight).toEqual(val.l1);

      const vLeft: val.l1 = e2.value;
      expect(vLeft).toEqual(val.l1);
    });


    it('Either (Right)', () => {
      const e1: Either<val.r1, val.l1> = Either.right(val.r1) as Either<val.r1, val.l1>;
      const e2: Either<{ r: val.r1 }, val.l1> = e1.map(r => ({ r, }));
      const e3: Either<{ r: { r: val.r1 } }, val.l1> = e2.map(r => ({ r, }));

      // @ts-expect-error
      const vRight: { r: { r: val.r1 }} = e3.value;
      expect(vRight).toEqual({ r: { r: val.r1, }, });

      // @ts-expect-error
      const vLeft: val.l1 = e3.value;
      expect(vLeft).toEqual({ r: { r: val.r1, }, });

      const vBoth: { r: { r: val.r1 }} | val.l1 = e3.value;
      expect(vBoth).toEqual({ r: { r: val.r1, }, });
    });


    it('Either (Left)', () => {
      const e1: Either<val.r1, val.l1> = Either.left(val.l1) as Either<val.r1, val.l1>;
      const e2: Either<{ r: val.r1 }, val.l1> = e1.map(r => ({ r, }));
      const e3: Either<{ r: { r: val.r1 } }, val.l1> = e2.map(r => ({ r, }));

      // @ts-expect-error
      const vRight: { r: { r: val.r1 }} = e3.value;
      expect(vRight).toEqual(val.l1);

      // @ts-expect-error
      const vLeft: val.l1 = e3.value;
      expect(vLeft).toEqual(val.l1);

      const vBoth: { r: { r: val.r1 }} | val.l1 = e3.value;
      expect(vBoth).toEqual(val.l1);
    });
  });
});
