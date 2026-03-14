export const createSSEConnection = <T>(
  url: string,
  onMessage: (data: T) => void,
  options?: {
    eventName?: string;
    onError?: (error: Event) => void;
  }
) => {
  const fullUrl = `${import.meta.env.VITE_API_URL || '/api'}${url}`;
  const eventSource = new EventSource(fullUrl);

  const handleMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('[SSE] Error parsing data:', error, event.data);
    }
  };

  if (options?.eventName) {
    eventSource.addEventListener(options.eventName, handleMessage as EventListener);
  } else {
    eventSource.onmessage = handleMessage;
  }

  eventSource.onopen = () => {
    console.log(`[SSE] Connected to ${url}`);
  };

  eventSource.onerror = (error) => {
    console.error(`[SSE] Connection error for ${url}:`, error);
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
