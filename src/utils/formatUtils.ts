export function nestedGet(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

// ─── formatCurrency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── formatDate
export function formatDate(value: string): string {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

// ─── generateId
export function generateId(): string {
  return crypto.randomUUID();
}

// ─── exportToCSV
export function exportToCSV<T extends Record<string, unknown>>(
  rows: T[],
  filename = "export.csv",
): void {
  if (!rows.length) return;

  const flat = rows.map((r) => flatten(r as Record<string, unknown>));
  const headers = Object.keys(flat[0]);

  const csv =
    headers.join(",") +
    "\n" +
    flat
      .map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(","))
      .join("\n");

  downloadBlob(new Blob([csv], { type: "text/csv" }), filename);
}

// ─── exportToJSON
export function exportToJSON<T>(rows: T[], filename = "export.json"): void {
  downloadBlob(
    new Blob([JSON.stringify(rows, null, 2)], {
      type: "application/json",
    }),
    filename,
  );
}
function flatten(
  obj: Record<string, unknown>,
  prefix = "",
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;

    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(result, flatten(v as Record<string, unknown>, key));
    } else {
      result[key] = Array.isArray(v) ? v.join("; ") : String(v ?? "");
    }
  }

  return result;
}
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
