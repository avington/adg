import {
  QuotesRefresher,
  RenderWhen,
  ToasterProvider,
} from '@adg/client-components';
import {
  GraphQLProvider,
  useUserHoldingsSymbolsByPortfolio,
  useRefreshQuotes, // add
} from '@adg/client-graphql-data';
import {
  setAllSymbols,
  setError,
  setLoadingState,
  useAppDispatch,
  useCredentialStore,
  useAppSelector,
  selectAllUniqueSymbols,
} from '@adg/client-state';
import { BodyContainer } from '@adg/client-theme';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { routerConfig } from './route-config';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
const graphqlUrl = import.meta.env.VITE_GRAPHQL_API_ENDPOINT || '/graphql';

// NEW: sync GraphQL hook -> Redux
const AllSymbolsSync: React.FC = () => {
  const dispatch = useAppDispatch();
  const { portfolios, loading, error } = useUserHoldingsSymbolsByPortfolio();

  const uniqueSymbols = useAppSelector(selectAllUniqueSymbols);
  useEffect(() => {
    console.log('AllSymbolsSync render, uniqueSymbols:', uniqueSymbols);
  }, [uniqueSymbols]);

  // refresh quotes for current symbols
  useRefreshQuotes(uniqueSymbols);

  useEffect(() => {
    if (loading) dispatch(setLoadingState('loading'));
  }, [loading, dispatch]);

  useEffect(() => {
    if (error) dispatch(setError(error.message));
  }, [error, dispatch]);

  useEffect(() => {
    if (!loading && !error) {
      dispatch(setAllSymbols(portfolios));
    }
  }, [loading, error, portfolios, dispatch]);

  return null;
};

export const AppProviders: React.FC = () => {
  const [token, setToken] = useState<string>();

  const credentials = useCredentialStore.use.credentials();

  useEffect(() => {
    if (credentials?.credential) {
      setToken(credentials.credential);
    }
  }, [credentials]);

  return (
    <BodyContainer>
      <ToasterProvider>
        <RenderWhen>
          <RenderWhen.If isTrue={!!token}>
            <GraphQLProvider uri={graphqlUrl} token={token}>
              {/* QuotesRefresher removed */}
              <AllSymbolsSync />
              <RouterProvider router={routerConfig} />
            </GraphQLProvider>
          </RenderWhen.If>
          <RenderWhen.If isTrue={!token}>
            <div>No token provided</div>
          </RenderWhen.If>
        </RenderWhen>
      </ToasterProvider>
    </BodyContainer>
  );
};
