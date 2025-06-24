import { RenderWhen, ToasterProvider } from '@adg/client-components';
import { GraphQLProvider } from '@adg/client-graphql-data';
import { useCredentialStore } from '@adg/client-state';
import { BodyContainer } from '@adg/client-theme';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { routerConfig } from './route-config';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
const graphqlUrl = import.meta.env.VITE_GRAPHQL_API_ENDPOINT || '/graphql';

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
