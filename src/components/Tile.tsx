import React from 'react';
import { useDrag, useDragLayer } from 'react-dnd';
import styled from 'styled-components';
import { DRAGGABLE_TYPE } from '../App';

let TileCont = styled.div<{ size: number }>`
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
  filter: drop-shadow(rgba(0, 0, 0, 0.25) 0px 3px 4px);
`;

interface TileProps {
  children: number;
  size: number;
}

export function Tile({ children, size }: TileProps) {
  let ref = React.useRef(null);

  let [, drag] = useDrag({ item: { type: DRAGGABLE_TYPE, value: children } });

  drag(ref);

  return (
    <TileCont ref={ref} size={size}>
      {children}
    </TileCont>
  );
}

let Thumb = styled(TileCont)`
  filter: none;
  transform: rotate(-20deg);
`;

let TilePreviewCont = styled.div`
  pointer-events: none;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
`;

interface TilePreviewProps {
  size: number;
}

export function TilePreview({ size }: TilePreviewProps) {
  const { item, isDragging, sourceClientOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    sourceClientOffset: monitor.getSourceClientOffset(),
  }));

  if (!item || !isDragging || !sourceClientOffset) {
    return null;
  }

  return (
    <TilePreviewCont>
      <div style={{ transform: `translate(${sourceClientOffset.x}px, ${sourceClientOffset.y}px)` }}>
        <Thumb size={size}>{item.value}</Thumb>
      </div>
    </TilePreviewCont>
  );
}
