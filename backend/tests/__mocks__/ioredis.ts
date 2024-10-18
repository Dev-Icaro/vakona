jest.createMockFromModule('ioredis');

class Redis {
  private data: Record<string, string>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_config: any) {
    this.data = {};
  }

  async get(key: string): Promise<string | null> {
    return this.data[key] || null;
  }

  async set(key: string, value: string): Promise<void> {
    this.data[key] = value;
  }

  async del(key: string): Promise<void> {
    delete this.data[key];
  }
}

export default Redis;
