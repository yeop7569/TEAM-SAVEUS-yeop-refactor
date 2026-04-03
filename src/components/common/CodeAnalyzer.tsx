"use client";
import React, { useState } from "react";
import useAnalysisStore, { useModalState } from "@/app/store/analysisStore";
import AlertUILoding from "./AlertUILoding";
import ResultUI from "./ResultUI";
import { getFile } from "@/fileDownload";
import { useRouter } from "next/navigation";
import FileListModal from "../modal/FileListModal";
import { postAnalizedFile } from "@/firebase/data_adding";

interface CodeAnalyzerProps {
  code?: string;
  isReanalysis?: boolean;
  path?: string;
  filename?: string;
}

const CodeAnalyzer: React.FC<CodeAnalyzerProps> = ({ code, isReanalysis, path, filename }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { username, reponame, filelist, setIsAnalyzing, clearAnalysisResult } = useAnalysisStore();
  const setAnalysisResult = useAnalysisStore(
    (state) => state.setAnalysisResult
  );
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const setPostResult = useAnalysisStore((state) => state.postResultFile);

  const router = useRouter();

  // 모달 상태관리
  const setModal = useModalState((state) => state.setOnModal);
  const getModal = useModalState((state) => state.getOnModal());
  // 검사 명령 상태관리
  const setInspection = useModalState((state) => state.setOnInspection);
  const getInspection = useModalState((state) => state.getOnInspection());

  const analyzefileList = async (
    fileList: {
      path: string;
      name: string;
      download_url: string;
    }[]
  ) => {
    setIsLoading(true);
    setIsAnalyzing(true);
    clearAnalysisResult();
    await Promise.all(
      fileList.map(async (file) => {
        const codeValue = await getFile(file.download_url);
        if (codeValue) await analyzeCode(codeValue, file.path, file.name);
      })
    );
    setPostResult();
    setIsLoading(false);
    setIsAnalyzing(false);
    setIsComplete(true);
    // router.refresh(); // 파이어베이스 연동을 건너뛰기 위해 새로고침 비활성화
  };

  const analyzeCode = async (codeValue: string, filePath?: string, fileName?: string) => {
    setIsComplete(false);
    try {
      const response = await fetch("/api/analyzeCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: codeValue }),
      });

      let responseData;
      try {
          // 응답을 단 한 번만 파생(consume)하여 'Body consumed' 오류를 원천 차단
          responseData = await response.json();
      } catch (jsonError) {
          console.error("Failed to parse API response as JSON:", jsonError);
          throw new Error(`Server returned invalid response: ${response.status}`);
      }
      
      if (!response.ok) {
        const errorMessage = responseData.message || responseData.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = responseData.result || "No vulnerabilities found.";
      
      setAnalysisResult(result);

      // (임시 비활성화) 개별 파일 분석 결과 저장 (Firebase)
      /*
      const targetPath = filePath || path || "_";
      const targetName = fileName || filename;
      
      if (username && reponame && targetName) {
        await postAnalizedFile(username, reponame, targetPath, targetName, result);
      }
      */
    } catch (error) {
      console.error("Failed to analyze code:", error);
      setAnalysisResult("Failed to analyze the code. Please try again.");
    }
  };

  if (getInspection) {
    setInspection(false);
    analyzefileList(filelist);
  }

  return (
    <>
      {getModal && (
        <div className="absolute top-0 left-0">
          <FileListModal filelist={filelist} />
        </div>
      )}
      <div className="flex justify-center items-center ml-[10px] mt-[20px] w-[246px] h-[56px] rounded-lg p-4 py-5 gap-[10px] bg-[#6100FF]">
        <button
          className="w-[120px] h-[30px] font-inter font-semibold text-[24px] tracking-[-0.01em] text-[white]"
          onClick={async () => {
            if (code) {
              setIsLoading(true);
              setIsAnalyzing(true);
              clearAnalysisResult();
              await analyzeCode(code);
              setIsLoading(false);
              setIsAnalyzing(false);
              setIsComplete(true);
              // router.refresh(); // 파이어베이스 연동 대신 클라이언트 결과 유지
            } else {
              setModal(true);
            }
          }}
        >
          {isReanalysis ? "재검사하기" : "검사하기"}
        </button>

        {isLoading && (
          <div className=" absolute top-[495px] right-[55px]">
            <AlertUILoding />
          </div>
        )}
        {!isLoading && isComplete && (
          <div className="absolute top-[495px] right-[55px]">
            <ResultUI />
          </div>
        )}
      </div>
    </>
  );
};

export default CodeAnalyzer;
