import http from 'http';
import yargs from 'yargs';
import { raspiStillOptions, raspiVidStreamingOptions } from '../shared/raspiOptions';
import raspiStill from './raspi/raspiStill';
import raspiStream from './raspi/raspiStream';
import raspiVid from './raspi/raspiVid';
import server from './server';
import tcpStreamer from './tcpStreamer';
import wsServer from './wsServer';

/**
 * Parse the command line arguments
 */
const argv = yargs
  .option('port', {
    alias: 'p',
    type: 'number',
    description: 'Port number of the express server',
    default: 8000,
  })
  .option('streamingPort', { alias: 's', type: 'number', description: 'TCP streaming port number' })
  .help()
  .alias('help', 'h').argv;

const start = () => {
  /**
   * https server
   * Create an http server to bind the express and websocket to the same port.
   */
  const httpServer = http.createServer();

  /**
   * Websocket Server
   * Start the web socket server to broadcast the stream to all clients.
   */
  const ws = wsServer(httpServer);

  /**
   * TCP streamer - Broadcast the stream to the WebSocket clients.
   * Mainly for debugging purposes, to run the server on a developer machine.
   *
   * Server: Start the server with TCP port (tp).
   * Raspberry: raspivid -w 1280 -h 720 -t 0 -fps 25 -ih -b 3000000 -pf baseline -o - | nc 192.168.3.80 8001
   */
  if (argv.streamingPort) {
    tcpStreamer(argv.streamingPort, ws.broadcast);
  }

  /**
   * RaspiVid - Broadcast the stream to the WebSocket clients.
   */
  const stream = raspiStream(raspiVidStreamingOptions, ws.broadcast);
  const still = raspiStill(raspiStillOptions);
  const vid = raspiVid();

  stream.start();

  /**
   * Webserver
   * Start the webserver and serve the website.
   */
  const app = server(stream, still, vid);
  httpServer.on('request', app);

  /**
   * Start the web server
   */
  httpServer.listen(argv.port);
  console.info('Server listening on', argv.port);
};

start();
