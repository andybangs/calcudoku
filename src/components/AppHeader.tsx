import React from 'react';
import styled from 'styled-components';
import { Menu } from './Menu';
import { Button } from './Styled';

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
  themeIndex: number;
  setThemeIndex(index: number): void;
  closeIcon: string;
  menuIcon: string;
}

export function AppHeader({
  sizes,
  size,
  selectPuzzle,
  themeIndex,
  setThemeIndex,
  closeIcon,
  menuIcon,
}: AppHeaderProps) {
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
            <img src={menuIcon} alt="menu" />
          </Button>
        </AppHeaderInnerCont>
      </AppHeaderCont>
      <Menu
        sizes={sizes}
        open={menuOpen}
        toggleMenu={toggleMenuOpen}
        puzzleSize={size}
        selectPuzzle={selectPuzzle}
        themeIndex={themeIndex}
        setThemeIndex={setThemeIndex}
        closeIcon={closeIcon}
      />
    </React.Fragment>
  );
}
