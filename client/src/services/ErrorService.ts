export function getError(err: unknown): string {
  let message: string = '';
  if (err instanceof Error) {
    message = err.message;
  }
  else {
    message = err as string;
  }

  return message;
}
