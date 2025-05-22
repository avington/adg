import { act, renderHook } from '@testing-library/react';

import useBoolean from './use-boolean';

describe('useBoolean', () => {
  it('setFalse should set value to false', () => {
    const { result } = renderHook(() => useBoolean());

    act(() => {
      result.current.setFalse();
    });

    expect(result.current.value).toBe(false);
  });

  it('setTrue should set value to true', () => {
    const { result } = renderHook(() => useBoolean());

    act(() => {
      result.current.setTrue();
    });

    expect(result.current.value).toBe(true);
  });

  it('toggle from false should set value to true', () => {
    const { result } = renderHook(() => useBoolean());

    act(() => {
      result.current.setFalse();
      result.current.toggle();
    });

    expect(result.current.value).toBe(true);
  });

  it('toggle from true should set value to false', () => {
    const { result } = renderHook(() => useBoolean());

    act(() => {
      result.current.setTrue();
      result.current.toggle();
    });

    expect(result.current.value).toBe(false);
  });
});
