import WebSocket from 'ws';

export interface WsServer {
  start: () => void;
  stop: () => void;
  broadcast: (data: Buffer) => void;
}

/**
 * WebSocket server
 *
 * @param port Websocket port
 * @return {WsServer}
 */
const wsServer = (port: number): WsServer => {
  let wsServer: WebSocket.Server | undefined;

  /**
   * Start the websocket server
   */
  const start = () => {
    wsServer = new WebSocket.Server({ port });
    console.info(`wsServer - listening on`, port);

    wsServer.on('connection', (ws: WebSocket) => {
      console.info('wsServer - client connected ' + wsServer?.clients.size);

      ws.on('close', () => {
        console.info('wsServer - client disconnected ' + wsServer?.clients.size);
      });
    });
  };

  /**
   * Stop the websocket server
   */
  const stop = () => wsServer?.close();

  /**
   * Broadcast the buffer to all clients
   * @param data stream buffer
   */
  const broadcast = (data: Buffer) => {
    if (wsServer && wsServer.clients.size > 0) {
      wsServer.clients.forEach((ws) => {
        if (ws.readyState === 1) {
          ws.send(data, { binary: true });
        }
      });
    }
  };

  start();
  return { start, stop, broadcast };
};

export default wsServer;
