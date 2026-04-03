import DetectedTitle from "@/components/common/DetectedTitle";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Image from "next/image";
import Choice from "@/assets/Choice.svg";
import Folder from "@/assets/Folder.svg";
import TopfileList from "@/assets/TopfileList.svg";
import ContentsFileList from "@/components/list/ContentsFileList";
import { cookies } from "next/headers";
import { Octokit } from "octokit";
import CodeAnalyzer from "@/components/common/CodeAnalyzer";
import AnalysisResults from "@/components/common/AnalyzeResult";
import { getAnalyzedCode } from "@/firebase/data_getting";
import CodeInspect from "@/components/inspection/CodeInspect";
import { getFile } from "@/fileDownload";

async function getUserName() {
  const cookiestore = cookies();
  const token = cookiestore.get("user_token");

  const octokit = new Octokit({
    auth: token?.value,
  });

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();
  const username = login;
  return username;
}

async function getFileList(reponame: string, path: string | undefined) {
  const cookiestore = cookies();
  const token = cookiestore.get("user_token");

  const octokit = new Octokit({
    auth: token?.value,
  });

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();
  const username = login;
  const newPath = path ? path : "";

  const repoContents = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: username,
      repo: reponame,
      path: newPath,
    }
  );
  return repoContents.data as any;
}
async function getCodeFromFirebase(
  reponame: string,
  path: string | undefined,
  filename: string | undefined
) {
  const newPath = path ? path : "_";
  const codes = filename
    ? await getAnalyzedCode(await getUserName(), reponame, newPath, filename)
    : null;
  if (codes) return codes;
  else return null;
}

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: { path?: string; filename?: string; download_url?: string };
  params: { reponame: string };
}) {
  const fileCodes = await getFile(searchParams.download_url);

  const analyzedCode = await getCodeFromFirebase(
    params.reponame,
    searchParams.path,
    searchParams.filename
  );

  // console.log(analyzedCode, "at ui_analyze");
  return (
    <>
      <Header />
      <div className="flex flex-col items-center min-h-screen bg-[#FDFDFF]">
        <div className="w-full max-w-[1760px] flex flex-col gap-[45px] py-10">
          <DetectedTitle 
            widthClass="w-full max-w-[1740px]" 
            text={`${params.reponame}${searchParams.filename ? ` / ${searchParams.filename}` : ""}`} 
          />

          <div className="flex ml-[13px] mt-[45px] gap-[32px]">
            <div className="flex flex-col gap-[32px]">
              <button className="w-[247px] h-[70px] rounded-xl p-4 bg-[#6100FF] hover:bg-[#4E00CC] transition-colors flex justify-center items-center shadow-md active:scale-95 duration-200">
                <span className="font-inter font-semibold text-[20px] text-white">
                  폴더 전체 검사
                </span>
              </button>
              <ContentsFileList
                files={await getFileList(params.reponame, searchParams.path)}
                username={await getUserName()}
              />
            </div>
            <div className="w-full max-w-[1453px] min-h-[800px] border border-gray-200 rounded-2xl p-8 gap-8 flex flex-col justify-start items-stretch bg-white shadow-sm overflow-hidden">
              {fileCodes ? (
                <div className="bg-[#FBFCFF] border border-gray-100 rounded-xl p-6 overflow-auto flex-1">
                  <pre className="font-mono text-sm leading-relaxed text-[#1A1A1A] whitespace-pre tabular-nums">
                    {fileCodes}
                  </pre>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-60">
                  <Image
                    src={Choice}
                    alt="파일선택"
                    width={64}
                    height={64}
                  />
                  <span className="text-[#6100FF] font-inter text-[28px] font-medium tracking-tight">
                    분석할 파일을 선택하세요
                  </span>
                </div>
              )}

              <AnalysisResults
                codes={analyzedCode ? analyzedCode.result : null}
              />
            </div>
          </div>

          <div>
            {fileCodes && (
              <CodeAnalyzer
                code={fileCodes}
                isReanalysis={!!analyzedCode}
                path={searchParams.path}
                filename={searchParams.filename}
              />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
