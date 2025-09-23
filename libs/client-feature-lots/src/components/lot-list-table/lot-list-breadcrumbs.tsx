import React from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { LoadingOverlay } from '@adg/client-components';
import { useAllPortfolios } from '@adg/client-graphql-data';

const BreadcrumbContainer = styled.nav`
  position: relative;
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

const CurrentCrumb = styled.span`
  color: var(--color-blue-grey-900);
  font-weight: 700;
`;

export interface LotListBreadcrumbsProps {
  className?: string;
}

export const LotListBreadcrumbs: React.FC<LotListBreadcrumbsProps> = ({
  className,
}) => {
  const { portfolioId, symbol } = useParams<{
    portfolioId: string;
    symbol: string;
  }>();
  const { loading, error, data } = useAllPortfolios();

  type PortfolioItem = { portfolioId?: string; name?: string };
  const portfolioName = React.useMemo(() => {
    if (!data?.portfolios || !portfolioId) return portfolioId ?? '';
    const p = (data.portfolios as PortfolioItem[]).find(
      (x) => x.portfolioId === portfolioId
    );
    return p?.name || portfolioId;
  }, [data, portfolioId]);

  if (error?.message) {
    // Non-fatal; just log and fall back to IDs
    console.error('Error fetching portfolios for breadcrumbs:', error.message);
  }

  return (
    <BreadcrumbContainer
      className={className}
      aria-label="Breadcrumb navigation"
    >
      {loading && <LoadingOverlay isLoading />}

      <BreadcrumbLink to="/portfolio">Portfolios</BreadcrumbLink>
      <BreadcrumbSeparator>
        <ChevronRight fontSize="small" />
      </BreadcrumbSeparator>

      {portfolioId ? (
        <BreadcrumbLink
          to={`/portfolio/${portfolioId}/holdings`}
          aria-label="Portfolio holdings"
        >
          {portfolioName}
        </BreadcrumbLink>
      ) : (
        <CurrentCrumb>Portfolio</CurrentCrumb>
      )}

      <BreadcrumbSeparator>
        <ChevronRight fontSize="small" />
      </BreadcrumbSeparator>

      {portfolioId && symbol ? (
        <BreadcrumbLink
          to={`/portfolio/${portfolioId}/holdings/${symbol}`}
          aria-label="Holding"
        >
          {symbol?.toUpperCase()}
        </BreadcrumbLink>
      ) : (
        <CurrentCrumb>Holding</CurrentCrumb>
      )}

      <BreadcrumbSeparator>
        <ChevronRight fontSize="small" />
      </BreadcrumbSeparator>

      <CurrentCrumb aria-current="page">Lots</CurrentCrumb>
    </BreadcrumbContainer>
  );
};

export default LotListBreadcrumbs;
