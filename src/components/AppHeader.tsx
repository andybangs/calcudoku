import React from 'react';
import styled from 'styled-components';
import { Menu } from './Menu';
import { Button } from './Styled';
import menu from '../icons/menu-black-24dp.svg';

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

interface AppHeaderProps {
  sizes: number[];
  size: number;
  selectPuzzle(size: number): void;
}

export function AppHeader({ sizes, size, selectPuzzle }: AppHeaderProps) {
  let [menuOpen, setMenuOpen] = React.useState(false);

  function toggleMenuOpen() {
    setMenuOpen((menuOpen) => !menuOpen);
  }

  return (
    <React.Fragment>
      <AppHeaderCont>
        <AppHeaderInnerCont>
          <Title>Calcudoku</Title>
          <Button onClick={toggleMenuOpen}>
            <img src={menu} alt="menu" />
          </Button>
        </AppHeaderInnerCont>
      </AppHeaderCont>
      <Menu
        sizes={sizes}
        open={menuOpen}
        toggleMenu={toggleMenuOpen}
        puzzleSize={size}
        selectPuzzle={selectPuzzle}
      />
    </React.Fragment>
  );
}
