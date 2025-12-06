import { HealthController } from '@http/controllers/health.controller';

describe('HealthController', () => {
  it('should return ok true and a valid timestamp', () => {
    const controller = new HealthController();
    const before = Date.now();
    const result = controller.getHealth();
    const after = Date.now();
    expect(result.ok).toBe(true);
    expect(typeof result.timestamp).toBe('string');
    const ts = Date.parse(result.timestamp);
    expect(Number.isNaN(ts)).toBe(false);
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });
});
