import { Right, Either, Left } from '..';
import { val } from './value.spec.util';

describe('Either', () => {
  describe('.value', () => {
    it('Right', () => {
      const e1: Right<val.r1> = Either.right(val.r1);
      const value: val.r1 = e1.value;
      expect(value).toEqual(val.r1);
    });


    it('Left', () => {
      const e1: Left<val.l1> = Either.left(val.l1);
      const value: val.l1 = e1.value;
      expect(value).toEqual(val.l1);

    });

    it('Either (Right)', () => {
      const e1: Either<val.r1, val.l1> = Either.right(val.r1) as Either<val.r1, val.l1>;

      // @ts-expect-error
      const rval: val.r1 = e1.value;
      expect(rval).toEqual(val.r1);

      // @ts-expect-error
      const lval: va.l1 = e1.value;
      expect(lval).toEqual(val.r1);

      const etval: val.r1 | val.l1 = e1.value;
      expect(etval).toEqual(val.r1);
    });


    it('Either (Left)', () => {
      const e1: Either<val.r1, val.l1> = Either.left(val.l1) as Either<val.r1, val.l1>;

      // @ts-expect-error
      const rval: val.r1 = e1.value;
      expect(rval).toEqual(val.l1);

      // @ts-expect-error
      const lval: va.l1 = e1.value;
      expect(lval).toEqual(val.l1);

      const etval: val.r1 | val.l1 = e1.value;
      expect(etval).toEqual(val.l1);
    });
  });
});
