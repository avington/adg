import React from 'react';
import { RenderWhen } from '../misc';

export interface LoadingOverlayProps {
  isLoading: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
}) => (
  <RenderWhen>
    <RenderWhen.If isTrue={isLoading}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'color-mix(in srgb, var(--grey-color-200) 50%, transparent)',
          zIndex: 9999,
          width: '100%',
          height: '100%',
        }}
      >
        <svg
          width="60"
          height="60"
          viewBox="0 0 100 100"
          style={{ display: 'block' }}
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#1976d2"
            strokeWidth="8"
            fill="none"
            strokeDasharray="62.8 62.8"
            strokeLinecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    </RenderWhen.If>
  </RenderWhen>
);

export default LoadingOverlay;
