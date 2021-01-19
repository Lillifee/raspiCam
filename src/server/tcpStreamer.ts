import net from 'net';
import Split from 'stream-split';

const NALSeparator = Buffer.from([0, 0, 0, 1]);

export interface TCPStreamer {
  start: () => void;
  stop: () => void;
}

/**
 * TCP streamer - broadcast the stream to the WebSocket clients.
 * Mainly for debugging porpuse to run the server on a developer machine.
 *
 * @param {number} port Port number
 * @param {(data: Buffer) => void} onData Callback on streaming data
 */
const tcpStreamer = (port: number, onData: (data: Buffer) => void): TCPStreamer => {
  let server: net.Server | undefined;

  /**
   * Create and start the TCP server
   */
  const start = () => {
    server = net.createServer((socket: net.Socket) => {
      console.info('tcpStreamer - connected');

      socket.on('end', () => {
        console.info('tcpStreamer - disconnected');
      });

      // TODO Check if we can forward the NAL splitter using pipe
      const NALSplitter = new Split(NALSeparator);
      NALSplitter.on('data', (data: Buffer) => onData(Buffer.concat([NALSeparator, data])));

      socket.pipe(NALSplitter);
    });

    server.listen(port);
    console.info('tcpStreamer - listening on ', port);

    return server;
  };

  /**
   * Stop the TCP server
   */
  const stop = () => server?.close();

  start();
  return { start, stop };
};

export default tcpStreamer;
