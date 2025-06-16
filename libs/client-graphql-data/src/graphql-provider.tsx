import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context'; // <-- Add this import
import { PropsWithChildren } from 'react';

export interface GraphQLProviderProps {
  uri?: string;
  token?: string;
}

export const GraphQLProvider: React.FC<
  PropsWithChildren<GraphQLProviderProps>
> = ({ children, uri, token }) => {
  const httpLink = createHttpLink({
    uri,
  });

  // Add the Authorization header with the bearer token if provided
  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }));

  const apolloClient = new ApolloClient({
    // Chain authLink before httpLink
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: true,
    defaultOptions: {
      // These options control how Apollo Client handles queries and caching:
      watchQuery: {
        // 'cache-and-network': Return data from cache first (if available), then update with network data.
        fetchPolicy: 'cache-and-network',
        // 'all': Return any available data, even if some parts of the query fail.
        errorPolicy: 'all',
      },
      query: {
        // 'network-only': Always fetch from the server, ignoring the cache.
        fetchPolicy: 'network-only',
        // 'all': Return partial data with errors if possible.
        errorPolicy: 'all',
      },
    },
  });

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
