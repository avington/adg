/* eslint-disable react/jsx-no-useless-fragment */
import * as React from 'react';

export type WhenProps = {
  children: React.ReactNode;
  isTrue?: boolean;
  limit?: number;
};

export const RenderWhen = ({
  children,
  limit = 1,
  isTrue = true,
}: WhenProps) => {
  const list: React.ReactNode[] = [];

  if (isTrue !== true) {
    return null;
  }

  React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const { isTrue: isChildTrue } =
        (child.props as { isTrue?: boolean }) || {};

      if (isChildTrue === true && list.length < (limit ?? 100)) {
        list.push(child);
      }
    }
  });

  return <>{list}</>;
};

RenderWhen.If = ({
  children,
  isTrue,
}: {
  children: React.ReactNode;
  isTrue: boolean;
}) => children;

export default RenderWhen;
