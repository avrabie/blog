export const createSSEConnection = <T>(
  url: string,
  onData: (data: T) => void,
  options: {
    eventName?: string;
    onError?: (error: Event) => void;
    onOpen?: () => void;
  } = {}
) => {
  // Use direct connection to backend for SSE (bypass Vite proxy)
  const sseBaseUrl = import.meta.env.VITE_SSE_URL || '';
  const fullUrl = `${sseBaseUrl}${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;

  console.log(`[SSE] 🔌 Creating SSE connection to: ${fullUrl}`, { eventName: options.eventName });
  const eventSource = new EventSource(fullUrl);

  console.log(`[SSE] EventSource created, readyState: ${eventSource.readyState}`);

  const handleEvent = (event: MessageEvent) => {
    console.log(`[SSE] Event received - type: "${event.type}", data: "${event.data}"`);

    // Heartbeat check (named 'keep-alive' or empty data)
    const isHeartbeat = event.type === 'keep-alive' ||
                        !event.data ||
                        event.data === 'null' ||
                        event.data === '""' ||
                        event.data === '';

    if (isHeartbeat) {
      console.log(`[SSE] ❤️ Heartbeat received from ${url}`);
      return;
    }

    try {
      console.log(`[SSE] Data received from ${url} (event: ${event.type}):`, event.data);
      const data = JSON.parse(event.data);
      onData(data);
    } catch (error) {
      console.error(`[SSE] Parse error from ${url}:`, error, event.data);
    }
  };

  eventSource.onopen = () => {
    console.log(`[SSE] ✅ Connection established to ${fullUrl} (readyState: ${eventSource.readyState})`);
    options.onOpen?.();
  };

  eventSource.onerror = (error) => {
    // ReadyState 2 means CLOSED, 0 means CONNECTING (retrying)
    console.error(`[SSE] ❌ Connection error for ${fullUrl} (readyState: ${eventSource.readyState})`, error);
    if (eventSource.readyState === EventSource.CLOSED) {
      console.error(`[SSE] Connection permanently closed for ${fullUrl}`);
    }
    options.onError?.(error);
  };

  // Log all incoming messages for debugging
  eventSource.onmessage = (event) => {
    console.log(`[SSE] 📨 onmessage fired:`, event);
    handleEvent(event);
  };

  // Standard listeners
  eventSource.addEventListener('message', handleEvent as EventListener);
  eventSource.addEventListener('keep-alive', (event) => {
    console.log(`[SSE] 📨 keep-alive event fired:`, event);
    handleEvent(event as MessageEvent);
  });

  // Custom event listener
  if (options.eventName && options.eventName !== 'message') {
    console.log(`[SSE] Registering custom event listener: ${options.eventName}`);
    eventSource.addEventListener(options.eventName, (event) => {
      console.log(`[SSE] 📨 ${options.eventName} event fired:`, event);
      handleEvent(event as MessageEvent);
    });
  }

  console.log(`[SSE] Registered event listeners for: message, keep-alive${options.eventName ? ', ' + options.eventName : ''}`);

  return () => {
    console.log(`[SSE] Manually closing connection to ${fullUrl}`);
    eventSource.close();
  };
};
