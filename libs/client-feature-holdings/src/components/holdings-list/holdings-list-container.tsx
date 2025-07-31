import { Tabs } from '@adg/client-components';
import { HoldingsOverviewContainer } from './holdings-overview-tab/holdings-overview-container';
import { HoldingFundamentalsContainer } from './holdings-fundamentals-tab/holdings-fundamentals-container';
import { HoldingsPerformanceContainer } from './holdings-performance-tab/holdings-performance-container';

export const HoldingsListContainer: React.FC = () => {
  const tabData = [
    {
      id: 'tab1',
      label: 'Overview',
      content: <HoldingsOverviewContainer />,
    },
    {
      id: 'tab2',
      label: 'Performance',
      content: <HoldingsPerformanceContainer />,
    },
    {
      id: 'tab3',
      label: 'Fundamentals',
      content: <HoldingFundamentalsContainer />,
    },
  ];
  return <Tabs tabs={tabData} />;
};
