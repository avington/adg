import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const PortfolioView = lazy(() =>
  import('@adg/client-feature-portfolio').then((module) => ({
    default: module.PortfolioView, // Replace 'PortfolioView' with the actual exported component name if different
  }))
);

const PortfolioItemView = lazy(() =>
  import('@adg/client-feature-portfolio').then((module) => ({
    default: module.PortfolioItemView, // Replace 'PortfolioItemView' with the actual exported component name if different
  }))
);

const HoldingsListView = lazy(() =>
  import('@adg/client-feature-holdings').then((module) => ({
    default: module.HoldingsListView, // Replace 'HoldingsListView' with the actual exported component name if different
  }))
);

const HoldingItemView = lazy(() =>
  import('@adg/client-feature-holdings').then((module) => ({
    default: module.HoldingItemView, // Replace 'HoldingItemView' with the actual exported component name if different
  }))
);

const LotsListView = lazy(() =>
  import('@adg/client-feature-lots').then((module) => ({
    default: module.LotsListView, // Replace 'LotsListView' with the actual exported component name if different
  }))
);

const LotItemView = lazy(() =>
  import('@adg/client-feature-lots').then((module) => ({
    default: module.LotItemView, // Replace 'LotItemView' with the actual exported component name if different
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
    path: '/portfolio/:portfolioId/holdings/:symbol/lots/:lotId',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LotItemView />
      </Suspense>
    ),
  },
  {
    path: '/portfolio/:portfolioId/holdings/:symbol/lots',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LotsListView />
      </Suspense>
    ),
  },
  {
    path: '/portfolio/:portfolioId/holdings/:symbol',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <HoldingItemView />
      </Suspense>
    ),
  },
  {
    path: '/portfolio/:portfolioId/holdings',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <HoldingsListView />
      </Suspense>
    ),
  },
  {
    path: '/portfolio/:portfolioId',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PortfolioItemView />
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
