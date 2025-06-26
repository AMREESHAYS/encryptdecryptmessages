import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContest';
import { TabProvider } from './context/TabContest';
import { MessageHistoryProvider } from './context/MessageHistoryContext';
import AppLayout from './layouts/Applayou';

function App() {
  return (
    <ThemeProvider>
      <TabProvider>
        <MessageHistoryProvider>
          <AppLayout />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                background: 'var(--toast-bg, #333)',
                color: 'var(--toast-color, #fff)',
                fontSize: '14px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </MessageHistoryProvider>
      </TabProvider>
    </ThemeProvider>
  );
}

export default App;