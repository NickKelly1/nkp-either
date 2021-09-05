/* eslint-disable @typescript-eslint/no-unused-vars */
import { Right, Either, Left } from '..';
import { val } from './value.spec.util';

describe('Either', () => {
  describe('.unwrapLeft(...)', () => {
    it('Right', () => {
      const either: Right<val.r1> = Either.right(val.r1);
      expect(() => { const value: never = either.unwrapLeft(); }).toThrow();
    });
    it('Left', () => {
      const either: Left<val.l1> = Either.left(val.l1);
      const value: val.l1 = either.unwrapLeft();
      expect(value).toEqual(val.l1);
    });
    it('Either (Right)', () => {
      const either: Either<val.r1, val.l1> = Either.right(val.r1) as Either<val.r1, val.l1>;
      expect(() => { const value: val.l1 = either.unwrapLeft(); }).toThrow();
    });
    it('Either (Left)', () => {
      const either: Either<val.r1, val.l1> = Either.left(val.l1) as Either<val.r1, val.l1>;
      const value: val.l1 = either.unwrapLeft();
      expect(value).toEqual(val.l1);
    });
  });
});
