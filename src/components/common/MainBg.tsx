import Image from "next/image";
import Mainbg from "@/assets/landing/Mainbg.svg";

export default function MainBg() {
  return (
    <>
      <div className="absolute z-[-1]">
        <Image src={Mainbg} alt="Mainbg" priority />
      </div>
    </>
  );
}
