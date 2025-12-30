import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';
import dayjs from 'dayjs';

// Mock external dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    subscription: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('@/lib/resend', () => ({
  resend: {
    emails: {
      send: vi.fn().mockResolvedValue({ data: 'id', error: null }),
    },
  },
}));

describe('Cron Job: Trial Check', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends emails to users with expiring trials', async () => {
    // 1. Setup Mock Data
    const expiringSub = {
      id: 'sub_1',
      isTrial: true,
      nextRenewalDate: dayjs().add(1, 'day').toDate(), // Expiring tomorrow
      cost: 10,
      user: { email: 'test@example.com', name: 'Test User' },
      vendor: { name: 'Netflix' },
    };

    // Tell Prisma to return this subscription when asked
    (prisma.subscription.findMany as any).mockResolvedValue([expiringSub]);

    // 2. Mock Request with correct Secret
    const req = new Request('http://localhost:3000/api/cron/check-trials', {
      headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
    });

    // 3. Run the Function
    await GET(req);

    // 4. Verify Resend was called
    expect(resend.emails.send).toHaveBeenCalledTimes(1);
    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'substrack.dev@gmail.com', // As hardcoded in your route
        subject: '⚠️ Action Required: Netflix trial ending',
      })
    );
  });

  it('does not send emails if no trials are expiring', async () => {
    (prisma.subscription.findMany as any).mockResolvedValue([]);

    const req = new Request('http://localhost:3000/api/cron/check-trials', {
      headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
    });

    await GET(req);

    expect(resend.emails.send).not.toHaveBeenCalled();
  });
});