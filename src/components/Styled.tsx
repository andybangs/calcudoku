import styled from 'styled-components';

export let AppContent = styled.div<{ size: number }>`
  max-width: 90vw;
  margin: 1em 0;
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
  color: ${({ theme }) => theme.textPrimary};
  background: inherit;
  transition: opacity 100ms linear;
`;

export let Puzzle = styled.div<{ orientation: number }>`
  display: flex;
  flex-direction: ${({ orientation }) => (orientation === 0 ? 'column' : 'row')};
  justify-content: center;
`;

export let Grid = styled.div<{ size: number }>`
  border-style: solid;
  border-color: ${({ theme }) => theme.gridBorderColor};
  border-width: 1px;
  border-radius: 20px;
  display: grid;
  grid-template-columns: repeat(${({ size }) => size}, 1fr);
`;

export let Cell = styled.div<{
  orientation: number;
  borderRight: boolean;
  borderBottom: boolean;
  size: number;
}>`
  position: relative;
  box-sizing: border-box;
  width: 100px;
  height: 100px;
  max-width: ${({ orientation, size }) => `${90 / size}${orientation === 0 ? 'vw' : 'vh'}`};
  max-height: ${({ orientation, size }) => `${90 / size}${orientation === 0 ? 'vw' : 'vh'}`};
  border-style: solid;
  border-color: ${({ theme }) => theme.gridBorderColor};
  border-width: 0;
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
  color: ${({ theme, valid }) => (valid ? theme.badgeColorValid : theme.textSecondary)};
  background: ${({ theme, valid }) => (valid ? theme.primary : theme.background)};
  font-weight: ${({ theme }) => theme.badgeFontWeight};
  filter: ${({ theme }) => `drop-shadow(rgba(0, 0, 0, ${theme.shadowOpacity}) 0px 3px 4px)`};
  border-color: ${({ theme, valid }) => (valid ? theme.primary : theme.textSecondary)};
  border-style: solid;
  border-width: 2px;
  border-radius: 1.5em;
  z-index: 1;
`;

export let TilesCont = styled.div<{ orientation: number }>`
  display: flex;
  flex-flow: ${({ orientation }) => (orientation === 0 ? 'row' : 'column')};
  justify-content: space-around;
  margin: ${({ orientation }) => (orientation === 0 ? '0.5em 0 0 0' : '0 0 0 0.5em')};
  padding: 1em;
`;
