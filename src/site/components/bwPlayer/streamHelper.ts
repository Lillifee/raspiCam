const fragmentTypes: { [key: number]: string } = { 5: 'IDR', 6: 'SEI', 7: 'SPS', 8: 'PPS' };

/**
 * Parse the type of the passed frame
 *
 * IDR - Instantaneous Decoder Refresh
 * SEI - Supplemental enhancement information
 * SPS - Sequence Parameter Set
 * PPS - Picture Parameter Set
 */
export const parseFragmentType = (frame: Uint8Array): string | undefined => {
  const fragment = frame[4] & 0x1f;
  return fragmentTypes[fragment];
};

/**
 * Concat multiple UInt8Arrays to one
 */
const concatUint8Array = (chunks: Uint8Array[]) => {
  if (!chunks || !chunks.length) {
    return new Uint8Array(0);
  }

  let completeLength = 0;
  let i = 0;
  const chunkLength = chunks.length;

  for (i; i < chunkLength; ++i) {
    completeLength += chunks[i].byteLength;
  }

  const res = new Uint8Array(completeLength);
  let filledLength = 0;

  for (i = 0; i < chunkLength; ++i) {
    res.set(new Uint8Array(chunks[i]), filledLength);
    filledLength += chunks[i].byteLength;
  }

  return res;
};

/**
 * Split the stream by each NAL separator [0,0,0,1].
 *
 * @param {(frame: Uint8Array) => void} onFrame callback on frame
 * @return {(((data: Uint8Array | undefined) => void))} data feed
 */
export const streamSplitter = (
  onFrame: (frame: Uint8Array) => void,
): ((data: Uint8Array | undefined) => void) => {
  let bufferAr: Uint8Array[] = [];

  return (data: Uint8Array | undefined) => {
    if (!(data && data.length)) {
      return;
    }

    let foundHit = false;

    let b = 0;
    const l = data.length;
    let zeroCnt = 0;
    for (b; b < l; ++b) {
      if (data[b] === 0) {
        zeroCnt++;
      } else {
        if (data[b] == 1 && zeroCnt >= 3) {
          foundHit = true;
          bufferAr.push(data.subarray(0, b - 3));
          onFrame(concatUint8Array(bufferAr));

          bufferAr = [];
          bufferAr.push(data.subarray(b - 3));
          break;
        }
        zeroCnt = 0;
      }
    }
    if (!foundHit) {
      bufferAr.push(data);
    }
  };
};
