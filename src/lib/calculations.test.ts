import { describe, it, expect } from 'vitest';
import { 
  convertTo, 
  calculateMonthlyBurnRate, 
  processSubscriptionData 
} from './calculations';

describe('Financial Calculations', () => {
  // Mock exchange rates: 1 USD = 50 PHP
  const rates = { USD: 1, PHP: 50 };

  it('converts currency correctly', () => {
    // 100 USD should be 5000 PHP
    const result = convertTo(100, 'USD', 'PHP', rates);
    expect(result).toBe(5000);
  });

  it('calculates monthly burn rate with yearly normalization', () => {
    const items = [
      { cost: 100, currency: 'PHP', frequency: 'MONTHLY', splitCost: 0 },
      { cost: 6000, currency: 'PHP', frequency: 'YEARLY', splitCost: 0 }, // Should be 500/mo
    ];
    
    const burn = calculateMonthlyBurnRate(items, rates, 'PHP');
    expect(burn).toBe(600); // 100 + 500
  });

  it('uses split cost when available', () => {
    const items = [
      { cost: 1000, splitCost: 500, currency: 'PHP', frequency: 'MONTHLY' }
    ];

    const burn = calculateMonthlyBurnRate(items, rates, 'PHP');
    expect(burn).toBe(500); // Should use splitCost (500) not cost (1000)
  });

  it('excludes trials from monthly burn calculation', () => {
    const subs = [
      { status: 'ACTIVE', isTrial: false, cost: 100, currency: 'PHP', frequency: 'MONTHLY', splitCost: 0 },
      { status: 'ACTIVE', isTrial: true, cost: 500, currency: 'PHP', frequency: 'MONTHLY', splitCost: 0 }, // Trial
    ];

    const data = processSubscriptionData(subs, rates, 'PHP');

    // Burn should only include the non-trial item (100)
    expect(data.monthlyBurn).toBe(100);
    expect(data.activeTrials).toBe(1);
  });
});