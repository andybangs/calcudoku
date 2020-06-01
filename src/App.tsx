import React from 'react';
import styled from 'styled-components';
import buildGrid, { GridCell } from './build-grid';
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
}

export default function App() {
  let puzzle = puzzles[0];
  let initialGrid = buildGrid(puzzle).map((cell) => ({ ...cell, value: null }));
  let [grid, setGrid] = React.useState<CellState[]>(initialGrid);

  function setVal(index: number) {
    return () => {
      let input = window.prompt();
      let value = input ? parseInt(input, 10) : null;

      if (value === null || (value > 0 && value <= puzzle.size)) {
        setGrid(grid.map((cell, i) => (i === index ? { ...cell, value } : cell)));
      }
    };
  }

  function resetGrid() {
    setGrid(initialGrid);
  }

  return (
    <React.Fragment>
      <AppHeader resetGrid={resetGrid} />
      <Grid size={puzzle.size}>
        {grid.map((cell, i) => (
          <Cell key={i} size={puzzle.size} onClick={setVal(i)} {...cell} />
        ))}
      </Grid>
    </React.Fragment>
  );
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

let Badge = styled.span`
  position: absolute;
  top: -0.5em;
  left: -0.5em;
  min-width: 1.2em;
  text-align: center;
  padding: 0.2em;
  background-color: white;
  filter: drop-shadow(rgba(0, 0, 0, 0.25) 0px 3px 4px);
  border: solid rgb(51, 51, 51) 2px;
  border-radius: 1.5em;
`;

let Target = styled.span`
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

  &:hover {
    width: ${({ children }) => !children && '85%'};
    height: ${({ children }) => !children && '85%'};
    border-color: rgb(3, 155, 229);
  }
`;

interface CellProps extends CellState {
  size: number;
  onClick(event: React.MouseEvent): void;
}

function Cell({ badge, value, onClick, ...rest }: CellProps) {
  return (
    <CellCont {...rest}>
      {badge && <Badge>{badge}</Badge>}
      <Target onClick={onClick}>{value}</Target>
    </CellCont>
  );
}

// ---------
// HEADER
// ---------

let Header = styled.header`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.75em;
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
  resetGrid(): void;
}

function AppHeader({ resetGrid }: AppHeaderProps) {
  return (
    <Header>
      <Button onClick={resetGrid}>
        Reset <Icon src={reset} alt="" />
      </Button>
    </Header>
  );
}
