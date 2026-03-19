import { AppError } from '../../../../src/shared/errors/AppError';

describe('AppError', () => {
  it('should create an error with message and default values', () => {
    const error = new AppError('Something went wrong');

    expect(error.message).toBe('Something went wrong');
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.name).toBe('AppError');
    expect(error).toBeInstanceOf(Error);
  });

  it('should create an error with custom statusCode and code', () => {
    const error = new AppError('Not found', 404, 'NOT_FOUND');

    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
  });
});
