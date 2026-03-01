const mockPng = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);

export class Resvg {
  constructor(_svg: string | Buffer, _options?: unknown) {}

  render() {
    return {
      asPng: () => mockPng,
      width: 100,
      height: 100,
    };
  }
}
