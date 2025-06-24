import React from 'react';
import { ToasterProvider } from './toater-provider';
import { useToaster } from './use-toaster';

// Example component demonstrating how to use the toaster
const ToasterDemo: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToaster();

  return (
    <div style={{ padding: '20px' }}>
      <h2>Toaster Demo</h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => showSuccess('Operation completed successfully!')}
        >
          Show Success
        </button>
        <button onClick={() => showError('Something went wrong!')}>
          Show Error
        </button>
        <button onClick={() => showWarning('Please be careful!')}>
          Show Warning
        </button>
        <button onClick={() => showInfo('Here is some information.')}>
          Show Info
        </button>
        <button
          onClick={() =>
            showSuccess('This message will auto-dismiss in 2 seconds', 2000)
          }
        >
          Quick Success (2s)
        </button>
        <button
          onClick={() =>
            showError('This message will stay for 10 seconds', 10000)
          }
        >
          Long Error (10s)
        </button>
      </div>
    </div>
  );
};

// Example App component showing how to wrap your app with ToasterProvider
export const ToasterExampleApp: React.FC = () => {
  return (
    <ToasterProvider>
      <div>
        <h1>My Application</h1>
        <ToasterDemo />
        {/* Your other app components go here */}
      </div>
    </ToasterProvider>
  );
};

// Usage in your main App component:
//
// import { ToasterProvider } from '@adg/client-components';
//
// function App() {
//   return (
//     <ToasterProvider>
//       {/* Your app content */}
//     </ToasterProvider>
//   );
// }
//
// Then in any component:
//
// import { useToaster } from '@adg/client-components';
//
// function MyComponent() {
//   const { showSuccess, showError, showWarning, showInfo } = useToaster();
//
//   const handleClick = () => {
//     showSuccess('Action completed!');
//   };
//
//   return <button onClick={handleClick}>Click me</button>;
// }
