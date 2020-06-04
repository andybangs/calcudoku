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
  handleDrop(item: Item | null): void;
}

export function Target({ children, index, complete, handleDrop }: TargetProps) {
  let ref = React.useRef(null);

  let [, drag] = useDrag({
    item: { id: index, type: DRAGGABLE_TYPE, value: children },
    end(_, monitor) {
      if (!monitor.didDrop()) {
        handleDrop(null);
      }
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
    <TargetCont ref={ref} index={index} complete={complete} isOver={isOver}>
      {children}
    </TargetCont>
  );
}
