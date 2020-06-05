import React from 'react';
import styled from 'styled-components';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import { Button } from './Styled';
import info from './info-24px.svg';
import '@reach/dialog/styles.css';

let AppHeaderCont = styled.div`
  margin-top: 1em;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

let Title = styled.h1`
  margin: 0;
`;

let InfoDialogOverlay = styled(DialogOverlay)`
  z-index: 2;
`;

let InfoDialogContent = styled(DialogContent)`
  box-sizing: border-box;
  width: 100vw;
  margin: 0;
  background: white;
  padding: 1rem;
`;

let CloseButton = styled(Button)`
  float: right;
  font-size: 2em;
`;

let List = styled.ul`
  padding-left: 2em;
`;

interface AppHeaderProps {
  size: number;
}

export function AppHeader({ size }: AppHeaderProps) {
  let [dialogVisible, setDialogVisible] = React.useState(false);

  function toggleDialogVisible() {
    setDialogVisible((dialogVisible) => !dialogVisible);
  }

  return (
    <React.Fragment>
      <AppHeaderCont>
        <Title>Calcudoku</Title>
        <Button onClick={toggleDialogVisible}>
          <img src={info} alt="info" />
        </Button>
      </AppHeaderCont>
      <InfoDialogOverlay isOpen={dialogVisible} onDismiss={toggleDialogVisible} aria-label="info">
        <InfoDialogContent>
          <CloseButton className="close-button" onClick={toggleDialogVisible}>
            <span aria-hidden>×</span>
          </CloseButton>
          <h2>Rules of Calcudoku</h2>
          <p>{`The objective is to fill the grid in with the digits 1 through ${size} such that:`}</p>
          <List>
            <li>Each row contains exactly one of each digit</li>
            <li>Each column contains exactly one of each digit</li>
            <li>
              Each outlined group of cells is a "cage" containing digits which achieve the specified
              result using the specified mathematical operation: addition (+), subtraction (−),
              multiplication (*), and division (/)
            </li>
            <li>Each cell with a single digit but no operation is simply filled with that digit</li>
          </List>
        </InfoDialogContent>
      </InfoDialogOverlay>
    </React.Fragment>
  );
}
