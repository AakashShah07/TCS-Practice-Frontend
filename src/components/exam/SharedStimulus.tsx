"use client";

import { useState } from "react";
import {
  BarChart3,
  FileText,
  ImageOff,
  Table2,
  ZoomIn,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Media, QuestionGroup } from "@/lib/api/types";

const GROUP_TYPE_LABELS: Record<string, string> = {
  data_interpretation: "Data Interpretation",
  reading_comprehension: "Reading Comprehension",
  image_based: "Image Based",
  table_based: "Table Based",
  case_study: "Case Study",
  data_sufficiency: "Data Sufficiency",
  syllogism: "Syllogism",
};

const CHART_COLORS = ["#6366f1", "#0ea5e9", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

function hasUrl(media: Media): boolean {
  return typeof media.url === "string" && media.url.trim().length > 0;
}

// ── Pipe-delimited table support ────────────────────────────────────────────
// Some question sets (e.g. Infosys SE 2027 "QuickKart" / Sales & Profit mocks)
// embed tables as pipe-delimited text in the stimulus/question string, e.g.:
//   Year | Sales (₹ lakh) | Profit (₹ lakh)
//   2019 | 200 | 40
//   2020 | 250 | 55
// The frontend should render these as a real <table>, not raw text.

function isPipeRow(line: string): boolean {
  const t = line.trim();
  if (!t) return false;
  const cells = t.split("|").map((c) => c.trim());
  if (cells.length < 2) return false;
  // Skip markdown-style separator rows such as "---|---|---".
  if (cells.every((c) => /^:?-{2,}:?$/.test(c))) return false;
  return cells.some((c) => c.length > 0);
}

function isNumericCell(c: string): boolean {
  return /^\s*-?[\d,]*\.?\d+\s*$/.test(c) || /^\s*₹\s*-?[\d,]*\.?\d+\s*$/.test(c);
}

function isHeaderRow(row: string[]): boolean {
  if (row.length === 0) return false;
  return row.every((c) => c !== "" && !isNumericCell(c));
}

function parsePipeRows(lines: string[]): string[][] | null {
  const rows = lines
    .map((l) => l.trim().split("|").map((c) => c.trim()))
    .filter((r) => r.some((c) => c.length > 0));
  if (rows.length < 2) return null;
  return rows;
}

interface StimulusBlock {
  prose?: string;
  rows?: string[][];
}

/** Splits stimulus text into prose paragraphs and pipe-delimited table blocks. */
export function segmentStimulusText(text: string): StimulusBlock[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  const blocks: StimulusBlock[] = [];
  let prose: string[] | null = null;
  let tableLines: string[] = [];

  const flushProse = () => {
    if (prose && prose.length > 0) {
      blocks.push({ prose: prose.join("\n") });
      prose = null;
    }
  };
  const flushTable = () => {
    if (tableLines.length > 0) {
      const rows = parsePipeRows(tableLines);
      if (rows) blocks.push({ rows });
      tableLines = [];
    }
  };

  for (const line of lines) {
    if (isPipeRow(line)) {
      flushProse();
      tableLines.push(line);
    } else {
      flushTable();
      if (!prose) prose = [];
      prose.push(line);
    }
  }
  flushTable();
  flushProse();

  return blocks;
}

export function StimulusTable({ rows, className }: { rows: string[][]; className?: string }) {
  const header = isHeaderRow(rows[0]) ? rows[0] : null;
  const body = header ? rows.slice(1) : rows;

  return (
    <div
      data-testid="stimulus-table"
      className={cn(
        "w-full overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900",
        className
      )}
    >
      <Table>
        {header && (
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-900/60">
              {header.map((h, i) => (
                <TableHead key={i} className="font-semibold whitespace-normal text-slate-700 dark:text-slate-200">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {body.map((r, ri) => (
            <TableRow
              key={ri}
              className={header ? undefined : "bg-slate-50/60 dark:bg-slate-900/40"}
            >
              {r.map((c, ci) => (
                <TableCell
                  key={ci}
                  className="whitespace-nowrap align-middle text-slate-700 dark:text-slate-300"
                >
                  {c}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/** Neutral fallback — never renders a broken image or a raw URL. */
function MediaFallback({ media, className }: { media?: Media | null; className?: string }) {
  const label =
    media?.alt?.trim() ||
    (media?.type === "table"
      ? "Table data unavailable"
      : media?.type === "chart"
        ? "Chart unavailable"
        : "Media unavailable");
  const Icon = media?.type === "table" ? Table2 : media?.type === "chart" ? BarChart3 : ImageOff;
  return (
    <div
      role="img"
      aria-label={label}
      data-testid="media-fallback"
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 px-4 py-8 text-center",
        className
      )}
    >
      <Icon className="h-6 w-6 text-slate-400" />
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}

function MediaImage({ media, className }: { media: Media; className?: string }) {
  const [failed, setFailed] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  if (!hasUrl(media) || failed) {
    return <MediaFallback media={media} className={className} />;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setZoomOpen(true)}
        aria-label={`Enlarge image: ${media.alt || "question media"}`}
        className={cn(
          "group relative block w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.url}
          alt={media.alt || "Question media"}
          onError={() => setFailed(true)}
          className="mx-auto max-h-[420px] w-auto max-w-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
        />
        <span className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn className="h-3.5 w-3.5" /> Zoom
        </span>
      </button>

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl p-3">
          <DialogTitle className="sr-only">{media.alt || "Question media"}</DialogTitle>
          <DialogDescription className="sr-only">
            Enlarged view of the question image
          </DialogDescription>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.url}
            alt={media.alt || "Question media"}
            className="mx-auto max-h-[85vh] w-auto max-w-full object-contain"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function MediaTable({ media, className }: { media: Media; className?: string }) {
  const table = media.table;
  if (!table || !Array.isArray(table.columns) || !Array.isArray(table.rows)) {
    return hasUrl(media) ? (
      <MediaImage media={{ ...media, type: "image" }} className={className} />
    ) : (
      <MediaFallback media={media} className={className} />
    );
  }

  return (
    <div
      data-testid="media-table"
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700",
        className
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-900/60">
            {table.columns.map((c, i) => (
              <TableHead key={i} className="font-semibold text-slate-700 dark:text-slate-200">
                {c}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.rows.map((row, ri) => (
            <TableRow key={ri}>
              {row.map((cell, ci) => (
                <TableCell key={ci} className="text-slate-700 dark:text-slate-300">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function MediaChart({ media, className }: { media: Media; className?: string }) {
  const chart = media.chart;
  if (!chart || !Array.isArray(chart.data) || chart.data.length === 0) {
    return hasUrl(media) ? (
      <MediaImage media={{ ...media, type: "image" }} className={className} />
    ) : (
      <MediaFallback media={media} className={className} />
    );
  }

  const series =
    chart.series && chart.series.length > 0
      ? chart.series
      : [{ key: chart.yKey || "value", label: chart.yKey || "Value" }];

  return (
    <div
      data-testid="media-chart"
      className={cn(
        "h-[320px] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3",
        className
      )}
    >
      <ResponsiveContainer width="100%" height="100%">
        {chart.kind === "line" ? (
          <LineChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey={chart.xKey || "label"} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            {series.length > 1 && <Legend />}
            {series.map((s, i) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label || s.key}
                stroke={s.color || CHART_COLORS[i % CHART_COLORS.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        ) : chart.kind === "pie" ? (
          <PieChart>
            <Tooltip />
            <Pie
              data={chart.data}
              dataKey={chart.valueKey || "value"}
              nameKey={chart.nameKey || "label"}
              outerRadius="80%"
              label
            >
              {chart.data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : (
          <BarChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey={chart.xKey || "label"} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            {series.length > 1 && <Legend />}
            {series.map((s, i) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label || s.key}
                fill={s.color || CHART_COLORS[i % CHART_COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

/** Renders any supported media type, degrading gracefully when data is missing. */
export function MediaRenderer({
  media,
  className,
}: {
  media?: Media | null;
  className?: string;
}) {
  if (!media || !media.type) return null;

  switch (media.type) {
    case "image":
      return <MediaImage media={media} className={className} />;
    case "table":
      return <MediaTable media={media} className={className} />;
    case "chart":
      return <MediaChart media={media} className={className} />;
    default:
      return hasUrl(media) ? (
        <MediaImage media={media} className={className} />
      ) : (
        <MediaFallback media={media} className={className} />
      );
  }
}

/** Renders the shared stimulus of a question group (text and/or media). */
export default function SharedStimulus({ group }: { group: QuestionGroup }) {
  const stimulus = group.stimulus || {};
  const hasText = typeof stimulus.text === "string" && stimulus.text.trim().length > 0;
  const hasMedia = Boolean(stimulus.media && stimulus.media.type);
  const typeLabel = GROUP_TYPE_LABELS[group.type] || "Shared Information";
  const blocks = hasText ? segmentStimulusText(stimulus.text ?? "") : [];

  return (
    <section
      aria-label={`Shared information: ${group.title}`}
      data-testid="shared-stimulus"
      className="flex min-w-0 flex-col gap-4"
    >
      <header className="flex flex-wrap items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[12px] font-semibold text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800">
          <FileText className="h-3.5 w-3.5" />
          {typeLabel}
        </span>
        <h2 className="text-[15px] sm:text-base font-semibold text-slate-800 dark:text-slate-100">
          {group.title}
        </h2>
      </header>

      {hasMedia && <MediaRenderer media={stimulus.media} />}

      {hasText ? (
        blocks.length > 0 ? (
          blocks.map((block, i) =>
            block.prose ? (
              <p
                key={`prose-${i}`}
                className="max-w-prose whitespace-pre-wrap text-base leading-[1.85] text-slate-700 dark:text-slate-200"
              >
                {block.prose}
              </p>
            ) : block.rows ? (
              <StimulusTable key={`table-${i}`} rows={block.rows} />
            ) : null
          )
        ) : (
          <p className="text-sm text-muted-foreground">No additional information provided.</p>
        )
      ) : (
        !hasMedia && (
          <p className="text-sm text-muted-foreground">No additional information provided.</p>
        )
      )}
    </section>
  );
}
