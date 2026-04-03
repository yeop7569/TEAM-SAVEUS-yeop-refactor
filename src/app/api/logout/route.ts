import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = cookies();
  cookieStore.delete("user_token");
  
  // 로그인 해제 후 메인 홈 화면으로 리다이렉트 (요청된 URL 기반으로 동적 처리)
  return NextResponse.redirect(new URL("/", request.url));
}
