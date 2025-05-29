import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const PortfolioView = lazy(() =>
  import('@adg/client-feature-portfolio').then((module) => ({
    default: module.PortfolioView, // Replace 'PortfolioView' with the actual exported component name if different
  }))
);

export const routerConfig = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PortfolioView />
      </Suspense>
    ),
  },
  {
    path: '/portfolio',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PortfolioView />
      </Suspense>
    ),
  },
]);
