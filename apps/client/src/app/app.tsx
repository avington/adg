import { AuthenticationProvider } from '@adg/client-auth';
import { AppProviders } from './app-providers';
import { Provider } from 'react-redux';
import { store } from '@adg/client-state';

export function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <Provider store={store}>
      <AuthenticationProvider clientId={clientId}>
        <AppProviders />
      </AuthenticationProvider>
    </Provider>
  );
}

export default App;
