export type DiffLine = { kind: 'same' | 'add' | 'del'; text: string; oldNo?: number; newNo?: number };

// One trailing newline ends the last line; it doesn't start an empty one.
const toLines = (s: string) => {
  const t = s.endsWith('\n') ? s.slice(0, -1) : s;
  return t === '' && s.length <= 1 ? [] : t.split('\n');
};

/** Line diff via an LCS table. */
// ponytail: O(n·m) time and memory; fine for snippet-sized files (hundreds of lines). Switch to Myers for thousands.
export function diffLines(a: string, b: string): DiffLine[] {
  const x = toLines(a);
  const y = toLines(b);
  const n = x.length;
  const m = y.length;
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) dp[i][j] = x[i] === y[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  }
  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (x[i] === y[j]) out.push({ kind: 'same', text: x[i], oldNo: ++i, newNo: ++j });
    else if (dp[i + 1][j] >= dp[i][j + 1]) out.push({ kind: 'del', text: x[i], oldNo: ++i });
    else out.push({ kind: 'add', text: y[j], newNo: ++j });
  }
  while (i < n) out.push({ kind: 'del', text: x[i], oldNo: ++i });
  while (j < m) out.push({ kind: 'add', text: y[j], newNo: ++j });
  return out;
}

/** Side-by-side rows: unchanged lines on both sides; each run of deletions paired with the following additions. */
export function splitRows(lines: DiffLine[]): Array<{ left?: DiffLine; right?: DiffLine }> {
  const rows: Array<{ left?: DiffLine; right?: DiffLine }> = [];
  let k = 0;
  while (k < lines.length) {
    if (lines[k].kind === 'same') {
      rows.push({ left: lines[k], right: lines[k] });
      k++;
      continue;
    }
    const dels: DiffLine[] = [];
    const adds: DiffLine[] = [];
    while (k < lines.length && lines[k].kind === 'del') dels.push(lines[k++]);
    while (k < lines.length && lines[k].kind === 'add') adds.push(lines[k++]);
    for (let t = 0; t < Math.max(dels.length, adds.length); t++) rows.push({ left: dels[t], right: adds[t] });
  }
  return rows;
}
