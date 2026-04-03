"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

function LoginHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams ? searchParams.get("code") : null;

  useEffect(() => {
    if (search) {
      fetch(`/api/request_token`, {
        method: "POST",
        body: JSON.stringify({ code: search }),
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to request token");
          return res.json();
        })
        .then((data) => {
          if (data.message === "token allocated") {
            router.push("/");
          } else {
            console.error("Login failed:", data.message);
            alert("로그인에 실패했습니다. 다시 시도해 주세요.");
            router.push("/ui_login");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("네트워크 오류가 발생했습니다.");
          router.push("/ui_login");
        });
    }
  }, [search, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center text-[#6100ff] bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6100ff]"></div>
        <p className="text-xl font-medium tracking-tighter">로그인 중입니다...</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-[#6100ff]">Loading...</div>}>
      <LoginHandler />
    </Suspense>
  );
}
