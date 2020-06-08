import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { AppHeader } from './components/AppHeader';
import { GridHeader } from './components/GridHeader';
import { Grid, Cell, Badge, Tiles } from './components/Styled';
import { Target } from './components/Target';
import { Tile, TilePreview } from './components/Tile';
import { buildGrid, parseCages, cageValid, gridValid, Cage, GridCell } from './util';
import puzzles, { Puzzle } from './puzzles';

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

export default function App() {
  let [puzzleIndex, setPuzzleIndex] = React.useState<number>(0);
  let puzzle = puzzles[puzzleIndex];
  let tiles = new Array(puzzle.size).fill(0).map((_, i) => i + 1);
  let [cages, setCages] = React.useState<Cage[]>(parseCages(puzzle));
  let [grid, setGrid] = React.useState<CellState[]>(initialGrid(puzzle));
  let [complete, setComplete] = React.useState<boolean>(false);

  React.useEffect(() => {
    setCages(parseCages(puzzles[puzzleIndex]));
    setGrid(initialGrid(puzzles[puzzleIndex]));
    setComplete(false);
  }, [puzzleIndex]);

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

      if (item && typeof item.id !== 'undefined') {
        updatedGrid[item.id].value = temp;
        updatedGrid = validateCage(updatedGrid, cages, item.id);
      }

      setGrid(validateCage(updatedGrid, cages, index));
    };
  }

  function handleDragStart(index: number) {
    return () => setGrid(grid.map((cell, i) => (i === index ? { ...cell, valid: false } : cell)));
  }

  function resetGrid() {
    setGrid(initialGrid(puzzle));
    setComplete(false);
  }

  function nextPuzzle() {
    setPuzzleIndex((index) => (index < puzzles.length - 1 ? index + 1 : 0));
  }

  return (
    <React.Fragment>
      <AppHeader size={puzzle.size} />
      <GridHeader complete={complete} resetGrid={resetGrid} nextPuzzle={nextPuzzle} />
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
              <Target
                index={i}
                complete={complete}
                handleDrop={handleDrop(i)}
                handleDragStart={handleDragStart(i)}
              >
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

function validateCage(grid: CellState[], cages: Cage[], index: number) {
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

function initialGrid(puzzle: Puzzle) {
  return buildGrid(puzzle).map((cell) => ({
    ...cell,
    value: null,
    valid: false,
  }));
}

function isTouchEnabled() {
  return 'ontouchstart' in window;
}
