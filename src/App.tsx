import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { AppHeader } from './components/AppHeader';
import { GridHeader } from './components/GridHeader';
import { AppContent, Puzzle, Grid, Cell, Badge, TilesCont } from './components/Styled';
import { Target } from './components/Target';
import { Tile, TilePreview } from './components/Tile';
import { useDidUpdate } from './hooks/use-did-update';
import { useLocalStorage } from './hooks/use-local-storage';
import { useOrientation } from './hooks/use-orientation';
import { buildGrid, parseCages, cageValid, gridValid, Cage, GridCell, randomInt } from './util';
import puzzles from './puzzles.json';
import { themes } from './themes';

let GlobalStyle = createGlobalStyle<any>`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.textPrimary};
  }
`;

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

  let [themeIndex, setThemeIndex] = useLocalStorage<number>('cdk-themeIndex', 0);
  let theme = themes[themeIndex];

  let [puzzleSize, setPuzzleSize] = useLocalStorage<number>('cdk-puzzleSize', 3);
  let [puzzleIndex, setPuzzleIndex] = useLocalStorage<number>('cdk-puzzleIndex', 0);
  let currentPuzzles = (puzzles as { [size: string]: Puzzle[] })[puzzleSize.toString()];
  let puzzle = currentPuzzles && currentPuzzles[puzzleIndex];
  let tiles = puzzle && new Array(puzzle.size).fill(0).map((_, i) => i + 1);
  let [cages, setCages] = useLocalStorage<Cage[]>('cdk-cages', puzzle ? parseCages(puzzle) : []);
  let [grid, setGrid] = useLocalStorage<CellState[]>('cdk-grid', puzzle ? initialGrid(puzzle) : []);
  let [complete, setComplete] = useLocalStorage<boolean>('cdk-complete', false);
  let [dirty, setDirty] = useLocalStorage<boolean>('cdk-dirty', false);
  let empty = gridEmpty(grid);

  useDidUpdate(() => {
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
  }, [grid, complete, setComplete]);

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
    setPuzzleIndex(randomInt(0, currentPuzzles.length));
    setGrid([]);
    setComplete(false);
    setDirty(false);
  }

  function nextPuzzle() {
    let newIndex = puzzleIndex;

    while (newIndex === puzzleIndex) {
      newIndex = randomInt(0, currentPuzzles.length);
    }

    setPuzzleIndex(newIndex);
  }

  function renderPuzzle() {
    if (!puzzle || !grid.length) {
      return null;
    }

    return (
      <React.Fragment>
        <GridHeader
          complete={complete}
          resetGrid={resetGrid}
          nextPuzzle={nextPuzzle}
          refreshIcon={theme.icons.refresh}
        />
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
    <ThemeProvider theme={theme.styles}>
      <GlobalStyle />
      <AppHeader
        sizes={puzzleSizes}
        size={puzzleSize}
        selectPuzzle={selectPuzzle}
        themeIndex={themeIndex}
        setThemeIndex={setThemeIndex}
        closeIcon={theme.icons.close}
        menuIcon={theme.icons.menu}
      />
      <AppContent size={puzzleSize}>{renderPuzzle()}</AppContent>
    </ThemeProvider>
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
