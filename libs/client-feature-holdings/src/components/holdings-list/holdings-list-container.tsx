import { Tabs } from '@adg/client-components';

export const HoldingsListContainer: React.FC = () => {
  const tabData = [
    {
      id: 'tab1',
      label: 'Overview',
      content: <div>Overview content here</div>,
    },
    {
      id: 'tab2',
      label: 'Performance',
      content: <div>Performance content here</div>,
    },
    {
      id: 'tab3',
      label: 'Fundamentals',
      content: <div>Fundamentals content here</div>,
    },
  ];
  return <Tabs tabs={tabData} />;
};
