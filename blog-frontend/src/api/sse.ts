export const createSSEConnection = <T>(
  url: string,
  onMessage: (data: T) => void,
  options?: {
    eventName?: string;
    onError?: (error: Event) => void;
    onOpen?: () => void;
  }
) => {
  const fullUrl = `${import.meta.env.VITE_API_URL || '/api'}${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
  console.log(`[SSE] Opening connection to ${fullUrl}`);
  const eventSource = new EventSource(fullUrl);

  const handleMessage = (event: MessageEvent) => {
    if (event.type === 'keep-alive') {
        console.log(`[SSE] Heartbeat received from ${url}`);
        return;
    }
    
    console.log(`[SSE] Received event "${event.type}" from ${url}:`, event.data);
    if (!event.data) return;
    
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('[SSE] Error parsing data:', error, event.data);
    }
  };

  if (options?.eventName) {
    eventSource.addEventListener(options.eventName, handleMessage as EventListener);
    eventSource.addEventListener('keep-alive', handleMessage as EventListener);
  } else {
    eventSource.onmessage = handleMessage;
  }

  // Also listen to generic messages just in case
  eventSource.addEventListener('message', (e) => {
    if (!options?.eventName) return; // Already handled by onmessage
    console.log(`[SSE] Received generic message while expecting "${options.eventName}":`, e.data);
  });

  eventSource.onopen = () => {
    console.log(`[SSE] Connected to ${url}, readyState: ${eventSource.readyState} (OPEN)`);
    if (options?.onOpen) options.onOpen();
  };

  eventSource.onerror = (error) => {
    // readyState 0 = CONNECTING, 1 = OPEN, 2 = CLOSED
    const stateStr = eventSource.readyState === 0 ? 'CONNECTING' : 
                    eventSource.readyState === 1 ? 'OPEN' : 'CLOSED';
    console.error(`[SSE] Connection error for ${url}, state: ${stateStr} (${eventSource.readyState})`, error);
    if (options?.onError) options.onError(error);
  };

  return () => {
    console.log(`[SSE] Closing connection to ${url}`);
    if (options?.eventName) {
      eventSource.removeEventListener(options.eventName, handleMessage as EventListener);
    }
    eventSource.close();
  };
};
