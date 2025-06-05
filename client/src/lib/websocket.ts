import { useEffect, useRef, useState } from 'react';

export interface WebSocketMessage {
  type: string;
  data: any;
}

export function useWebSocket(url?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const ws = useRef<WebSocket | null>(null);

  const connect = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = url || `${protocol}//${window.location.host}/ws`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setLastMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
      
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        connect();
      }, 3000);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const disconnect = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
      setIsConnected(false);
    }
  };

  const sendMessage = (message: WebSocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [url]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
  };
}

// Hook for tournament real-time updates
export function useTournamentUpdates() {
  const { lastMessage, sendMessage, isConnected } = useWebSocket();
  const [tournamentUpdates, setTournamentUpdates] = useState<any[]>([]);

  useEffect(() => {
    if (lastMessage?.type === 'tournament_update') {
      setTournamentUpdates(prev => [lastMessage.data, ...prev.slice(0, 9)]);
    }
  }, [lastMessage]);

  const joinTournamentRoom = (tournamentId: string) => {
    sendMessage({
      type: 'join_tournament',
      data: { tournamentId }
    });
  };

  const leaveTournamentRoom = (tournamentId: string) => {
    sendMessage({
      type: 'leave_tournament',
      data: { tournamentId }
    });
  };

  return {
    isConnected,
    tournamentUpdates,
    joinTournamentRoom,
    leaveTournamentRoom,
  };
}

// Hook for match room code updates
export function useMatchUpdates() {
  const { lastMessage, sendMessage, isConnected } = useWebSocket();
  const [roomCodes, setRoomCodes] = useState<Record<string, any>>({});

  useEffect(() => {
    if (lastMessage?.type === 'room_code_update') {
      const { matchId, roomId, password } = lastMessage.data;
      setRoomCodes(prev => ({
        ...prev,
        [matchId]: { roomId, password, timestamp: Date.now() }
      }));
    }
  }, [lastMessage]);

  const subscribeToMatch = (matchId: string) => {
    sendMessage({
      type: 'subscribe_match',
      data: { matchId }
    });
  };

  return {
    isConnected,
    roomCodes,
    subscribeToMatch,
  };
}
