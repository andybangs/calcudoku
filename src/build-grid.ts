import { Puzzle } from './puzzles';

export type GridCell = {
  badge?: string;
  borderRight: boolean;
  borderBottom: boolean;
};

export type Grid = GridCell[];

export default function buildGrid({ size, cages }: Puzzle): Grid {
  let gridIndex = getIndex(size);
  let grid = initGrid(size);

  for (let cage of cages) {
    let arr = cage.split(' ');
    let seen = new Set<string>();

    grid[gridIndex(arr[2])].badge = buildBadge(parseInt(arr[0], 10), arr[1] as Operator);
    seen.add(arr[2]);

    for (let i = 3; i < arr.length; i++) {
      let cell = arr[i];
      let { above, below, left, right } = getNeighbors(cell);

      if (seen.has(above)) {
        grid[gridIndex(above)].borderBottom = false;
      }

      if (seen.has(below)) {
        grid[gridIndex(cell)].borderBottom = false;
      }

      if (seen.has(left)) {
        grid[gridIndex(left)].borderRight = false;
      }

      if (seen.has(right)) {
        grid[gridIndex(cell)].borderRight = false;
      }

      seen.add(cell);
    }
  }

  return grid;
}

// ---------
// PRIVATE
// ---------

function getNeighbors(cell: string) {
  return {
    above: cell.charAt(0).concat((parseInt(cell.charAt(1), 10) - 1).toString()),
    below: cell.charAt(0).concat((parseInt(cell.charAt(1), 10) + 1).toString()),
    left: String.fromCharCode(cell.charCodeAt(0) - 1).concat(cell.charAt(1)),
    right: String.fromCharCode(cell.charCodeAt(0) + 1).concat(cell.charAt(1)),
  };
}

type Operator = '+' | '-' | '*' | '/' | '=';

function buildBadge(result: number, operator: Operator) {
  let badge = result.toString();

  if (operator !== '=') {
    badge += operator;
  }

  return badge;
}

function getIndex(size: number) {
  return (cell: string) => cell.charCodeAt(0) - 65 + (parseInt(cell.charAt(1), 10) - 1) * size;
}

function initGrid(size: number) {
  let grid: Grid = [];

  for (let i = 0; i < size ** 2; i++) {
    grid.push({
      borderBottom: i < size ** 2 - size, // bottom row boundary drawn by grid container
      borderRight: (i + 1) % size !== 0, // right column boundary drawn by grid container
    });
  }

  return grid;
}
