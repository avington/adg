import { useState, useCallback, Dispatch, SetStateAction } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseBooleanReturn {
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
}

/**
 * @description A simple abstraction to play with a boolean, don't repeat yourself.
 * @param defaultValue optional option to set the default value to true or false
 * @returns setTrue, setFalse, toggle functions and the value is current or false
 */
export function useBoolean(defaultValue?: boolean): UseBooleanReturn {
  const [value, setValue] = useState(!!defaultValue);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((x) => !x), []);

  return { value, setValue, setTrue, setFalse, toggle };
}

export default useBoolean;
