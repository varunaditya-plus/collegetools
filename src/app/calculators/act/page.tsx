"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type ActType = "enhanced" | "legacy";

// Enhanced ACT 2025: English 50, Math 45, Reading 36, Science 40 (optional for composite)
const ENHANCED_ENGLISH_MAX = 50;
const ENHANCED_MATH_MAX = 45;
const ENHANCED_READING_MAX = 36;
const ENHANCED_SCIENCE_MAX = 40;

// Legacy ACT: English 75, Math 60, Reading 40, Science 40
const LEGACY_ENGLISH_MAX = 75;
const LEGACY_MATH_MAX = 60;
const LEGACY_READING_MAX = 40;
const LEGACY_SCIENCE_MAX = 40;

function rawToScaledSection(raw: number, maxRaw: number): number {
  if (maxRaw <= 0) return 1;
  const p = Math.min(1, Math.max(0, raw / maxRaw));
  const scaled = Math.round(1 + p * 35);
  return Math.max(1, Math.min(36, scaled));
}

function computeEnhancedScores(
  english: number,
  math: number,
  reading: number,
  science: number
): { composite: number; english: number; math: number; reading: number; science: number; stemScore: number | null } {
  const e = rawToScaledSection(english, ENHANCED_ENGLISH_MAX);
  const m = rawToScaledSection(math, ENHANCED_MATH_MAX);
  const r = rawToScaledSection(reading, ENHANCED_READING_MAX);
  const s = rawToScaledSection(science, ENHANCED_SCIENCE_MAX);
  const composite = Math.round((e + m + r) / 3);
  const stemScore = Math.round((m + s) / 2);
  return {
    composite: Math.max(1, Math.min(36, composite)),
    english: e,
    math: m,
    reading: r,
    science: s,
    stemScore,
  };
}

function computeLegacyScores(
  english: number,
  math: number,
  reading: number,
  science: number
): { composite: number; english: number; math: number; reading: number; science: number; stemScore: null } {
  const e = rawToScaledSection(english, LEGACY_ENGLISH_MAX);
  const m = rawToScaledSection(math, LEGACY_MATH_MAX);
  const r = rawToScaledSection(reading, LEGACY_READING_MAX);
  const s = rawToScaledSection(science, LEGACY_SCIENCE_MAX);
  const composite = Math.round((e + m + r + s) / 4);
  return {
    composite: Math.max(1, Math.min(36, composite)),
    english: e,
    math: m,
    reading: r,
    science: s,
    stemScore: null,
  };
}

function SectionRow({
  label,
  value,
  max,
  onValueChange,
}: {
  label: string;
  value: number;
  max: number;
  onValueChange: (n: number) => void;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <Slider
            value={[value]}
            onValueChange={([v]) => onValueChange(v)}
            min={0}
            max={max}
            step={1}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Input
            type="number"
            min={0}
            max={max}
            value={value}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              if (!Number.isNaN(n)) onValueChange(Math.min(max, Math.max(0, n)));
            }}
            className="h-8 w-12 text-center tabular-nums text-sm text-foreground bg-white dark:bg-input/30 border border-[#e5e5e5] dark:border-input rounded shadow-sm focus-visible:ring-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-label={label}
          />
          <span className="text-muted-foreground text-sm tabular-nums">/{max}</span>
        </div>
      </div>
    </div>
  );
}

