import React from 'react';
import styled from 'styled-components';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import { Button } from './Styled';
import info from './info-black-24dp.svg';
import '@reach/dialog/styles.css';

let AppHeaderCont = styled.header`
  width: 100%;
  padding: 0.5em 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

let AppHeaderInnerCont = styled.div`
  width: 600px;
  max-width: 90vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

let Title = styled.h1`
  margin: 0;
`;

let InfoDialogOverlay = styled(DialogOverlay)`
  z-index: 2;
`;

let InfoDialogContent = styled(DialogContent)`
  position: fixed;
  box-sizing: border-box;
  width: 100vw;
  background: #fff;
  margin: 0;
  padding: 0 1rem;
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
  reset(): void;
}

export function AppHeader({ size, reset }: AppHeaderProps) {
  let [dialogVisible, setDialogVisible] = React.useState(false);

  function toggleDialogVisible() {
    setDialogVisible((dialogVisible) => !dialogVisible);
  }

  return (
    <React.Fragment>
      <AppHeaderCont>
        <AppHeaderInnerCont>
          <Title>
            <Button onClick={reset}>Calcudoku</Button>
          </Title>
          <Button onClick={toggleDialogVisible}>
            <img src={info} alt="info" />
          </Button>
        </AppHeaderInnerCont>
      </AppHeaderCont>
      <InfoDialogOverlay isOpen={dialogVisible} onDismiss={toggleDialogVisible}>
        <InfoDialogContent aria-label="info">
          <CloseButton className="close-button" onClick={toggleDialogVisible}>
            <span aria-hidden>×</span>
          </CloseButton>
          <h2>Rules of Calcudoku</h2>
          <p>{`The objective is to fill the grid in with the digits 1 through ${
            size || 'n'
          } such that:`}</p>
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
