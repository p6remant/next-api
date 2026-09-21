import 'server-only';
import { NextResponse } from 'next/server';
import { HttpError } from './http';

/**
 * Shared Route Handler catch-block: forwards the backend's exact status code
 * and error body instead of collapsing every failure to a generic 500.
 */
export function handleRouteError(error: unknown, fallbackMessage: string) {
  if (error instanceof HttpError) {
    const status = error.status || 400;
    const body =
      error.data && typeof error.data === 'object'
        ? error.data
        : { success: false, message: error.message, statusCode: status };
    return NextResponse.json(body, { status });
  }

  const message = error instanceof Error ? error.message : fallbackMessage;
  return NextResponse.json(
    { success: false, message, statusCode: 500 },
    { status: 500 }
  );
}
