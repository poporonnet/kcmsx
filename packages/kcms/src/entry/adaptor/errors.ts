export function errorToCode(error: Error): string {
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
}
