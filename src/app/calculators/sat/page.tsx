"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type SatType = "digital" | "legacy";

// Digital SAT: 2 RW modules (27 each), 2 Math modules (22 each)
const DIGITAL_RW_MAX = 27;
const DIGITAL_MATH_MAX = 22;

// Legacy SAT: Reading 52, Writing 44, Math No-Calc 20, Math Calc 38
const LEGACY_READING_MAX = 52;
const LEGACY_WRITING_MAX = 44;
const LEGACY_MATH_NC_MAX = 20;
const LEGACY_MATH_C_MAX = 38;

const DIGITAL_RW_MODULE_1: number[] = [
  100, 100, 120, 140, 160, 170, 180, 190, 200, 200, 210, 210, 220, 230, 240, 260, 270, 290, 310, 320, 340, 360, 370, 390, 410, 430, 440, 460,
];
const DIGITAL_RW_MODULE_2: number[] = [
  100, 100, 100, 110, 110, 110, 120, 120, 120, 130, 130, 140, 150, 170, 190, 190, 200, 210, 230, 240, 250, 260, 280, 290, 300, 310, 330, 340,
];
const DIGITAL_MATH_MODULE_1: number[] = [
  100, 100, 120, 140, 160, 160, 180, 180, 200, 200, 210, 240, 260, 280, 300, 320, 340, 360, 390, 410, 430, 450, 470,
];
const DIGITAL_MATH_MODULE_2: number[] = [
  100, 100, 100, 120, 120, 130, 150, 170, 170, 170, 190, 190, 200, 200, 210, 230, 240, 260, 270, 290, 300, 320, 330,
];

function lookupModuleScore(table: number[], raw: number, maxRaw: number): number {
  const i = Math.max(0, Math.min(Math.floor(raw), maxRaw));
  return table[i] ?? table[table.length - 1] ?? 200;
}

function computeDigitalScores(
  rw1: number,
  rw2: number,
  math1: number,
  math2: number
): { total: number; rw: number; math: number } {
  const rw =
    lookupModuleScore(DIGITAL_RW_MODULE_1, rw1, DIGITAL_RW_MAX) +
    lookupModuleScore(DIGITAL_RW_MODULE_2, rw2, DIGITAL_RW_MAX);
  const math =
    lookupModuleScore(DIGITAL_MATH_MODULE_1, math1, DIGITAL_MATH_MAX) +
    lookupModuleScore(DIGITAL_MATH_MODULE_2, math2, DIGITAL_MATH_MAX);
  return { total: rw + math, rw, math };
}

function rawToScaledSection(raw: number, maxRaw: number): number {
  if (maxRaw <= 0) return 200;
  const p = Math.min(1, Math.max(0, raw / maxRaw));
  return Math.round(200 + p * 600);
}

function computeLegacyScores(
  reading: number,
  writing: number,
  mathNc: number,
  mathC: number
): { total: number; ebrw: number; math: number } {
  const ebrwRaw = reading + writing;
  const mathRaw = mathNc + mathC;
  const ebrw = rawToScaledSection(ebrwRaw, LEGACY_READING_MAX + LEGACY_WRITING_MAX);
  const math = rawToScaledSection(mathRaw, LEGACY_MATH_NC_MAX + LEGACY_MATH_C_MAX);
  return { total: ebrw + math, ebrw, math };
}

