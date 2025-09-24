import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import AlertsProvider from './context/AlertsContext';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider defaultColorScheme="light">
          <Notifications position="top-right" />
          <AuthProvider>
            <AlertsProvider>
              <App />
            </AlertsProvider>
          </AuthProvider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>,
);