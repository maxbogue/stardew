const MAX_TIME_PER_CHUNK = 50;

export function asyncFor(
  n: number,
  fn: (i: number) => void,
  end: () => void
): void {
  let i = 0;
  function doChunk(): void {
    const startTime = Date.now();
    for (; i < n && Date.now() - startTime <= MAX_TIME_PER_CHUNK; i++) {
      fn(i);
    }
    if (i < n) {
      setTimeout(doChunk, 1);
    } else {
      end();
    }
  }
  doChunk();
}
