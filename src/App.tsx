import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { buildGrid, parseCages, cageValid, gridValid, GridCell } from './util';
import puzzles from './puzzles';
import reset from './reset.svg';

// ---------
// APP
// ---------

let Grid = styled.div<{ size: number }>`
  width: ${({ size }) => size * 100}px;
  height: ${({ size }) => size * 100}px;
  max-width: 90vw;
  max-height: 90vw;
  border: solid rgb(119, 119, 119) 1px;
  border-radius: 20px;
  display: grid;
  grid-template-columns: repeat(${({ size }) => size}, 1fr);
`;

interface CellState extends GridCell {
  value: number | null;
  valid?: boolean;
}

let puzzle = puzzles[0];
let cages = parseCages(puzzle);
let initialGrid = buildGrid(puzzle).map((cell) => ({ ...cell, value: null, valid: false }));

export default function App() {
  let [grid, setGrid] = React.useState<CellState[]>(initialGrid);
  let [complete, setComplete] = React.useState<boolean>(false);

  function setVal(index: number) {
    return () => {
      let input = window.prompt();
      let value = input ? parseInt(input, 10) : null;

      if (value === null || (value > 0 && value <= puzzle.size)) {
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
      }
    };
  }

  function resetGrid() {
    setGrid(initialGrid);
    setComplete(false);
  }

  return (
    <React.Fragment>
      <AppHeader complete={complete} resetGrid={resetGrid} />
      <Grid size={puzzle.size}>
        {grid.map((cell, i) => (
          <Cell
            key={i}
            index={i}
            complete={complete}
            size={puzzle.size}
            onClick={setVal(i)}
            {...cell}
          />
        ))}
      </Grid>
    </React.Fragment>
  );
}

function gridFull(grid: CellState[]) {
  grid.forEach((cell) => {
    if (cell.value === null) {
      return false;
    }
  });

  return true;
}

// ---------
// CELL
// ---------

let CellCont = styled.div<{ borderRight: boolean; borderBottom: boolean; size: number }>`
  position: relative;
  box-sizing: border-box;
  width: 100px;
  height: 100px;
  max-width: ${({ size }) => 90 / size}vw;
  max-height: ${({ size }) => 90 / size}vw;
  border: solid rgb(119, 119, 119) 0;
  border-right-width: ${({ borderRight }) => (borderRight ? '1px' : 0)};
  border-bottom-width: ${({ borderBottom }) => (borderBottom ? '1px' : 0)};
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

let Badge = styled.span<{ valid?: boolean }>`
  position: absolute;
  top: -0.5em;
  left: -0.5em;
  min-width: 1.2em;
  text-align: center;
  padding: 0.2em;
  color: ${({ valid }) => (valid ? '#fff' : 'rgb(51, 51, 51)')};
  background-color: ${({ valid }) => (valid ? 'rgb(3, 155, 229)' : '#fff')};
  filter: drop-shadow(rgba(0, 0, 0, 0.25) 0px 3px 4px);
  border-color: ${({ valid }) => (valid ? 'rgb(3, 155, 229)' : 'rgb(51, 51, 51)')};
  border-style: solid;
  border-width: 2px;
  border-radius: 1.5em;
  z-index: 1;
`;

let targetScale = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

let Target = styled.span<{ complete: boolean; index: number }>`
  width: 75%;
  height: 75%;
  font-weight: 700;
  background-color: ${({ children }) => children && 'rgb(235, 247, 253)'};
  border: ${({ children }) =>
    children ? 'solid rgb(3, 155, 229) 2px' : 'dashed rgb(187, 187, 187) 2px'};
  border-radius: 12px;
  cursor: ${({ children }) => (children ? 'grab' : 'default')};
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${({ complete, index }) =>
    complete && css`${targetScale} 500ms linear 1 ${index * 50}ms`};

  &:hover {
    width: ${({ children }) => !children && '85%'};
    height: ${({ children }) => !children && '85%'};
    border-color: rgb(3, 155, 229);
  }
`;

interface CellProps extends CellState {
  index: number;
  complete: boolean;
  size: number;
  onClick(event: React.MouseEvent): void;
}

function Cell(props: CellProps) {
  return (
    <CellCont size={props.size} borderBottom={props.borderBottom} borderRight={props.borderRight}>
      {props.badge && <Badge valid={props.valid}>{props.badge}</Badge>}
      <Target index={props.index} complete={props.complete} onClick={props.onClick}>
        {props.value}
      </Target>
    </CellCont>
  );
}

// ---------
// HEADER
// ---------

let Header = styled.header`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  height: 1.5em;
  margin-bottom: 0.5em;
`;

let textOpacity = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

let Text = styled.p`
  margin: 0;
  font-weight: 500;
  animation: ${textOpacity} 750ms linear;
`;

let Button = styled.button`
  display: flex;
  align-items: center;
  padding: 0;
  border: 0;
  outline: none;
  font: inherit;
  font-weight: 500;
  cursor: pointer;
  color: #000;
  opacity: 0.5;
  transition: opacity 100ms linear;

  &:hover {
    opacity: 0.8;
  }
`;

let Icon = styled.img`
  width: 1em;
  margin-left: 0.25em;
`;

interface AppHeaderProps {
  complete: boolean;
  resetGrid(): void;
}

function AppHeader({ complete, resetGrid }: AppHeaderProps) {
  return (
    <Header>
      <Button onClick={resetGrid}>
        Reset <Icon src={reset} alt="" />
      </Button>
      {complete && (
        <Text>
          <span role="img" aria-label="Congratulations!">
            🎊
          </span>{' '}
          You got it!
        </Text>
      )}
    </Header>
  );
}
