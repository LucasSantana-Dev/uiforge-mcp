const mockBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);

const mockInstance = (): Record<string, unknown> => {
  const self: Record<string, unknown> = {};
  const chain = () => self;
  self.metadata = async () => ({
    width: 100,
    height: 100,
    channels: 3,
    format: 'png',
  });
  self.raw = chain;
  self.png = chain;
  self.jpeg = chain;
  self.webp = chain;
  self.resize = chain;
  self.extract = chain;
  self.flatten = chain;
  self.negate = chain;
  self.normalise = chain;
  self.normalize = chain;
  self.removeAlpha = chain;
  self.ensureAlpha = chain;
  self.toBuffer = async (opts?: { resolveWithObject?: boolean }) => {
    if (opts?.resolveWithObject) {
      return {
        data: Buffer.alloc(100 * 100 * 3, 128),
        info: { width: 100, height: 100, channels: 3, size: 30000 },
      };
    }
    return mockBuffer;
  };
  self.toFile = async () => ({ width: 100, height: 100, channels: 3, size: 9 });
  self.stats = async () => ({
    channels: [
      { min: 0, max: 255, sum: 12750, squaresSum: 650250, mean: 128, stdev: 50 },
      { min: 0, max: 255, sum: 12750, squaresSum: 650250, mean: 128, stdev: 50 },
      { min: 0, max: 255, sum: 12750, squaresSum: 650250, mean: 128, stdev: 50 },
    ],
  });
  return self;
};

const mockSharp = Object.assign((_input?: unknown, _options?: unknown) => mockInstance(), {
  cache: () => {},
  concurrency: () => 0,
  simd: () => false,
});

export default mockSharp;
