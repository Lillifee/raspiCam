import { PlayerOptions } from './player';
import { PlayerStats } from './stats';

/**
 * Fetch the stream and publish the data using the onData callback function
 *
 * @param onData on data received callback function
 * @param options player options
 * @param stats player statistics
 */
export const streamFetch = (
  onData: (data: Uint8Array) => void,
  options: Required<PlayerOptions>,
  stats: PlayerStats,
): { start: () => void; stop: () => void } => {
  const abortStream = new AbortController();

  const start = () => {
    stats.streamRunning = false;
    stats.droppingFrames = true;

    fetch(options.url, { signal: abortStream.signal })
      .then((response) => {
        const reader = response.body?.getReader();
        if (!reader) return;

        const stream = new ReadableStream({
          start(controller) {
            const push = async (): Promise<void> => {
              const { done, value } = await reader.read();

              // When no more data needs to be consumed, close the stream
              if (done) {
                controller.close();
                stats.streamRunning = false;
                reconnect();
                return;
              }

              if (value) {
                stats.streamRunning = true;
                stats.sizePerCycle += value.length;
                onData(value);
              }

              // Enqueue the next data chunk into our target stream
              controller.enqueue(value);
              return push();
            };

            return push();
          },
          cancel(reason) {
            console.log('stream canceled', reason);
            reconnect();
          },
        });

        return new Response(stream);
      })
      .catch((e) => {
        if (!abortStream.signal.aborted) {
          console.log('stream error', e);
          stats.streamRunning = false;
        }
      });
  };

  const reconnect = () => setTimeout(() => start(), options.reconnect);

  const stop = () => abortStream.abort();

  return { start, stop };
};
