/* eslint-disable @typescript-eslint/no-unused-vars */
import { Right, Either, Left } from '..';
import { val } from './value.spec.util';

describe('Either', () => {
  describe('.unwrap(...)', () => {
    it('Right', () => {
      const e1: Right<val.r1> = Either.right(val.r1);
      const value: val.r1 = e1.unwrap();
      expect(value).toEqual(val.r1);
    });
    it('Left', () => {
      const e1: Left<val.l1> = Either.left(val.l1);
      expect(() => { const value: never = e1.unwrap(); }).toThrow();
    });
    it('Either (Right)', () => {
      const e1: Either<val.r1, val.l1> = Either.right(val.r1) as Either<val.r1, val.l1>;
      const value: val.r1 = e1.unwrap();
      expect(value).toEqual(val.r1);
    });
    it('Either (Left)', () => {
      const e1: Either<val.r1, val.l1> = Either.left(val.l1) as Either<val.r1, val.l1>;
      expect(() => { const value: val.r1 = e1.unwrap(); }).toThrow();
    });
  });
});
