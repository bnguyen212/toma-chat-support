(function() {
  // Get the customer's domain
  const customerDomain = window.location.hostname;

  // Create a unique ID for this widget instance
  const widgetId = 'chat-widget-' + Math.random().toString(36).substring(2, 11);

  // Create the container for our widget
  const container = document.createElement('div');
  container.id = widgetId;
  document.body.appendChild(container);

  // Load the widget styles
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = '/chat-widget.css';
  document.head.appendChild(style);

  // Load the widget bundle
  const script = document.createElement('script');
  script.src = '/chat-widget-bundle.js';
  script.async = true;
  script.onload = function() {
    // Initialize the widget with configuration
    if (typeof window.initChatWidget === 'function') {
      window.initChatWidget({
        containerId: widgetId,
        apiUrl: '/api/chat',
        customerId: customerDomain,
        theme: {
          primaryColor: '#007bff'
        }
      });
    } else {
      console.error('Chat widget failed to load properly');
    }
  };
  document.body.appendChild(script);
})();