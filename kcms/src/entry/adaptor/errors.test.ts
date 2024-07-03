import { describe, it, expect } from 'vitest';

describe('正しくエラーコードに変換できる', () => {
  const errorToCode = (error: Error) => {
    switch (error.message) {
      case 'too many members':
        return 'TOO_MANY_MEMBERS';
      case 'no member':
        return 'NO_MEMBER';
      case 'teamName Exists':
        return 'TEAM_ALREADY_EXISTS';
      default:
        return 'UNKNOWN_ERROR';
    }
  };
  it('too many members', () => {
    const error = new Error('too many members');
    expect(errorToCode(error)).toBe('TOO_MANY_MEMBERS');
  });
  it('no member', () => {
    const error = new Error('no member');
    expect(errorToCode(error)).toBe('NO_MEMBER');
  });
  it('teamName Exists', () => {
    const error = new Error('teamName Exists');
    expect(errorToCode(error)).toBe('TEAM_ALREADY_EXISTS');
  });

  it('other', () => {
    const error = new Error('other');
    expect(errorToCode(error)).toBe('UNKNOWN_ERROR');
  });
});
