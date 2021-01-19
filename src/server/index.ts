import express from 'express';
import http from 'http';
import path from 'path';
import yargs from 'yargs';
import raspivid, { RaspiVidOptions } from './raspivid';
import tcpStreamer from './tcpStreamer';
import wsServer from './wsServer';

/**
 * Parse the command line arguments
 */
const argv = yargs
  .option('port', { alias: 'p', type: 'number', description: 'Port number of the express server', default: 8000 })
  .option('streamingPort', { alias: 's', type: 'number', description: 'TCP streaming port number' })
  .help()
  .alias('help', 'h').argv;

const server = () => {
  /**
   * https server
   * Create an http server to bind the express and websocket to the same port.
   */
  const server = http.createServer();

  /**
   * Webserver
   * Start the webserver and serve the website.
   */
  const app = express();
  app.use(express.static(path.join(__dirname, './public')));
  server.on('request', app);

  /**
   * Websocket Server
   * Start the web socket server to broadcast the stream to all clients.
   */
  const ws = wsServer(server);

  /**
   * TCP streamer - Broadcast the stream to the WebSocket clients.
   * Mainly for debugging purposes, to run the server on a developer machine.
   *
   * Server: Start the server with TCP port (tp).
   * Raspberry: raspivid -w 1280 -h 720 -t 0 -fps 25 -ih -b 3000000 -pf baseline -o - | nc 192.168.3.80 8002
   */
  if (argv.streamingPort) {
    tcpStreamer(argv.streamingPort, ws.broadcast);
  }

  /**
   * RaspiVid - Broadcast the stream to the WebSocket clients.
   */
  const raspividOptions: RaspiVidOptions = {
    width: 1280,
    height: 720,
    timeout: 0,
    framerate: 25,
    profile: 'baseline',
    bitrate: 1000000,
  };
  const vid = raspivid(raspividOptions, ws.broadcast);

  /**
   * Start the web server
   */
  server.listen(argv.port);
  console.info('Server listening on', argv.port);

  return { server, ws, vid };
};

server();
