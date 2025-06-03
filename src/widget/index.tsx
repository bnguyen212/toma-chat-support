import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChatWidget } from '../components/ChatWidget';

// Define the configuration type
interface WidgetConfig {
  containerId: string;
  apiUrl: string;
  customerDomain?: string;
  theme?: {
    primaryColor?: string;
  };
}

// Create a global initialization function
declare global {
  interface Window {
    initChatWidget: (config: WidgetConfig) => void;
    CHAT_WIDGET_CONFIG?: {
      customerDomain: string;
    };
  }
}

window.initChatWidget = (config: WidgetConfig) => {
  const container = document.getElementById(config.containerId);
  if (!container) {
    console.error(`Container with id ${config.containerId} not found`);
    return;
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ChatWidget
        apiUrl={config.apiUrl}
        customerDomain={config.customerDomain}
        theme={config.theme}
      />
    </React.StrictMode>
  );
};