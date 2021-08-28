import { Either, Left, Right } from './either';

describe('Either', () => {
  describe('isRight(...)', () => {
    it('Right', () => {
      expect(Either.right(5).isRight()).toBe(true);
    });
    it('Left', () => {
      expect(Either.left(5).isRight()).toBe(false);
    });
  });

  describe('isLeft(...)', () => {
    it('Right', () => {
      expect(Either.right(5).isLeft()).toBe(false);
    });
    it('Left', () => {
      expect(Either.left(5).isLeft()).toBe(true);
    });
  });

  describe('unwrap(...)', () => {
    it('Right', () => {
      const either = Either.right(5);
      expect(either.unwrap()).toBe(5);
    });
    it('Left', () => {
      const either = Either.left(6);
      expect(either.unwrap()).toBe(6);
    });
  });

  describe('unwrapRight(...)', () => {
    it('Right', () => {
      const either = Either.right(5);
      expect(either.unwrapRight()).toBe(5);
    });
    it('Left', () => {
      const either = Either.left(6);
      expect(() => either.unwrapRight()).toThrow();
    });
  });

  describe('unwrapLeft(...)', () => {
    it('Right', () => {
      const either = Either.right(5);
      expect(() => either.unwrapLeft()).toThrow();
    });
    it('Left', () => {
      const either = Either.left(6);
      expect(either.unwrapLeft()).toBe(6);
    });
  });

  describe('map(...)', () => {
    it('Right', () => {
      const either = Either.right(5).map(n => n + 1);
      expect(either.unwrapRight()).toBe(6);
    });
    it('Left', () => {
      const either = Either.left(5).map(n => n + 1).map(() => 'd');
      expect(either.unwrapLeft()).toBe(5);
    });
  });

  describe('mapLeft(...)', () => {
    it('Right', () => {
      const either = Either.right(5).mapLeft(n => n + 1);
      expect(either.unwrapRight()).toBe(5);
    });
    it('Left', () => {
      const either = Either.left(5).mapLeft(n => n + 1).map(() => 'd');
      expect(either.unwrapLeft()).toBe(6);
    });
  });

  describe('bimap(...)', () => {
    it('Right', () => {
      const either: Either<number, number> = Either.right(5);
      expect(either.bimap(n => n + 1, n => n - 1).unwrapRight()).toBe(6);
    });
    it('Left', () => {
      const either: Either<number, number> = Either.left(5);
      expect(either.bimap(n => n + 1, n => n - 1).unwrapLeft()).toBe(4);
    });
  });

  describe('flatMap(...)', () => {
    it('Right -> Right', () => {
      const e1: Right<number> = Either.right(5);
      const e2: Right<number> = e1.flatMap((a) => Either.right(a + 1));
      expect(e2.unwrapRight()).toBe(6);
    });
    it('Left -> Right', () => {
      const e1: Left<number> = Either.left(5);
      const e2: Either<number, number> = e1.flatMap((n) => Either.right(n + 1));
      expect(e2.unwrapLeft()).toBe(5);
    });
    it('Right -> Left', () => {
      const e1: Right<number> = Either.right(5);
      const e2: Left<number> = e1.flatMap(n => Either.left(n + 1));
      expect(e2.unwrapLeft()).toBe(6);
    });
    it('Left -> Left', () => {
      const e1: Left<number> = Either.left(5);
      const e2: Left<number> = e1.flatMap(n => Either.left(n + 1));
      expect(e2.unwrapLeft()).toBe(5);
    });
  });

  describe('flatMapLeft(...)', () => {
    it('Right -> Right', () => {
      const e1: Right<number> = Either.right(5);
      const e2: Right<number> = e1.flatMapLeft((a) => Either.right(a + 1));
      expect(e2.unwrapRight()).toBe(5);
    });
    it('Left -> Right', () => {
      const e1: Left<number> = Either.left(5);
      const e2: Right<number> = e1.flatMapLeft(n => Either.right(n + 1));
      expect(e2.unwrapRight()).toBe(6);
    });
    it('Right -> Left', () => {
      const e1: Right<number> = Either.right(5);
      const e2: Either<number, number> = e1.flatMapLeft(n => Either.left(n + 1));
      expect(e2.unwrapRight()).toBe(5);
    });
    it('Left -> Left', () => {
      const e1: Left<number> = Either.left(5);
      const e2: Left<number> = e1.flatMapLeft(n => Either.left(n + 1));
      expect(e2.unwrapLeft()).toBe(6);
    });
  });

  describe('orElse(...)', () => {
    it('Right -> Right', () => {
      const e1: Right<number> = Either.right(5);
      const e2: Right<number> = e1.orElse((lval) => lval + 1);
      expect(e2.unwrapRight()).toBe(5);
    });
    it('Left -> Right', () => {
      const e1: Left<number> = Either.left(5);
      const e2: Right<number> = e1.orElse((lval) => lval + 1);
      expect(e2.unwrapRight()).toBe(6);
    });
  });

  describe('flat(...)', () => {
    it('Right<Right> -> Right', () => {
      const e1: Right<Right<number>> = Either.right(Either.right(5));
      const e2: Either<number, number> = e1.flat();
      expect(e2.unwrapRight()).toBe(5);
    });
    it('Right<Left> -> Left', () => {
      const e1: Right<Left<number>> = Either.right(Either.left(5));
      const e2: Either<number, number> = e1.flat();
      expect(e2.unwrapLeft()).toBe(5);
    });
    it('Right<Either> -> Either', () => {
      const e1: Right<Either<number, string>> = Either.right(Either.from<number, string>(5));
      const e2: Either<number, string> = e1.flat();
      expect(e2.unwrapRight()).toBe(5);
    });
    it('Either<Right> -> Either', () => {
      const e1: Either<Right<number>, string> = Either.from<Right<number>, string>(Either.right(5));
      const e2: Either<number, string> = e1.flat();
      expect(e2.unwrapRight()).toBe(5);
    });
    it('Either<Left> -> Left', () => {
      const e1: Either<Either<number, string>, string> = Either.from<Either<number, string>, string>(Either.left('hi'));
      const e2: Either<number, string> = e1.flat();
      expect(e2.unwrapLeft()).toBe('hi');
    });
  });

  describe('flatLeft(...)', () => {
    it('Left<Left> -> Left', () => {
      const e1: Left<Left<number>> = Either.left(Either.left(5));
      const e2: Either<number, number> = e1.flatLeft();
      expect(e2.unwrapLeft()).toBe(5);
    });
    it('Left<Right> -> Right', () => {
      const e1: Left<Right<number>> = Either.left(Either.right(5));
      const e2: Either<number, number> = e1.flatLeft();
      expect(e2.unwrapRight()).toBe(5);
    });
    it('Left<Either> -> Either', () => {
      const e1: Left<Either<string, number>> = Either.left(Either.fromLeft<string, number>(5));
      const e2: Either<string, number> = e1.flatLeft();
      expect(e2.unwrapLeft()).toBe(5);
    });
    it('Either<Left> -> Either', () => {
      const e1: Either<string, Left<number>> = Either.fromLeft<string, Left<number>>(Either.left(5));
      const e2: Either<string, number> = e1.flatLeft();
      expect(e2.unwrapLeft()).toBe(5);
    });
    it('Either<Right> -> Right', () => {
      // eslint-disable-next-line max-len
      const e1: Either<string, Either<string, number>> = Either.fromLeft<string, Either<string, number>>(Either.right('hi'));
      const e2: Either<string, number> = e1.flatLeft();
      expect(e2.unwrapRight()).toBe('hi');
    });
  });
});