export default function ActScoreCalculatorPage() {
  const [actType, setActType] = useState<ActType>("enhanced");

  // Enhanced 2025
  const [enhEnglish, setEnhEnglish] = useState(25);
  const [enhMath, setEnhMath] = useState(23);
  const [enhReading, setEnhReading] = useState(18);
  const [enhScience, setEnhScience] = useState(20);

  // Legacy
  const [legEnglish, setLegEnglish] = useState(38);
  const [legMath, setLegMath] = useState(30);
  const [legReading, setLegReading] = useState(20);
  const [legScience, setLegScience] = useState(20);

  const results = useMemo(() => {
    if (actType === "enhanced") {
      return computeEnhancedScores(enhEnglish, enhMath, enhReading, enhScience);
    }
    return computeLegacyScores(legEnglish, legMath, legReading, legScience);
  }, [actType, enhEnglish, enhMath, enhReading, enhScience, legEnglish, legMath, legReading, legScience]);

  return (
    <div className="max-w-4xl lg:pt-8 pb-12 mx-auto w-full">
      <div className="space-y-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl !mb-4">
          {actType === "enhanced" ? "Enhanced ACT® (2025)" : "Legacy ACT®"} Score Calculator
        </h1>

        <p className="text-sm text-muted-foreground">
          Below is a calculator you can use to estimate your ACT score using the number of questions you got right in each section.
        </p>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={actType === "enhanced" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActType("enhanced")}
            className={cn(
              "rounded-md font-medium",
              actType === "enhanced"
                ? "bg-black dark:bg-primary text-white dark:text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent border-0"
            )}
          >
            Enhanced ACT® (2025)
          </Button>
          <Button
            type="button"
            variant={actType === "legacy" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActType("legacy")}
            className={cn(
              "rounded-md font-medium",
              actType === "legacy"
                ? "bg-black dark:bg-primary text-white dark:text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent border-0"
            )}
          >
            Legacy ACT®
          </Button>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 w-full">
          <div className="space-y-6 flex-1 min-w-0">
            {actType === "enhanced" ? (
              <>
                <SectionRow
                  label="English"
                  value={enhEnglish}
                  max={ENHANCED_ENGLISH_MAX}
                  onValueChange={setEnhEnglish}
                />
                <SectionRow
                  label="Mathematics"
                  value={enhMath}
                  max={ENHANCED_MATH_MAX}
                  onValueChange={setEnhMath}
                />
                <SectionRow
                  label="Reading"
                  value={enhReading}
                  max={ENHANCED_READING_MAX}
                  onValueChange={setEnhReading}
                />
                <SectionRow
                  label="Science (optional for composite)"
                  value={enhScience}
                  max={ENHANCED_SCIENCE_MAX}
                  onValueChange={setEnhScience}
                />
              </>
            ) : (
              <>
                <SectionRow
                  label="English"
                  value={legEnglish}
                  max={LEGACY_ENGLISH_MAX}
                  onValueChange={setLegEnglish}
                />
                <SectionRow
                  label="Mathematics"
                  value={legMath}
                  max={LEGACY_MATH_MAX}
                  onValueChange={setLegMath}
                />
                <SectionRow
                  label="Reading"
                  value={legReading}
                  max={LEGACY_READING_MAX}
                  onValueChange={setLegReading}
                />
                <SectionRow
                  label="Science"
                  value={legScience}
                  max={LEGACY_SCIENCE_MAX}
                  onValueChange={setLegScience}
                />
              </>
            )}
          </div>

          <div className="space-y-6 lg:min-w-[320px] shrink-0">
            <div className="rounded-2xl border border-[#e5e5e5] dark:border-border bg-[#f5f5f5] dark:bg-muted p-6 flex flex-col h-full">
              <div className="space-y-6 flex-1">
                <div>
                  <p className="text-sm font-medium text-foreground">Composite Score</p>
                  <p className="text-4xl font-bold text-foreground tabular-nums leading-none mt-2 flex items-baseline gap-2">
                    {results.composite}
                    <span className="text-xl font-normal text-muted-foreground">/36</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">English</p>
                    <p className="text-2xl font-bold text-foreground tabular-nums leading-none mt-2 flex items-baseline gap-2">
                      {results.english}
                      <span className="text-lg font-normal text-muted-foreground">/36</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Mathematics</p>
                    <p className="text-2xl font-bold text-foreground tabular-nums leading-none mt-2 flex items-baseline gap-2">
                      {results.math}
                      <span className="text-lg font-normal text-muted-foreground">/36</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Reading</p>
                    <p className="text-2xl font-bold text-foreground tabular-nums leading-none mt-2 flex items-baseline gap-2">
                      {results.reading}
                      <span className="text-lg font-normal text-muted-foreground">/36</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Science</p>
                    <p className="text-2xl font-bold text-foreground tabular-nums leading-none mt-2 flex items-baseline gap-2">
                      {results.science}
                      <span className="text-lg font-normal text-muted-foreground">/36</span>
                    </p>
                  </div>
                </div>
                {results.stemScore !== null && (
                  <div>
                    <p className="text-sm font-medium text-foreground">STEM Score (Math + Science)</p>
                    <p className="text-2xl font-bold text-foreground tabular-nums leading-none mt-2 flex items-baseline gap-2">
                      {results.stemScore}
                      <span className="text-lg font-normal text-muted-foreground">/36</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
