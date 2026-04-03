import Header from "@/components/common/Header";
import Image from "next/image";
import CaretLeft from "@/assets/CattleLeft.svg";
import DummyProfile from "@/assets/DummyProfile.png";
import Footer from "@/components/common/Footer";
import { cookies } from "next/headers";
import { Octokit } from "octokit";
import Link from "next/link";

export default async function Page() {
  const cookiestore = cookies();
  const token = cookiestore.get("user_token");
  
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>로그인이 필요합니다.</p>
        <Link href="/ui_login" className="text-[#6100FF] underline">로그인하러 가기</Link>
      </div>
    );
  }

  const octokit = new Octokit({
    auth: token.value,
  });

  const { data: userData } = await octokit.rest.users.getAuthenticated();
  const { login, avatar_url, name, email, bio, public_repos } = userData;

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen bg-[#FDFDFF]">
        <div className="w-full max-w-[1200px] mx-auto px-6 py-12 flex flex-col gap-12">
          
          {/* 상단 네비게이션/뒤로가기 */}
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 w-fit rounded-full border-2 border-[#6100FF] text-[#6100FF] font-semibold hover:bg-[#6100FF10] transition-all">
            <Image src={CaretLeft} alt="Back" height={20} className="opacity-80" />
            <span>Profile Information</span>
          </Link>

          {/* 프로필 메인 섹션 */}
          <section className="bg-white rounded-2xl p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E6E6E6]">
            <div className="flex items-center justify-between border-b pb-10 mb-10 border-gray-100">
              <div className="flex items-center gap-8">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#6100FF20]">
                  <Image
                    src={avatar_url || DummyProfile}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-[32px] font-bold text-[#1A1A1A]">
                    Hello, <span className="text-[#6100FF]">{name || login}</span>
                  </h1>
                  <p className="text-gray-500 text-lg">{bio || "Welcome to SAVE US"}</p>
                </div>
              </div>
              <a 
                href="/api/logout" 
                className="px-6 py-2.5 rounded-xl border-2 border-[#6100FF] text-[#6100FF] font-bold hover:bg-[#6100FF] hover:text-white transition-all shadow-sm"
              >
                로그아웃
              </a>
            </div>

            {/* 내 정보 상세 */}
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-bold text-[#3F3F3F] mb-6">내 정보</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-400 mb-1.5 block">Github 계정</label>
                    <div className="w-full max-w-md p-4 bg-[#F8F9FB] border border-[#E6E6E6] rounded-xl text-[#3F3F3F] font-medium">
                      {email || `${login}@github.com`}
                    </div>
                  </div>
                </div>
              </section>

              {/* 라이브러리/통계 */}
              <section>
                <div className="flex items-center justify-between mb-6">
                   <h2 className="text-2xl font-bold text-[#3F3F3F]">라이브러리</h2>
                   <span className="text-[#6100FF] font-medium text-sm">Public Repos: {public_repos}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/ui_detectedfile" className="p-6 bg-white border border-[#E6E6E6] rounded-xl hover:border-[#6100FF] hover:shadow-md transition-all group">
                    <h3 className="text-lg font-bold text-[#3F3F3F] mb-1 group-hover:text-[#6100FF]">검출된 파일</h3>
                    <p className="text-sm text-gray-500">지금까지 분석된 취약점 리포트를 확인하세요.</p>
                  </Link>
                  <Link href="/ui_scarp" className="p-6 bg-white border border-[#E6E6E6] rounded-xl hover:border-[#6100FF] hover:shadow-md transition-all group">
                    <h3 className="text-lg font-bold text-[#3F3F3F] mb-1 group-hover:text-[#6100FF]">스크랩</h3>
                    <p className="text-sm text-gray-500">보관해둔 주요 보안 사례와 분석 결과입니다.</p>
                  </Link>
                </div>
              </section>

              {/* 하단 링크 */}
              <div className="flex gap-8 pt-4">
                <Link href="/ui_setting" className="text-lg font-medium text-gray-500 hover:text-[#6100FF]">설정</Link>
                <Link href="/ui_contact" className="text-lg font-medium text-gray-500 hover:text-[#6100FF]">고객센터</Link>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
