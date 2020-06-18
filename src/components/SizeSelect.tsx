import React from 'react';
import styled from 'styled-components';

let ButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1em;
`;

let Button = styled.button`
  padding: 1.5em;
  font-size: 1em;
  font-weight: 700;
  color: #333;
  background-color: #fff;
  border: solid #219be5 2px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(rgba(0, 0, 0, 0.25) 0px 3px 4px);
`;

interface ButtonProps {
  onClick(): void;
  puzzleSize: number;
}

function SizeButton({ onClick, puzzleSize }: ButtonProps) {
  return <Button onClick={onClick}>{`${puzzleSize}x${puzzleSize}`}</Button>;
}

interface SizeSelectProps {
  setPuzzleSize(size: string): void;
}

export function SizeSelect({ setPuzzleSize }: SizeSelectProps) {
  let puzzleSizes = [3, 4, 5, 6];

  return (
    <React.Fragment>
      <h2>Select a size:</h2>
      <ButtonsContainer>
        {puzzleSizes.map((size, i) => (
          <SizeButton key={i} puzzleSize={size} onClick={() => setPuzzleSize(size.toString())} />
        ))}
      </ButtonsContainer>
    </React.Fragment>
  );
}
