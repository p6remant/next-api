import { NextResponse } from 'next/server';
import { clearStoredAuthTokens } from '@/lib/api/token';

export async function POST() {
  await clearStoredAuthTokens();
  return NextResponse.json({ success: true });
}
