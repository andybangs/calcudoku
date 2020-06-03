import styled from 'styled-components';

export let Grid = styled.div<{ size: number }>`
  width: ${({ size }) => size * 100}px;
  height: ${({ size }) => size * 100}px;
  max-width: 90vw;
  max-height: 90vw;
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
  margin-top: 1.5em;
  padding: 0 1em;
`;
