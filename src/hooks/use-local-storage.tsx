import React from 'react';

export function useLocalStorage<TValue = string>(
  key: string,
  defaultValue: TValue
): [TValue, (newValue: TValue) => void] {
  const [value, setValue] = React.useState<TValue>(
    window.localStorage.getItem(key) === null
      ? defaultValue
      : JSON.parse(window.localStorage.getItem(key)!)
  );

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
