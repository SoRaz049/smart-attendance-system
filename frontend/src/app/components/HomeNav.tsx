"use client";
import Image from "next/image";
import Link from "next/link";

const HomeNav = () => {
  return (
    <div className="border-b border-border h-14 flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="https://cdn.icon-icons.com/icons2/3907/PNG/512/face_recognition_icon_246687.png"
            alt="Logo"
            width={32}
            height={32}
          />
          <span className="text-xl font-semibold">QuickMark</span>
        </div>

        <Link
          href="/login"
          className=" rounded-md text-sm border transition-colors px-4 py-[5px] bg-blue text-white"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default HomeNav;
