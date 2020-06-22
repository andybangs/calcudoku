import React from 'react';

export function useOrientation(initialState: number = 0) {
  const [state, setState] = React.useState(initialState);

  React.useEffect(() => {
    function onChange() {
      if (typeof window.orientation === 'number') {
        setState(window.orientation);
      } else if (typeof window.orientation === 'string') {
        setState(parseInt(window.orientation, 10));
      } else {
        setState(initialState);
      }
    }

    window.addEventListener('orientationchange', onChange);
    onChange();

    return () => {
      window.removeEventListener('orientationchange', onChange);
    };
  }, [initialState]);

  return state;
}
