import React from 'react';
import { DndProvider, useDrag, useDrop, useDragLayer } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import styled, { css, keyframes } from 'styled-components';
import { buildGrid, parseCages, cageValid, gridValid, GridCell } from './util';
import puzzles from './puzzles';
import reset from './reset.svg';

// ---------
// DRAG LAYER
// ---------

let TilePreview = styled.div<{ size: number }>`
  width: 64px;
  height: 64px;
  max-width: ${({ size }) => (90 / size) * 0.6375}vw;
  max-height: ${({ size }) => (90 / size) * 0.6375}vw;
  font-weight: 700;
  background-color: #fff;
  border: solid #219be5 2px;
  border-radius: 12px;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-20deg);
`;

let DragLayerCont = styled.div`
  pointer-events: none;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

interface DragLayerProps {
  size: number;
}

function DragLayer({ size }: DragLayerProps) {
  const { item, isDragging, sourceClientOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    sourceClientOffset: monitor.getSourceClientOffset(),
  }));

  if (!item || !isDragging || !sourceClientOffset) {
    return null;
  }

  return (
    <DragLayerCont>
      <div style={{ transform: `translate(${sourceClientOffset.x}px, ${sourceClientOffset.y}px)` }}>
        <TilePreview size={size}>{item.value}</TilePreview>
      </div>
    </DragLayerCont>
  );
}

// ---------
// APP
// ---------

let Grid = styled.div<{ size: number }>`
  width: ${({ size }) => size * 100}px;
  height: ${({ size }) => size * 100}px;
  max-width: 90vw;
  max-height: 90vw;
  border: solid #777 1px;
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
      <AppHeader complete={complete} resetGrid={resetGrid} />
      <DndProvider backend={'ontouchstart' in window ? TouchBackend : HTML5Backend}>
        <Grid size={puzzle.size}>
          {grid.map((cell, i) => (
            <Cell
              key={i}
              index={i}
              complete={complete}
              size={puzzle.size}
              handleDrop={setVal(i)}
              {...cell}
            />
          ))}
        </Grid>
        <Tiles size={puzzle.size} />
        {'ontouchstart' in window && <DragLayer size={puzzle.size} />}
      </DndProvider>
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
  border: solid #777 0;
  border-right-width: ${({ borderRight }) => (borderRight ? '1px' : 0)};
  border-bottom-width: ${({ borderBottom }) => (borderBottom ? '1px' : 0)};
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
  color: ${({ valid }) => (valid ? '#fff' : '#333')};
  background-color: ${({ valid }) => (valid ? '#219be5' : '#fff')};
  filter: drop-shadow(rgba(0, 0, 0, 0.25) 0px 3px 4px);
  border-color: ${({ valid }) => (valid ? '#219be5' : '#333')};
  border-style: solid;
  border-width: 2px;
  border-radius: 1.5em;
  z-index: 1;
`;

interface CellProps extends CellState {
  index: number;
  complete: boolean;
  size: number;
  handleDrop(value: number | null): void;
}

function Cell(props: CellProps) {
  return (
    <CellCont size={props.size} borderBottom={props.borderBottom} borderRight={props.borderRight}>
      {props.badge && <Badge valid={props.valid}>{props.badge}</Badge>}
      <Target index={props.index} complete={props.complete} handleDrop={props.handleDrop}>
        {props.value}
      </Target>
    </CellCont>
  );
}

let targetScale = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

let TargetCont = styled.span<{
  children: number | null;
  complete: boolean;
  index: number;
  isOver: boolean;
}>`
  width: ${({ children, isOver }) => (!children && isOver ? '85%' : '75% ')};
  height: ${({ children, isOver }) => (!children && isOver ? '85%' : '75% ')};
  font-weight: 700;
  background-color: ${({ children, isOver }) => {
    if (children && !isOver) return '#ebf7fd';
    if (children && isOver) return '#219be5';
    return 'inherit';
  }};
  border-style: ${({ children }) => (children ? 'solid' : 'dashed')};
  border-color: ${({ children, isOver }) => (children || isOver ? '#219be5' : '#bbb')};
  border-width: 2px;
  border-radius: 12px;
  cursor: ${({ children }) => (children ? 'grab' : 'default')};
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${({ complete, index }) =>
    complete && css`${targetScale} 500ms linear 1 ${index * 50}ms`};
`;

interface TargetProps {
  children: number | null;
  index: number;
  complete: boolean;
  handleDrop(value: number | null): void;
}

function Target({ children, index, complete, handleDrop }: TargetProps) {
  let ref = React.useRef(null);

  let [{ isDragging }, drag] = useDrag({
    item: { type: 'Tile', value: children },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  let [{ isOver }, drop] = useDrop({
    accept: 'Tile',
    drop(item: any) {
      handleDrop(item.value);
    },
    collect(monitor) {
      return {
        isOver: monitor.isOver(),
      };
    },
  });

  drag(drop(ref));

  React.useEffect(() => {
    if (isDragging && children) {
      handleDrop(null);
    }
  });

  return (
    <TargetCont ref={ref} index={index} complete={complete} isOver={isOver}>
      {children}
    </TargetCont>
  );
}

// ---------
// TILES
// ---------

let TileCont = styled(TilePreview)`
  filter: drop-shadow(rgba(0, 0, 0, 0.25) 0px 3px 4px);
  transform: none;
`;

interface TileProps {
  children: number;
  size: number;
}

function Tile({ children, size }: TileProps) {
  let ref = React.useRef(null);

  let [, drag] = useDrag({
    item: { type: 'Tile', value: children },
  });

  drag(ref);

  return (
    <TileCont ref={ref} size={size}>
      {children}
    </TileCont>
  );
}

let TilesCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 1.5em;
  padding: 0 1em;
`;

interface TilesProps {
  size: number;
}

function Tiles({ size }: TilesProps) {
  let labels = new Array(size).fill(0).map((_, i) => i + 1);

  return (
    <TilesCont>
      {labels.map((label, i) => (
        <Tile key={i} size={size}>
          {label}
        </Tile>
      ))}
    </TilesCont>
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
  margin-bottom: 1em;
`;

let Text = styled.p`
  margin: 0;
  font-size: 0.9em;
  font-weight: 500;
`;

let Button = styled.button`
  display: flex;
  align-items: center;
  padding: 0;
  border: 0;
  outline: none;
  font: inherit;
  font-size: 0.9em;
  font-weight: 500;
  cursor: pointer;
  color: #000;
  background-color: inherit;
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
      {complete ? (
        <Text>
          <span role="img" aria-label="Congratulations!">
            🎊
          </span>{' '}
          You got it!
        </Text>
      ) : (
        <Text>Drag the tiles into the grid</Text>
      )}
    </Header>
  );
}
