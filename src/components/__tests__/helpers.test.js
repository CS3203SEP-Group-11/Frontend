import { formatPrice, formatDate, BREAKPOINTS, COLORS } from '../../utils/helpers';

describe('Helper Functions', () => {
  describe('formatPrice', () => {
    test('formats price correctly', () => {
      expect(formatPrice(99.99)).toBe('$99.99');
      expect(formatPrice(100)).toBe('$100.00');
      expect(formatPrice(0)).toBe('$0.00');
    });
  });

  describe('formatDate', () => {
    test('formats date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Jan/);
      expect(formatted).toMatch(/15/);
      expect(formatted).toMatch(/2024/);
    });
  });

  describe('Constants', () => {
    test('breakpoints are defined correctly', () => {
      expect(BREAKPOINTS.sm).toBe(640);
      expect(BREAKPOINTS.md).toBe(768);
      expect(BREAKPOINTS.lg).toBe(1024);
    });

    test('colors are defined correctly', () => {
      expect(COLORS.primary[500]).toBe('#3b82f6');
      expect(COLORS.primary[50]).toBe('#eff6ff');
    });
  });
});