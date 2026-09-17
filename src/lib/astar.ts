export type Cell = { x: number; z: number };
export type SearchFrame = { open: Cell[]; closed: Cell[]; current: Cell; g: number; h: number };

const key = (p: Cell) => `${p.x},${p.z}`;
const distance = (a: Cell, b: Cell) => Math.hypot(a.x - b.x, a.z - b.z);

/** A real 8-way A* search. Frames are retained so the interface can play the search back. */
export function astar(start: Cell, goal: Cell, blocked: Set<string>, size = 22) {
  type Node = Cell & { g: number; h: number; f: number; parent?: Node };
  const open: Node[] = [{ ...start, g: 0, h: distance(start, goal), f: distance(start, goal) }];
  const visited = new Map<string, Node>();
  const closed = new Set<string>();
  const frames: SearchFrame[] = [];
  const directions = [-1, 0, 1];
  while (open.length) {
    open.sort((a, b) => a.f - b.f || a.h - b.h);
    const current = open.shift()!;
    if (closed.has(key(current))) continue;
    closed.add(key(current));
    frames.push({ open: open.map(({ x, z }) => ({ x, z })), closed: [...closed].map(s => { const [x,z] = s.split(',').map(Number); return {x,z}; }), current, g: current.g, h: current.h });
    if (current.x === goal.x && current.z === goal.z) {
      const path: Cell[] = []; let n: Node | undefined = current;
      while (n) { path.unshift({ x: n.x, z: n.z }); n = n.parent; }
      return { path, frames };
    }
    for (const dx of directions) for (const dz of directions) {
      if (!dx && !dz) continue;
      const next = { x: current.x + dx, z: current.z + dz };
      if (next.x < 0 || next.z < 0 || next.x >= size || next.z >= size || blocked.has(key(next)) || closed.has(key(next))) continue;
      // Prevent cutting through the corner of two occupied cells.
      if (dx && dz && (blocked.has(key({x:current.x + dx,z:current.z})) || blocked.has(key({x:current.x,z:current.z + dz})))) continue;
      const g = current.g + (dx && dz ? Math.SQRT2 : 1);
      const old = visited.get(key(next));
      if (!old || g < old.g) { const n: Node = { ...next, g, h: distance(next, goal), f: g + distance(next, goal), parent: current }; visited.set(key(next), n); open.push(n); }
    }
  }
  return { path: [], frames };
}

export const cellKey = key;
