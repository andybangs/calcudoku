import React from 'react';
import styled from 'styled-components';
import reset from './reset.svg';

let HeaderCont = styled.header`
  display: flex;
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

interface HeaderProps {
  complete: boolean;
  resetGrid(): void;
  nextPuzzle(): void;
}

export function Header({ complete, resetGrid, nextPuzzle }: HeaderProps) {
  return (
    <HeaderCont>
      {complete ? (
        <React.Fragment>
          <Text>
            <span role="img" aria-label="Congratulations!">
              🎊
            </span>{' '}
            You got it!
          </Text>
          <Button onClick={nextPuzzle}>Try another!</Button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Text>Drag the tiles into the grid</Text>
          <Button onClick={resetGrid}>
            Reset <Icon src={reset} alt="" />
          </Button>
        </React.Fragment>
      )}
    </HeaderCont>
  );
}
