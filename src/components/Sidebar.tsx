"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { CentralIcon } from "@central-icons-react/all";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { centralIconProps } from "@/lib/icon-props";

const navLinkBase = "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors group w-full";
const navLinkActive = `${navLinkBase} bg-border/50 text-foreground`;
const navLinkInactive = `${navLinkBase} text-foreground hover:bg-border/50`;
const navIconClass = "size-5 flex-none text-muted-foreground opacity-80 group-hover:text-foreground";
const sectionLabelClass = "block mt-4 mb-1 px-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider";

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isActive = (href: string) => pathname === href;
  const isActivePrefix = (prefix: string) => pathname.startsWith(prefix);

  return (
    <aside className="relative hidden h-full w-64 flex-none md:block mt-1">
      <div className="flex h-full flex-col overflow-y-auto bg-background">
        <nav className="flex-1 px-2 py-2 space-y-1">
          <Link href="/" className={isActive("/") ? navLinkActive : navLinkInactive}>
            <CentralIcon {...centralIconProps} name="IconHome" size={20} className={navIconClass} ariaHidden />
            Home
          </Link>
          <Link href="/favorite-colleges" className={isActive("/favorite-colleges") ? navLinkActive : navLinkInactive}>
            <CentralIcon {...centralIconProps} name="IconHeart" size={20} className={navIconClass} ariaHidden />
            Favorite Colleges
          </Link>

          <span className={sectionLabelClass}>CALCULATORS</span>
          <Link href="/calculators/college-eligibility" className={isActivePrefix("/calculators/college-eligibility") ? navLinkActive : navLinkInactive}>
            <CentralIcon {...centralIconProps} name="IconCheckCircle2" size={20} className={navIconClass} ariaHidden />
            College Eligibility
          </Link>
          <Link href="/calculators/college-deadlines" className={isActivePrefix("/calculators/college-deadlines") ? navLinkActive : navLinkInactive}>
            <CentralIcon {...centralIconProps} name="IconCalendar1" size={20} className={navIconClass} ariaHidden />
            College RD/ED/EA/etc.
          </Link>
          <Link href="/calculators/sat" className={isActivePrefix("/calculators/sat") ? navLinkActive : navLinkInactive}>
            <CentralIcon {...centralIconProps} name="IconCalculator" size={20} className={navIconClass} ariaHidden />
            SAT® Score
          </Link>
          <Link href="/calculators/act" className={isActivePrefix("/calculators/act") ? navLinkActive : navLinkInactive}>
            <CentralIcon {...centralIconProps} name="IconCalculator" size={20} className={navIconClass} ariaHidden />
            ACT® Score
          </Link>
        </nav>

        <div className="mt-auto p-2 space-y-1 pb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={navLinkInactive}
                aria-label="Select theme"
              >
                <CentralIcon {...centralIconProps} name="IconMoon" size={20} className={navIconClass} ariaHidden />
                Theme
                <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground opacity-80 group-hover:text-foreground" aria-hidden />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-[15rem] bg-popover text-popover-foreground border-border">
              {themes.map((t) => (
                <DropdownMenuItem
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className="text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                >
                  {t.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/settings" className={isActive("/settings") ? navLinkActive : navLinkInactive}>
            <CentralIcon {...centralIconProps} name="IconSettingsGear2" size={20} className={navIconClass} ariaHidden />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}
