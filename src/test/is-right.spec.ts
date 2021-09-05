import { Right, Either, Left } from '..';
import { val } from './value.spec.util';

describe('Either', () => {
  describe('.isRight(...)', () => {
    it('Right', () => {
      const e1: Right<val.r1> = Either.right(val.r1);
      const isRight: boolean = e1.isRight();
      expect(isRight).toEqual(true);
    });
    it('Left', () => {
      const e1: Left<val.l1> = Either.left(val.l1);
      const isRight: boolean = e1.isRight();
      expect(isRight).toEqual(false);
    });
    it('Either (Right)', () => {
      const e1: Either<val.r1, val.l1> = Either.right(val.r1) as Either<val.r1, val.l1>;
      const isRight: boolean = e1.isRight();
      expect(isRight).toEqual(true);
    });
    it('Either (Left)', () => {
      const e1: Either<val.r1, val.l1> = Either.left(val.l1) as Either<val.r1, val.l1>;
      const isRight: boolean = e1.isRight();
      expect(isRight).toEqual(false);
    });
  });
});
