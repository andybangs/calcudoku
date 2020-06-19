import styled from 'styled-components';

export let AppContent = styled.div<{ size: number }>`
  width: ${({ size }) => size * 100}px;
  max-width: 90vw;
`;

export let Button = styled.button`
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

export let Grid = styled.div<{ size: number }>`
  border: solid #777 1px;
  border-radius: 20px;
  display: grid;
  grid-template-columns: repeat(${({ size }) => size}, 1fr);
`;

export let Cell = styled.div<{ borderRight: boolean; borderBottom: boolean; size: number }>`
  position: relative;
  box-sizing: border-box;
  width: 100px;
  height: 100px;
  max-width: ${({ size }) => 90 / size}vw;
  max-height: ${({ size }) => 90 / size}vw;
  border: solid #777 0;
  border-right-width: ${({ borderRight }) => (borderRight ? '1px' : 0)};
  border-bottom-width: ${({ borderBottom }) => (borderBottom ? '1px' : 0)};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export let Badge = styled.span<{ valid?: boolean }>`
  position: absolute;
  top: -0.5em;
  left: -0.5em;
  min-width: 1.2em;
  text-align: center;
  padding: 0.2em;
  color: ${({ valid }) => (valid ? '#fff' : '#333')};
  background-color: ${({ valid }) => (valid ? '#219be5' : '#fff')};
  filter: drop-shadow(rgba(0, 0, 0, 0.25) 0px 3px 4px);
  border-color: ${({ valid }) => (valid ? '#219be5' : '#333')};
  border-style: solid;
  border-width: 2px;
  border-radius: 1.5em;
  z-index: 1;
`;

export let Tiles = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 0.5em;
  padding: 1em;
`;
