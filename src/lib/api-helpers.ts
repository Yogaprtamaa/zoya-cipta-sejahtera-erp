import { NextResponse } from "next/server";

/** Standard envelope helpers so every handler returns the same shape. */
export const ok = <T>(data: T) => NextResponse.json({ data, error: null });
export const fail = (message: string, code = "ERROR", status = 400) =>
  NextResponse.json({ data: null, error: { code, message } }, { status });

export async function body<T>(req: Request): Promise<T> {
  try { return (await req.json()) as T; } catch { return {} as T; }
}
