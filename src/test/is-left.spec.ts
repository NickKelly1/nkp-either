import { Right, Either, Left } from '..';
import { val } from './value.spec.util';

describe('Either', () => {
  describe('.isLeft(...)', () => {
    it('Right', () => {
      const e1: Right<val.r1> = Either.right(val.r1);
      const isLeft: boolean = e1.isLeft();
      expect(isLeft).toEqual(false);
    });
    it('Left', () => {
      const e1: Left<val.l1> = Either.left(val.l1);
      const isLeft: boolean = e1.isLeft();
      expect(isLeft).toEqual(true);
    });
    it('Either (Right)', () => {
      const e1: Either<val.r1, val.l1> = Either.right(val.r1) as Either<val.r1, val.l1>;
      const isLeft: boolean = e1.isLeft();
      expect(isLeft).toEqual(false);
    });
    it('Either (Left)', () => {
      const e1: Either<val.r1, val.l1> = Either.left(val.l1) as Either<val.r1, val.l1>;
      const isLeft: boolean = e1.isLeft();
      expect(isLeft).toEqual(true);
    });
  });
});
