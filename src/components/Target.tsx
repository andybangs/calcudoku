import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styled, { css, keyframes } from 'styled-components';
import { DRAGGABLE_TYPE, Item } from '../App';

let targetScale = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

let TargetCont = styled.span<{
  children: number | null;
  animate: boolean;
  index: number;
  isDragging: boolean;
  isOver: boolean;
}>`
  width: ${({ children, isOver }) => (!children && isOver ? '85%' : '75% ')};
  height: ${({ children, isOver }) => (!children && isOver ? '85%' : '75% ')};
  font-weight: 700;
  color: ${({ isDragging }) => isDragging && '#fff'};
  background-color: ${({ children, isDragging, isOver }) => {
    if (children && !isDragging && !isOver) return '#ebf7fd';
    if (children && !isDragging && isOver) return '#219be5';
    return 'inherit';
  }};
  border-style: ${({ children, isDragging }) => (children && !isDragging ? 'solid' : 'dashed')};
  border-color: ${({ children, isDragging, isOver }) =>
    (children && !isDragging) || isOver ? '#219be5' : '#bbb'};
  border-width: 2px;
  border-radius: 12px;
  cursor: ${({ children }) => (children ? 'grab' : 'default')};
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${({ animate, index }) =>
    animate && css`${targetScale} 500ms linear 1 ${index * 50}ms`};
`;

interface TargetProps {
  children: number | null;
  index: number;
  animate: boolean;
  handleDrop(item: Item | null): void;
  handleDragStart(): void;
}

export function Target({ children, index, animate, handleDrop, handleDragStart }: TargetProps) {
  let ref = React.useRef(null);

  let [{ isDragging }, drag] = useDrag({
    item: { id: index, type: DRAGGABLE_TYPE, value: children },
    canDrag() {
      return !!children;
    },
    begin() {
      handleDragStart();
    },
    end(_, monitor) {
      if (!monitor.didDrop()) {
        handleDrop(null);
      }
    },
    collect(monitor) {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });

  let [{ isOver }, drop] = useDrop({
    accept: DRAGGABLE_TYPE,
    drop(item: Item) {
      handleDrop(item);
    },
    collect(monitor) {
      return {
        isOver: monitor.isOver(),
      };
    },
  });

  drag(drop(ref));

  return (
    <TargetCont ref={ref} index={index} animate={animate} isDragging={isDragging} isOver={isOver}>
      {children}
    </TargetCont>
  );
}
