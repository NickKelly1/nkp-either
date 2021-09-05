import { Right, Either, Left } from '..';
import { val } from './value.spec.util';

describe('Either', () => {
  describe('.mapLeft(...)', () => {
    it('Right', () => {
      const e1: Right<val.r1> = Either.right(val.r1);
      const e2: Right<val.r1> = e1.mapLeft(l => ({ l, }));

      const vRight: val.r1 = e2.value;
      expect(vRight).toEqual(val.r1);
    });


    it('Left', () => {
      const e1: Left<val.l1> = Either.left(val.l1);
      const e2: Left<{ l: val.l1 }>= e1.mapLeft(l => ({ l, }));
      const e3: Left<{ l: { l: val.l1 }}> = e2.mapLeft(l => ({ l, }));

      const vLeft: { l: { l: val.l1 }} = e3.value;
      expect(vLeft).toEqual({ l: { l: val.l1, },});
    });


    it('Either (Right)', () => {
      const e1: Either<val.r1, val.l1> = Either.right(val.r1) as Either<val.r1, val.l1>;
      const e2: Either<val.r1, { l: val.l1 }> = e1.mapLeft(l => ({ l, }));
      const e3: Either<val.r1, { l: { l: val.l1 } }> = e2.mapLeft(l => ({ l, }));

      // @ts-expect-error
      const vRight: val.r1 = e3.value;
      expect(vRight).toEqual(val.r1);

      // @ts-expect-error
      const vLeft: { l: { l: val.l1 }} = e3.value;
      expect(vLeft).toEqual(val.r1);

      const vBoth: val.r1 | { l: { l: val.l1 }} = e3.value;
      expect(vBoth).toEqual(val.r1);
    });


    it('Either (Left)', () => {
      const e1: Either<val.r1, val.l1> = Either.left(val.l1) as Either<val.r1, val.l1>;
      const e2: Either<val.r1, { l: val.l1 }> = e1.mapLeft(l => ({ l, }));
      const e3: Either<val.r1, { l: { l: val.l1 } }> = e2.mapLeft(l => ({ l, }));

      // @ts-expect-error
      const vRight: val.r1 = e3.value;
      expect(vRight).toEqual({ l: { l: val.l1, }, });

      // @ts-expect-error
      const vLeft: { l: { l: val.l1 }} = e3.value;
      expect(vLeft).toEqual({ l: { l: val.l1, }, });

      const vBoth: val.r1 | { l: { l: val.l1 }} = e3.value;
      expect(vBoth).toEqual({ l: { l: val.l1, }, });
    });
  });
});
