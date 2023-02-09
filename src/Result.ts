export type Result<T, E> = ResultClass<T, E> & (Ok<T> | Err<E>);

export const Result = {
  ok: <T>(value: T): Result<T, never> => new Ok(value),
  err: <E>(err: E): Result<never, E> => new Err(err),
};

export abstract class ResultClass<T, E> {
  constructor(
    protected data:
      | {
          ok: true;
          value: T;
        }
      | {
          ok: false;
          err: E;
        },
  ) {}

  isOk(): this is Ok<T> {
    return this.data.ok === true;
  }

  isOkAnd<U extends T>(predicate: (value: T) => value is U): this is Ok<U> {
    return this.data.ok === true && predicate(this.data.value);
  }

  isErr(): this is Err<E> {
    return this.data.ok === false;
  }

  isErrAnd<F extends E>(predicate: (err: E) => err is F): this is Err<F> {
    return this.data.ok === false && predicate(this.data.err);
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.data.ok === true) {
      return Result.ok(fn(this.data.value));
    }
    return Result.err(this.data.err);
  }

  mapErr<F>(fn: (value: E) => F): Result<T, F> {
    if (this.data.ok === false) {
      return Result.err(fn(this.data.err));
    }
    return Result.ok(this.data.value);
  }

  mapOrElse<U, F>(okFn: (value: T) => U, errFn: (err: E) => F): U | F {
    if (this.data.ok === true) {
      return okFn(this.data.value);
    }
    return errFn(this.data.err);
  }

  unwrap(onError?: (err: E) => void): T {
    if (this.data.ok === false) {
      if (onError) {
        onError(this.data.err);
      }
      throw new Error('Cannot unwrap an Err');
    }
    return this.data.value;
  }

  unwrapErr(onOk?: (value: T) => void): E {
    if (this.data.ok === true) {
      if (onOk) {
        onOk(this.data.value);
      }
      throw new Error('Cannot unwrap an Ok');
    }
    return this.data.err;
  }

  unwrapOr<F>(defaultValue: F): T | F {
    if (this.data.ok === false) {
      return defaultValue;
    }
    return this.data.value;
  }

  unwrapOrElse<F>(fn: (err: E) => F): T | F {
    if (this.data.ok === false) {
      return fn(this.data.err);
    }
    return this.data.value;
  }
}

export class Ok<T> extends ResultClass<T, never> {
  constructor(public value: T) {
    super({ ok: true, value });
  }
}

export class Err<E> extends ResultClass<never, E> {
  constructor(public err: E) {
    super({ ok: false, err });
  }
}
