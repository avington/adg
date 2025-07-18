import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSpring, animated, config } from 'react-spring';
import styled from 'styled-components';
import { KeyboardArrowDown, ChevronRight } from '@mui/icons-material';
import {
  DropdownContainer,
  DropdownMenu,
  DropdownTrigger,
} from '@adg/client-components';

// Fake portfolio data - replace with real data later
const FAKE_PORTFOLIOS = [
  { portfolioId: '1', name: 'Growth Portfolio' },
  { portfolioId: '2', name: 'Value Portfolio' },
  { portfolioId: '3', name: 'Dividend Portfolio' },
  { portfolioId: '4', name: 'Tech Stocks' },
  { portfolioId: '5', name: 'International Portfolio' },
];

const BreadcrumbContainer = styled.nav<{
  className?: string;
  'aria-label'?: string;
  children?: React.ReactNode;
}>`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-indigo-900);
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 0.5rem;
  color: #ccc;
`;

const BreadcrumbLink = styled(Link)`
  color: var(--color-indigo-900);
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: var(--color-blue-grey-900);
  text-decoration: none;
  border-bottom: 1px solid #f0f0f0;

  &:hover {
    background-color: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }

  &[aria-current='page'] {
    background-color: #e3f2fd;
    color: #1976d2;
    font-weight: 500;
  }
`;

const CurrentPortfolio = styled.span`
  color: #333;
  font-weight: 500;
`;

export interface HoldingBreadcrumbsProps {
  className?: string;
}

export const HoldingBreadcrumbs: React.FC<HoldingBreadcrumbsProps> = ({
  className,
}) => {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Find current portfolio name
  const currentPortfolio = FAKE_PORTFOLIOS.find(
    (p) => p.portfolioId === portfolioId
  );

  // Animation for dropdown
  const dropdownAnimation = useSpring({
    opacity: isDropdownOpen ? 1 : 0,
    transform: isDropdownOpen ? 'translateY(0px)' : 'translateY(-10px)',
    config: config.gentle,
  });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-dropdown]')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      if (isDropdownOpen) {
        document.removeEventListener('click', handleClickOutside);
      }
    };
  }, [isDropdownOpen]);

  return (
    <BreadcrumbContainer
      className={className}
      aria-label="Breadcrumb navigation"
    >
      {/* Root link */}
      <BreadcrumbLink to="/portfolio">Portfolios</BreadcrumbLink>

      <BreadcrumbSeparator>
        <ChevronRight fontSize="small" />
      </BreadcrumbSeparator>

      {/* Portfolio dropdown */}
      <DropdownContainer data-dropdown>
        <DropdownTrigger
          onClick={toggleDropdown}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
          aria-label="Select portfolio"
        >
          {currentPortfolio ? currentPortfolio.name : 'Select Portfolio'}
          <KeyboardArrowDown
            fontSize="small"
            style={{
              transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </DropdownTrigger>

        {isDropdownOpen && (
          <DropdownMenu style={dropdownAnimation}>
            {FAKE_PORTFOLIOS.map((portfolio) => (
              <DropdownItem
                key={portfolio.portfolioId}
                to={`/portfolio/${portfolio.portfolioId}/holdings`}
                onClick={closeDropdown}
                aria-current={
                  portfolio.portfolioId === portfolioId ? 'page' : undefined
                }
              >
                {portfolio.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        )}
      </DropdownContainer>

      {/* Current page indicator */}
      {currentPortfolio && (
        <>
          <BreadcrumbSeparator>
            <ChevronRight fontSize="small" />
          </BreadcrumbSeparator>
          <CurrentPortfolio>Holdings</CurrentPortfolio>
        </>
      )}
    </BreadcrumbContainer>
  );
};

export default HoldingBreadcrumbs;
