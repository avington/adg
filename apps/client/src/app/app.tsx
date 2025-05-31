import { AuthenticationProvider } from '@adg/client-auth';
import { BodyContainer } from '@adg/client-theme';
import axios from 'axios';
import { RouterProvider } from 'react-router-dom';
import { routerConfig } from './route-config';

export function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

  return (
    <AuthenticationProvider clientId={clientId}>
      <BodyContainer>
        <RouterProvider router={routerConfig} />
      </BodyContainer>
    </AuthenticationProvider>
  );
}

export default App;
