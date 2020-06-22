import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { AppHeader } from './components/AppHeader';
import { GridHeader } from './components/GridHeader';
import { AppContent, Puzzle, Grid, Cell, Badge, TilesCont } from './components/Styled';
import { Target } from './components/Target';
import { Tile, TilePreview } from './components/Tile';
import { useOrientation } from './hooks/use-orientation';
import { buildGrid, parseCages, cageValid, gridValid, Cage, GridCell } from './util';
import puzzles from './puzzles.json';

let puzzleSizes = Object.keys(puzzles).map((str) => parseInt(str, 10));

export const DRAGGABLE_TYPE = 'TILE';

export type Puzzle = {
  size: number;
  cages: string[];
  source?: string;
};

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
  let orientation = useOrientation();
  let [puzzleSize, setPuzzleSize] = React.useState<number>(3);
  let [puzzleIndex, setPuzzleIndex] = React.useState<number>(0);
  let currentPuzzles = (puzzles as { [size: string]: Puzzle[] })[puzzleSize.toString()];
  let puzzle = currentPuzzles && currentPuzzles[puzzleIndex];
  let tiles = puzzle && new Array(puzzle.size).fill(0).map((_, i) => i + 1);
  let [cages, setCages] = React.useState<Cage[]>(puzzle ? parseCages(puzzle) : []);
  let [grid, setGrid] = React.useState<CellState[]>(puzzle ? initialGrid(puzzle) : []);
  let [complete, setComplete] = React.useState<boolean>(false);
  let [dirty, setDirty] = React.useState<boolean>(false);
  let empty = gridEmpty(grid);

  React.useEffect(() => {
    if (currentPuzzles && puzzle) {
      setCages(parseCages(puzzle));
      setGrid(initialGrid(puzzle));
      setComplete(false);
      setDirty(false);
    }
  }, [currentPuzzles, puzzle]);

  React.useEffect(() => {
    if (grid.length && (gridFull(grid) || complete)) {
      setComplete(gridValid(grid.map((cell) => cell.value as number)));
    }
  }, [grid, complete]);

  function handleDrop(index: number) {
    return (item: Item | null) => {
      if (!dirty) {
        setDirty(true);
      }

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
    setDirty(false);
  }

  function selectPuzzle(size: number) {
    setPuzzleSize(size);
    setPuzzleIndex(0);
    setGrid([]);
    setComplete(false);
    setDirty(false);
  }

  function nextPuzzle() {
    setPuzzleIndex((index) => (index < currentPuzzles.length - 1 ? index + 1 : 0));
  }

  function renderPuzzle() {
    if (!puzzle || !grid.length) {
      return null;
    }

    return (
      <React.Fragment>
        <GridHeader complete={complete} resetGrid={resetGrid} nextPuzzle={nextPuzzle} />
        <Puzzle orientation={orientation}>
          <DndProvider backend={isTouchEnabled() ? TouchBackend : HTML5Backend}>
            <Grid size={puzzle.size}>
              {grid.map((cell, i) => (
                <Cell
                  key={i}
                  orientation={orientation}
                  size={puzzle.size}
                  borderBottom={cell.borderBottom}
                  borderRight={cell.borderRight}
                >
                  {cell.badge && <Badge valid={cell.valid}>{cell.badge}</Badge>}
                  <Target
                    index={i}
                    handleDrop={handleDrop(i)}
                    handleDragStart={handleDragStart(i)}
                    animate={(empty && !dirty) || complete}
                  >
                    {cell.value}
                  </Target>
                </Cell>
              ))}
            </Grid>
            <TilesCont orientation={orientation}>
              {tiles.map((label, i) => (
                <Tile key={i} orientation={orientation} size={puzzle.size}>
                  {label}
                </Tile>
              ))}
            </TilesCont>
            {isTouchEnabled() && <TilePreview orientation={orientation} size={puzzle.size} />}
          </DndProvider>
        </Puzzle>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <AppHeader sizes={puzzleSizes} size={puzzleSize} selectPuzzle={selectPuzzle} />
      <AppContent size={puzzleSize}>{renderPuzzle()}</AppContent>
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

function gridEmpty(grid: CellState[]) {
  for (let cell of grid) {
    if (cell.value !== null) {
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
