import React, { useState } from 'react';
import { config, useSpring } from 'react-spring';
import { TabButton } from './tab-buttons';
import { TabsContainer } from './tab-container';
import { TabContent } from './tab-content';
import { TabList } from './tab-list';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveTab,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(
    defaultActiveTab || tabs[0]?.id || ''
  );

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  const contentSpring = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(10px)' },
    config: config.gentle,
    // Animation will reset when activeTab changes
    key: activeTab,
  });

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <TabsContainer>
      <TabList role="tablist">
        {tabs.map((tab) => {
          const isTabActive = tab.id === activeTab;

          return (
            <TabButton
              key={tab.id}
              id={`tab-${tab.id}`}
              $isActive={isTabActive}
              onClick={() => handleTabClick(tab.id)}
              role="tab"
              aria-selected={isTabActive}
              aria-controls={`tabpanel-${tab.id}`}
            >
              {tab.label}
            </TabButton>
          );
        })}
      </TabList>

      <TabContent
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        style={contentSpring}
      >
        {activeTabContent}
      </TabContent>
    </TabsContainer>
  );
};

export default Tabs;
