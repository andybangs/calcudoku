import React from 'react';
import { useDrag, useDragLayer } from 'react-dnd';
import styled from 'styled-components';
import { DRAGGABLE_TYPE } from '../App';

let TileCont = styled.div<{ orientation: number; size: number }>`
  width: 64px;
  height: 64px;
  max-width: ${({ orientation, size }) =>
    `${(90 / size) * 0.6375}${orientation === 0 ? 'vw' : 'vh'}`};
  max-height: ${({ orientation, size }) =>
    `${(90 / size) * 0.6375}${orientation === 0 ? 'vw' : 'vh'}`};
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
  orientation: number;
  size: number;
}

export function Tile({ children, orientation, size }: TileProps) {
  let ref = React.useRef(null);

  let [, drag] = useDrag({ item: { type: DRAGGABLE_TYPE, value: children } });

  drag(ref);

  return (
    <TileCont ref={ref} orientation={orientation} size={size}>
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
  orientation: number;
  size: number;
}

export function TilePreview({ orientation, size }: TilePreviewProps) {
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
        <Thumb orientation={orientation} size={size}>
          {item.value}
        </Thumb>
      </div>
    </TilePreviewCont>
  );
}
