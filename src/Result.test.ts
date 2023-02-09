import { Result } from './Result';

describe('Result<T, E>', () => {
  describe('Ok<T>', () => {
    const ok = Result.ok('SUCCESS') as Result<'SUCCESS' | 'NEVER', 'FAILURE'>;

    it('isOk', () => {
      expect(ok.isOk()).toBe(true);
    });

    it('isOkAnd', () => {
      expect(ok.isOkAnd((value): value is 'SUCCESS' => value === 'SUCCESS')).toBe(true);
      expect(ok.isOkAnd((value): value is 'NEVER' => value === 'NEVER')).toBe(false);
    });

    it('isErr', () => {
      expect(ok.isErr()).toBe(false);
    });

    it('isErrAnd', () => {
      expect(ok.isErrAnd((err): err is 'FAILURE' => err === 'FAILURE')).toBe(false);
    });

    it('map', () => {
      expect(ok.map((value) => `A_${value}`)).toEqual(Result.ok('A_SUCCESS'));
    });

    it('mapErr', () => {
      expect(ok.mapErr((err) => `A_${err}`)).toEqual(Result.ok('SUCCESS'));
    });

    it('mapOrElse', () => {
      expect(
        ok.mapOrElse(
          (value) => value.length,
          (err) => err.length,
        ),
      ).toEqual(7);
    });

    it('unwrap', () => {
      expect(ok.unwrap()).toEqual('SUCCESS');
    });

    it('unwrapOr', () => {
      expect(ok.unwrapOr('FAILURE')).toEqual('SUCCESS');
    });

    it('unwrapErr', () => {
      expect(() => ok.unwrapErr()).toThrow('Cannot unwrap an Ok');
    });
  });

  describe('Err<E>', () => {
    const err = Result.err('FAILURE') as Result<'SUCCESS', 'FAILURE' | 'NEVER'>;

    it('isOk', () => {
      expect(err.isOk()).toBe(false);
    });

    it('isOkAnd', () => {
      expect(err.isOkAnd((value): value is 'SUCCESS' => value === 'SUCCESS')).toBe(false);
    });

    it('isErr', () => {
      expect(err.isErr()).toBe(true);
    });

    it('isErrAnd', () => {
      expect(err.isErrAnd((err): err is 'FAILURE' => err === 'FAILURE')).toBe(true);

      expect(err.isErrAnd((value): value is 'NEVER' => value === 'NEVER')).toBe(false);
    });

    it('map', () => {
      expect(err.map((value) => `A_${value}`)).toEqual(Result.err('FAILURE'));
    });

    it('mapErr', () => {
      expect(err.mapErr((err) => `A_${err}`)).toEqual(Result.err('A_FAILURE'));
    });

    it('mapOrElse', () => {
      expect(
        err.mapOrElse(
          (value) => value.length,
          (err) => err.length,
        ),
      ).toBe(7);
    });

    it('unwrap', () => {
      expect(() => err.unwrap()).toThrow('Cannot unwrap an Err');
    });

    it('unwrapOr', () => {
      expect(err.unwrapOr('DEFAULT')).toEqual('DEFAULT');
    });

    it('unwrapErr', () => {
      expect(err.unwrapErr()).toEqual('FAILURE');
    });
  });
});
