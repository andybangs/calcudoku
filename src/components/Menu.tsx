import React from 'react';
import styled from 'styled-components';
import { Button } from './Styled';
import close from '../icons/close-black-24dp.svg';

let Overlay = styled.div<{ open: boolean }>`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: #333;
  opacity: ${({ open }) => (open ? 0.2 : 0)};
  transform: ${({ open }) => (open ? '' : 'translateX(100%)')};
  transition: ${({ open }) => (open ? 'opacity 0.2s' : 'opacity 0.2s, transform 0s 0.2s')};
  z-index: 3;
`;

let Container = styled.nav<{ open: boolean }>`
  box-sizing: border-box;
  position: fixed;
  top: 0;
  right: 0;
  background: #fff;
  width: 85%;
  height: 100%;
  text-align: left;
  padding: 2em;
  overflow-y: scroll;
  transform: ${({ open }) => (open ? '' : 'translateX(100%)')};
  transition: transform 0.3s;
  z-index: 4;
`;

let CloseButton = styled(Button)`
  position: absolute;
  top: 1em;
  right: 1em;
`;

let Title = styled.h2`
  margin: 0;
`;

let List = styled.ul`
  padding-left: 1em;
`;

let Item = styled.li`
  margin-bottom: 0.5em;
`;

let Label = styled.label`
  font-size: 1.2em;
  font-weight: 700;
`;

let Select = styled.select`
  padding: 0.25em 0.5em;
  font-size: 0.8em;
  border: solid #333 2px;
  border-radius: 12px;
  background: #fff;
  display: block;
  margin-top: 0.5em;
`;

interface MenuProps {
  sizes: number[];
  open: boolean;
  toggleMenu(): void;
  puzzleSize: number;
  selectPuzzle(size: number): void;
}

export function Menu({ sizes, open, toggleMenu, puzzleSize, selectPuzzle }: MenuProps) {
  React.useEffect(() => {
    if (open) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [open]);

  let container = React.useRef<any>();

  React.useEffect(() => {
    let listener = (ev: MouseEvent) => {
      if (!open || !container.current || container.current.contains(ev.target)) {
        return;
      }
      toggleMenu();
    };

    document.addEventListener('mousedown', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [open, container, toggleMenu]);

  return (
    <React.Fragment>
      <Overlay open={open} />
      <Container ref={container} open={open} aria-hidden={!open}>
        <CloseButton onClick={toggleMenu}>
          <img src={close} alt="close" />
        </CloseButton>
        <Title>Rules of Calcudoku</Title>
        <p>{`The objective is to fill the grid in with the digits 1 through ${puzzleSize} such that:`}</p>
        <List>
          <Item>Each row contains exactly one of each digit</Item>
          <Item>Each column contains exactly one of each digit</Item>
          <Item>
            Each outlined group of cells is a "cage" containing digits which achieve the specified
            result using the specified mathematical operation: addition (+), subtraction (−),
            multiplication (*), and division (/)
          </Item>
          <Item>
            Each cell with a single digit but no operation is simply filled with that digit
          </Item>
        </List>
        <Label>
          Puzzle Size:{' '}
          <Select
            value={puzzleSize}
            onChange={(ev) => {
              toggleMenu();
              selectPuzzle(parseInt(ev.target.value, 10));
            }}
          >
            {sizes.map((size) => (
              <option key={size} value={size}>
                {`${size}x${size}`}
              </option>
            ))}
          </Select>
        </Label>
      </Container>
    </React.Fragment>
  );
}
