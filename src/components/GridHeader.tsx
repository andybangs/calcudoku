import React from 'react';
import styled from 'styled-components';
import { Button } from './Styled';

let GridHeaderCont = styled.div`
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

let Icon = styled.img`
  width: 1.2em;
  margin-left: 0.2em;
`;

interface GridHeaderProps {
  complete: boolean;
  resetGrid(): void;
  nextPuzzle(): void;
  refreshIcon: string;
}

export function GridHeader({ complete, resetGrid, nextPuzzle, refreshIcon }: GridHeaderProps) {
  return (
    <GridHeaderCont>
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
            Reset <Icon src={refreshIcon} alt="" />
          </Button>
        </React.Fragment>
      )}
    </GridHeaderCont>
  );
}
