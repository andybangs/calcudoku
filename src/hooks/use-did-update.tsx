import React from 'react';

export function useDidUpdate(effect: React.EffectCallback, deps: React.DependencyList) {
  const didMountRef = React.useRef(false);

  React.useEffect(() => {
    if (didMountRef.current) effect();
    else didMountRef.current = true;
  }, deps);
}
