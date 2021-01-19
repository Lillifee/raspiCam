import wsServer from './wsServer';
import tcpStreamer from './tcpStreamer';
import express from 'express';
import path from 'path';
import yargs from 'yargs';
import raspivid, { RaspiVidOptions } from './raspivid';

/**
 * Parse the command line arguments
 */
const argv = yargs
  .option('port', { alias: 'p', type: 'number', description: 'Port number of the express server', default: 8000 })
  .option('wsPort', { alias: 'w', type: 'number', description: 'Websocket streaming port number', default: 8001 })
  .option('tcpPort', { alias: 't', type: 'number', description: 'TCP streaming port number' })
  .help()
  .alias('help', 'h').argv;

const server = () => {
  /**
   * Webserver
   * Start the webserver and serve the website.
   */
  // TODO use HTTPS
  const app = express();
  app.use(express.static(path.join(__dirname, './public')));
  app.listen(argv.port);

  /**
   * Websocket Server
   * Start the web socket server to broadcast the stream to all clients.
   */
  const ws = wsServer(argv.wsPort);

  /**
   * TCP streamer - Broadcast the stream to the WebSocket clients.
   * Mainly for debugging purposes, to run the server on a developer machine.
   *
   * Server: Start the server with TCP port (tp).
   * Raspberry: raspivid -w 1280 -h 720 -t 0 -fps 25 -ih -b 3000000 -pf baseline -o - | nc 192.168.3.80 8002
   */
  if (argv.tcpPort) {
    tcpStreamer(argv.tcpPort, ws.broadcast);
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

  return { ws, vid };
};

server();
