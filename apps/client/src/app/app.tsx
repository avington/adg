import { AuthenticationProvider } from '@adg/client-auth';
import { ClientTheme } from '@adg/client-theme';

export function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  console.log('clientId', clientId);
  return (
    <AuthenticationProvider clientId={clientId}>
      <ClientTheme />
    </AuthenticationProvider>
  );
}

export default App;
