import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Header } from './components/Header';
import { Grid, Cell, Badge, Tiles } from './components/Styled';
import { Target } from './components/Target';
import { Tile, TilePreview } from './components/Tile';
import { buildGrid, parseCages, cageValid, gridValid, GridCell } from './util';
import puzzles from './puzzles';

let puzzle = puzzles[0];
let grid = buildGrid(puzzle);
let cages = parseCages(puzzle);
let tiles = new Array(puzzle.size).fill(0).map((_, i) => i + 1);

export const DRAGGABLE_TYPE = 'TILE';

export type Item = {
  id?: number;
  type: string;
  value: number | null;
};

interface CellState extends GridCell {
  value: number | null;
  valid?: boolean;
}

let initialGrid: CellState[] = grid.map((cell) => ({ ...cell, value: null, valid: false }));

export default function App() {
  let [grid, setGrid] = React.useState<CellState[]>(initialGrid);
  let [complete, setComplete] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (gridFull(grid) || complete) {
      setComplete(gridValid(grid.map((cell) => cell.value as number)));
    }
  }, [grid, complete]);

  function handleDrop(index: number) {
    return (item: Item | null) => {
      let temp = grid[index].value;
      let updatedGrid = grid.map((cell, i) =>
        i === index ? { ...cell, value: item ? item.value : null } : cell
      );

      if (item && item.id) {
        updatedGrid[item.id].value = temp;
        updatedGrid = validateCage(updatedGrid, item.id);
      }

      setGrid(validateCage(updatedGrid, index));
    };
  }

  function resetGrid() {
    setGrid(initialGrid);
    setComplete(false);
  }

  return (
    <React.Fragment>
      <Header complete={complete} resetGrid={resetGrid} />
      <DndProvider backend={isTouchEnabled() ? TouchBackend : HTML5Backend}>
        <Grid size={puzzle.size}>
          {grid.map((cell, i) => (
            <Cell
              key={i}
              size={puzzle.size}
              borderBottom={cell.borderBottom}
              borderRight={cell.borderRight}
            >
              {cell.badge && <Badge valid={cell.valid}>{cell.badge}</Badge>}
              <Target index={i} complete={complete} handleDrop={handleDrop(i)}>
                {cell.value}
              </Target>
            </Cell>
          ))}
        </Grid>
        <Tiles>
          {tiles.map((label, i) => (
            <Tile key={i} size={puzzle.size}>
              {label}
            </Tile>
          ))}
        </Tiles>
        {isTouchEnabled() && <TilePreview size={puzzle.size} />}
      </DndProvider>
    </React.Fragment>
  );
}

function validateCage(grid: CellState[], index: number) {
  let cage = cages.filter((cage) => cage.cells.includes(index))[0];
  let operands: number[] = grid
    .filter((cell, i) => cage.cells.includes(i) && cell.value !== null)
    .map((cell) => cell.value as number);
  let valid =
    operands.length === cage.cells.length && cageValid(cage.result, cage.operator, operands);

  return grid.map((cell, i) => (i === cage.cells[0] ? { ...cell, valid } : cell));
}

function gridFull(grid: CellState[]) {
  for (let cell of grid) {
    if (cell.value === null) {
      return false;
    }
  }

  return true;
}

function isTouchEnabled() {
  return 'ontouchstart' in window;
}
