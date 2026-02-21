"use client";

import Link from "next/link";
import { CentralIcon } from "@central-icons-react/all";
import { centralIconProps } from "@/lib/icon-props";

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between bg-background px-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
          C
        </div>
        <span className="font-bold text-xl text-foreground">CollegeTools</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Link
          href="https://github.com/varunaditya-plus/collegetools"
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="View on GitHub"
        >
          <CentralIcon {...centralIconProps} name="IconGithub" size={20} className="size-5" ariaHidden />
        </Link>
        <Link
          href=""
          target="_blank"
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Join our Discord"
        >
          <CentralIcon {...centralIconProps} name="IconDiscord" size={20} className="size-5" ariaHidden />
        </Link>
      </div>
    </header>
  );
}
