import { AuthenticationProvider } from '@adg/client-auth';
import { AppProviders } from './app-providers';

export function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <AuthenticationProvider clientId={clientId}>
      <AppProviders />
    </AuthenticationProvider>
  );
}

export default App;
