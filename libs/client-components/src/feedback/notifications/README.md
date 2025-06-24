# Toaster Component System

A modern, animated toast notification system built with React Spring and React Portal that displays messages at the bottom-right corner of the screen.

## Features

- 🎨 **Beautiful animations** with React Spring
- 🎯 **Portal rendering** - toasts appear at the bottom-right corner
- 🎨 **Multiple types** - success, error, warning, info
- ⏱️ **Auto-dismiss** with customizable duration
- 🎨 **Styled with emotion** - fully customizable appearance
- 🔧 **TypeScript support** - fully typed
- 🎯 **Context-based** - global state management

## Installation

The toaster system is already included in the `@adg/client-components` library.

```bash
# Install dependencies (already installed in this project)
npm install react-spring styled-components
```

## Usage

### 1. Wrap your app with ToasterProvider

```tsx
import { ToasterProvider } from '@adg/client-components';

function App() {
  return <ToasterProvider>{/* Your app content */}</ToasterProvider>;
}
```

### 2. Use the useToaster hook in components

```tsx
import { useToaster } from '@adg/client-components';

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useToaster();

  const handleSubmit = async () => {
    try {
      await submitForm();
      showSuccess('Form submitted successfully!');
    } catch (error) {
      showError('Failed to submit form');
    }
  };

  return <button onClick={handleSubmit}>Submit Form</button>;
}
```

## API Reference

### ToasterProvider

Provides the toaster context to child components.

**Props:**

- `children`: React.ReactNode - The child components

### useToaster Hook

Returns methods to show different types of toast messages.

**Returns:**

```typescript
{
  showToaster: (message: string, duration?: number, mode?: ToasterMode) => void;
  showStatus: boolean;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}
```

**Parameters:**

- `message`: string - The message to display
- `duration`: number (optional) - Duration in milliseconds (default: 5000)
- `mode`: ToasterMode (optional) - Type of toast ('success' | 'error' | 'warning' | 'info')

### ToasterMode

```typescript
type ToasterMode = 'info' | 'success' | 'warning' | 'error';
```

## Examples

### Basic Usage

```tsx
const { showSuccess, showError } = useToaster();

// Show success message for 3 seconds
showSuccess('Operation completed!', 3000);

// Show error message with default duration (5 seconds)
showError('Something went wrong!');
```

### Form Submission Example

```tsx
const MyForm = () => {
  const { showSuccess, showError } = useToaster();

  const handleSubmit = async (data) => {
    try {
      await api.submit(data);
      showSuccess('Data saved successfully!');
    } catch (error) {
      showError(`Failed to save: ${error.message}`);
    }
  };

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
};
```

### Custom Duration

```tsx
const { showWarning, showInfo } = useToaster();

// Quick notification (2 seconds)
showWarning('Quick warning!', 2000);

// Long notification (10 seconds)
showInfo('Important information that needs more time', 10000);
```

## Styling

The toaster uses styled-components and can be customized by modifying the styled components in `toaster.tsx`. The current design includes:

- **Position**: Fixed at bottom-right (20px from edges)
- **Animation**: Slide in from right with spring animation
- **Colors**: Different colors for each mode
- **Interaction**: Click to dismiss, hover effects
- **Icons**: Mode-specific icons (✓, ✕, ⚠, ℹ)

## Technical Details

- Uses React Portal to render outside the component tree
- Animations powered by `@react-spring/web`
- Auto-cleanup with useEffect timers
- Prevents memory leaks with proper cleanup
- Accessible with ARIA attributes

## Migration from Old Toaster

If you're migrating from the old local state toaster pattern:

**Before:**

```tsx
const [toaster, setToaster] = useState({ show: false, message: '' });

// Usage
setToaster({ show: true, message: 'Success!' });

// JSX
<Toaster show={toaster.show} message={toaster.message} onClose={() => setToaster({ show: false, message: '' })} />;
```

**After:**

```tsx
const { showSuccess } = useToaster();

// Usage
showSuccess('Success!');

// No JSX needed - toaster is global
```
