import { NextRequest, NextResponse } from 'next/server';
import { tokenProvider } from '@/actions/stream.actions';

export async function GET(req: NextRequest) {
  try {
    const token = await tokenProvider();
    return NextResponse.json({ token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
} 