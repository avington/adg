export interface JsonDebuggerProps {
  data: any;
  title?: string;
}

export const JsonDebugger: React.FC<JsonDebuggerProps> = ({ data, title }) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '400px',
        maxHeight: '50vh',
        overflowY: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid #ccc',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        padding: '10px',
        zIndex: 10000,
      }}
    >
      {title && <h3>{title}</h3>}
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {safeStringify(data, null, 2)}
      </pre>
    </div>
  );
};

// Prevents circular reference errors in JSON.stringify
export function safeStringify(obj: any, p0: null, space?: number): string {
  const seen = new WeakSet();
  return JSON.stringify(
    obj,
    function (key, value) {
      if (typeof value === 'bigint') {
        return value.toString() + 'n';
      }
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return value;
    },
    space
  );
}

// Usage:
// const json = safeStringify(yourObject);
