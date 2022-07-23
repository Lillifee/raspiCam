import { Transform } from 'stream';

export const splitJpeg = (nextJpeg: (jpeg: Buffer) => void) => {
  const SOI = Buffer.from([0xff, 0xd8]);
  const EOI = Buffer.from([0xff, 0xd9]);

  let size = 0;
  let chunks: Uint8Array[] = [];
  let jpeg: Buffer;

  return new Transform({
    transform: (chunk: Buffer, _, callback) => {
      const chunkLength = chunk.length;
      let pos = 0;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (size) {
          const eoi = chunk.indexOf(EOI);
          if (eoi === -1) {
            chunks.push(chunk);
            size += chunkLength;
            break;
          } else {
            pos = eoi + 2;
            const sliced = chunk.slice(0, pos);
            chunks.push(sliced);
            size += sliced.length;
            jpeg = Buffer.concat(chunks, size);
            chunks = [];
            size = 0;
            nextJpeg(jpeg);
            if (pos === chunkLength) {
              break;
            }
          }
        } else {
          const soi = chunk.indexOf(SOI, pos);
          if (soi === -1) {
            break;
          } else {
            // todo might add option or take sample average / 2 to jump position for small gain
            pos = soi + 500;
          }
          const eoi = chunk.indexOf(EOI, pos);
          if (eoi === -1) {
            const sliced = chunk.slice(soi);
            chunks = [sliced];
            size = sliced.length;
            break;
          } else {
            pos = eoi + 2;
            jpeg = chunk.slice(soi, pos);
            nextJpeg(jpeg);
            if (pos === chunkLength) {
              break;
            }
          }
        }
      }
      callback();
    },
  });
};