function ModuleRow({
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

export default function SatScoreCalculatorPage() {
  const [satType, setSatType] = useState<SatType>("digital");

  // Digital: RW1, RW2, Math1, Math2
  const [rw1, setRw1] = useState(14);
  const [rw2, setRw2] = useState(14);
  const [math1, setMath1] = useState(11);
  const [math2, setMath2] = useState(11);

  // Legacy: Reading, Writing, Math No-Calc, Math Calc
  const [reading, setReading] = useState(26);
  const [writing, setWriting] = useState(22);
  const [mathNc, setMathNc] = useState(10);
  const [mathC, setMathC] = useState(19);

  const results = useMemo(() => {
    if (satType === "digital") {
      return computeDigitalScores(rw1, rw2, math1, math2);
    }
    return computeLegacyScores(reading, writing, mathNc, mathC);
  }, [satType, rw1, rw2, math1, math2, reading, writing, mathNc, mathC]);

  const totalScore = results.total;
  const sectionScoreA = "rw" in results ? results.rw : results.ebrw;
  const sectionScoreB = results.math;

  return (
    <div className="max-w-4xl lg:pt-8 pb-12 mx-auto w-full">
      <div className="space-y-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl !mb-4">
          {satType === "digital" ? "Digital SAT®" : "Legacy Pen-and-Paper"} Score Calculator
        </h1>

        <p className="text-sm text-muted-foreground">
          Below is a calculator you can use to estimate your score on the SAT. As College Board has now transitioned to the Digital SAT (which uses adaptive difficulty),{" "}
          <span className="text-red-600 dark:text-red-500">take the number below as solely a prediction.</span>
        </p>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={satType === "digital" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSatType("digital")}
            className={cn(
              "rounded-md font-medium",
              satType === "digital"
                ? "bg-black dark:bg-primary text-white dark:text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent border-0"
            )}
          >
            Digital SAT®
          </Button>
          <Button
            type="button"
            variant={satType === "legacy" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSatType("legacy")}
            className={cn(
              "rounded-md font-medium",
              satType === "legacy"
                ? "bg-black dark:bg-primary text-white dark:text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent border-0"
            )}
          >
            Legacy Pen-and-Paper
          </Button>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 w-full">
          <div className="space-y-6 flex-1 min-w-0">
          {satType === "digital" ? (
            <>
              <ModuleRow
                label="Reading and Writing Module 1"
                value={rw1}
                max={DIGITAL_RW_MAX}
                onValueChange={setRw1}
              />
              <ModuleRow
                label="Reading and Writing Module 2"
                value={rw2}
                max={DIGITAL_RW_MAX}
                onValueChange={setRw2}
              />
              <ModuleRow
                label="Math Module 1"
                value={math1}
                max={DIGITAL_MATH_MAX}
                onValueChange={setMath1}
              />
              <ModuleRow
                label="Math Module 2"
                value={math2}
                max={DIGITAL_MATH_MAX}
                onValueChange={setMath2}
              />
            </>
          ) : (
            <>
              <ModuleRow
                label="Reading"
                value={reading}
                max={LEGACY_READING_MAX}
                onValueChange={setReading}
              />
              <ModuleRow
                label="Writing"
                value={writing}
                max={LEGACY_WRITING_MAX}
                onValueChange={setWriting}
              />
              <ModuleRow
                label="Math (No Calculator)"
                value={mathNc}
                max={LEGACY_MATH_NC_MAX}
                onValueChange={setMathNc}
              />
              <ModuleRow
                label="Math (Calculator)"
                value={mathC}
                max={LEGACY_MATH_C_MAX}
                onValueChange={setMathC}
              />
            </>
          )}
        </div>

        <div className="space-y-6 lg:min-w-[320px] shrink-0">
          <div className="rounded-2xl border border-[#e5e5e5] dark:border-border bg-[#f5f5f5] dark:bg-muted p-6 flex flex-col h-full">
            <div className="space-y-6 flex-1">
              <div>
                <p className="text-sm font-medium text-foreground">Total Score</p>
                <p className="text-4xl font-bold text-foreground tabular-nums leading-none mt-2 flex items-baseline gap-2">
                  {totalScore}
                  <span className="text-xl font-normal text-muted-foreground">/1600</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {satType === "digital" ? "Reading & Writing Score" : "Evidence-Based Reading & Writing"}
                </p>
                <p className="text-2xl font-bold text-foreground tabular-nums leading-none mt-2 flex items-baseline gap-2">
                  {sectionScoreA}
                  <span className="text-lg font-normal text-muted-foreground">/800</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Math Score</p>
                <p className="text-2xl font-bold text-foreground tabular-nums leading-none mt-2 flex items-baseline gap-2">
                  {sectionScoreB}
                  <span className="text-lg font-normal text-muted-foreground">/800</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
