"use client";
import React, { useEffect, useState } from "react";
import useAnalysisStore from "@/app/store/analysisStore";

const AnalysisResults: React.FC<{ codes: string | null }> = ({ codes }) => {
  // Removed local useState for analysisResult as it will now be managed by the store or derived.
  const analysisFromStore = useAnalysisStore((state) => state.analysisResult);
  const setAnalysisResultInStore = useAnalysisStore((state) => state.setAnalysisResult);

  useEffect(() => {
    // If initial codes are provided (e.g., from server-side props), set them in the store.
    // This ensures the store is initialized with the correct data.
    if (codes) {
      setAnalysisResultInStore(codes);
    }
  }, [codes, setAnalysisResultInStore]);

  // Determine the result to display: prioritize the latest result in the store
  const latestResultFromStore = analysisFromStore.length > 0
    ? analysisFromStore[analysisFromStore.length - 1]
    : null;

  const isAnalyzing = useAnalysisStore((state) => state.isAnalyzing);
  const displayResult = latestResultFromStore || codes || "";

  const parseResult = (result: string) => {
    if (!result) return { vulnerabilities: "", fixes: "", exampleCode: "" };

    // 섹션을 찾는 더 강력한 로직: 마크다운 기호 등을 모두 정규식으로 지우고 섹션별로 분리
    const cleanResult = result.replace(/#{1,6}\s*/g, ""); // ### 등 헤더 기호 제거
    
    const getSection = (num: number, nextNum?: number) => {
      const startRegex = new RegExp(`${num}\\.\\s*`, "g");
      const startIndex = cleanResult.search(startRegex);
      if (startIndex === -1) return null;
      
      const contentStart = cleanResult.indexOf(".", startIndex) + 1;
      let contentEnd = cleanResult.length;
      
      if (nextNum) {
        const nextRegex = new RegExp(`\\n${nextNum}\\.\\s*`, "g");
        const nextIndex = cleanResult.search(nextRegex);
        if (nextIndex !== -1) contentEnd = nextIndex;
      }
      
      return cleanResult.substring(contentStart, contentEnd).trim();
    };

    const vulnerabilities = getSection(1, 2) || "취약점 정보를 파싱하지 못했습니다.";
    const fixes = getSection(2, 3) || "수정 방안을 파싱하지 못했습니다.";
    const exampleCode = getSection(3) || "수정 코드를 파싱하지 못했습니다.";

    // 만약 모든 섹션 파싱에 실패했다면(특수 형식 등), 원문 그대로를 보여주기 위한 플래그
    const isParsingFailed = !getSection(1) && !getSection(2) && !getSection(3);

    return { vulnerabilities, fixes, exampleCode, isParsingFailed };
  };

  if (isAnalyzing) {
    return (
      <div className="analysis-results bg-[#FFF3F3] p-10 rounded-xl w-full border-[1px] border-[#FFDADA] shadow-sm flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6D6D]"></div>
        <p className="text-[#FF6D6D] font-semibold text-lg">새로운 보안 분석을 진행 중입니다...</p>
      </div>
    );
  }

  const { vulnerabilities, fixes, exampleCode, isParsingFailed } = parseResult(displayResult);
  if (!displayResult) return null;

  // 파싱 실패 시 원문 출력
  if (isParsingFailed) {
    return (
      <div className="analysis-results bg-[#FFF3F3] p-6 rounded-xl w-full border-[1px] border-[#FFDADA] overflow-auto">
        <h2 className="text-[24px] font-semibold text-[#FF6D6D] mb-4">분석 전체 결과 (원문)</h2>
        <div className="text-[#3f3f3f] font-medium whitespace-pre-wrap leading-relaxed">
          {displayResult}
        </div>
      </div>
    );
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exampleCode);
      alert("코드가 클립보드에 복사되었습니다.");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="analysis-results bg-[#FFF3F3] p-6 rounded-xl w-full border-[1px] border-[#FFDADA] shadow-sm overflow-auto max-h-[600px]">
      <div className="mb-4">
        <h2 className="text-[24px] font-semibold text-[#FF6D6D]">
          1. 주요 취약점
        </h2>
        <p className="text-base text-[#3f3f3f] font-medium whitespace-pre-wrap">
          {vulnerabilities}
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg text-[#3f3f3f] font-semibold">2. 수정 제안</h2>
        <p className="text-base font-semibold text-[#3f3f3f] whitespace-pre-wrap">
          {fixes}
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-[#3f3f3f] font-semibold text-[24px]">
          3. 수정된 코드
        </h2>
        <div className="bg-[#444444] rounded-lg relative">
          <pre className="text-white text-[18px] font-medium p-2 rounded-md whitespace-pre-wrap">
            {exampleCode}
          </pre>
          <button
            onClick={copyToClipboard}
            style={{ position: "absolute", right: "10px", top: "10px" }}
            className="bg-[#444444] p-1 rounded-md text-white font-medium text-sm flex items-center"
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "8px" }}
            >
              <path
                d="M20.71 3.5H8.70996C8.51105 3.5 8.32028 3.57902 8.17963 3.71967C8.03898 3.86032 7.95996 4.05109 7.95996 4.25V8H4.20996C4.01105 8 3.82028 8.07902 3.67963 8.21967C3.53898 8.36032 3.45996 8.55109 3.45996 8.75V20.75C3.45996 20.9489 3.53898 21.1397 3.67963 21.2803C3.82028 21.421 4.01105 21.5 4.20996 21.5H16.21C16.4089 21.5 16.5996 21.421 16.7403 21.2803C16.8809 21.1397 16.96 20.9489 16.96 20.75V17H20.71C20.9089 17 21.0996 16.921 21.2403 16.7803C21.3809 16.6397 21.46 16.4489 21.46 16.25V4.25C21.46 4.05109 21.3809 3.86032 21.2403 3.71967C21.0996 3.57902 20.9089 3.5 20.71 3.5ZM15.46 20H4.95996V9.5H15.46V20ZM19.96 15.5H16.96V8.75C16.96 8.55109 16.8809 8.36032 16.7403 8.21967C16.5996 8.07902 16.4089 8 16.21 8H9.45996V5H19.96V15.5Z"
                fill="#D6D6D6"
              />
            </svg>
            <div className="text-[18px] font-medium leading-6 text-[#d6d6d6]">
              코드복사
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
