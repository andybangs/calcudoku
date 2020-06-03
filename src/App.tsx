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

interface CellState extends GridCell {
  value: number | null;
  valid?: boolean;
}

let initialGrid: CellState[] = grid.map((cell) => ({ ...cell, value: null, valid: false }));

export default function App() {
  let [grid, setGrid] = React.useState<CellState[]>(initialGrid);
  let [complete, setComplete] = React.useState<boolean>(false);

  function setVal(index: number) {
    return (value: number | null) => {
      let updatedGrid = grid.map((cell, i) => (i === index ? { ...cell, value } : cell));
      let cage = cages.filter((cage) => cage.cells.includes(index))[0];
      let operands: number[] = updatedGrid
        .filter((cell, i) => cage.cells.includes(i) && cell.value !== null)
        .map((cell) => cell.value as number);

      if (
        operands.length === cage.cells.length &&
        cageValid(cage.result, cage.operator, operands)
      ) {
        updatedGrid[cage.cells[0]].valid = true;
      } else {
        updatedGrid[cage.cells[0]].valid = false;
      }

      setGrid(updatedGrid);

      if (gridFull(updatedGrid)) {
        setComplete(gridValid(updatedGrid.map((cell) => cell.value as number)));
      }
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
              <Target index={i} complete={complete} handleDrop={setVal(i)}>
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
