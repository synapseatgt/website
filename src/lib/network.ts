/**
 * Builds the node-and-edge "connectome" graphic used behind the hero and page
 * headers. Deterministic (seeded), so every build draws the same picture.
 */
export interface Node {
  x: number;
  y: number;
  r: number;
  fill: string;
}
export interface Edge {
  a: number;
  b: number;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/* Blue family carries most nodes; yellow is the logo's accent, used sparingly. */
const PALETTE = ['#004AAD', '#7FA3D6', '#004AAD', '#FBCE09', '#B9CDEB', '#FBCE09', '#7FA3D6'];

export function buildNetwork(opts: {
  seed: number;
  width: number;
  height: number;
  count: number;
  links?: number;
  minR?: number;
  maxR?: number;
}) {
  const { seed, width, height, count, links = 2, minR = 3, maxR = 9 } = opts;
  const rand = mulberry32(seed);
  const nodes: Node[] = [];
  // Poisson-ish spacing so nodes don't clump.
  const minDist = Math.sqrt((width * height) / count) * 0.55;
  let tries = 0;
  while (nodes.length < count && tries < count * 40) {
    tries++;
    const x = Math.round(rand() * width);
    const y = Math.round(rand() * height);
    if (nodes.some((n) => (n.x - x) ** 2 + (n.y - y) ** 2 < minDist ** 2)) continue;
    nodes.push({
      x,
      y,
      r: +(minR + rand() * (maxR - minR)).toFixed(1),
      fill: PALETTE[Math.floor(rand() * PALETTE.length)],
    });
  }
  const seen = new Set<string>();
  const edges: Edge[] = [];
  nodes.forEach((n, i) => {
    const nearest = nodes
      .map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, links);
    for (const { j } of nearest) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push({ a: i, b: j });
      }
    }
  });
  return { nodes, edges };
}
