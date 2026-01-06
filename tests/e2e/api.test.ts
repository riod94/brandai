import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

describe('E2E: Brand API', () => {
    describe('GET /api/brands', () => {
        it('should return 401 for unauthenticated requests', async () => {
            const response = await fetch(`${BASE_URL}/api/brands`);
            expect(response.status).toBe(401);
            const data = await response.json();
            expect(data.error).toBe('Unauthorized');
        });
    });

    describe('POST /api/brands', () => {
        it('should return 401 for unauthenticated requests', async () => {
            const response = await fetch(`${BASE_URL}/api/brands`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Test Brand' }),
            });
            expect(response.status).toBe(401);
            const data = await response.json();
            expect(data.error).toBe('Unauthorized');
        });
    });
});

describe('E2E: Pricing API', () => {
    it('should return pricing data', async () => {
        const response = await fetch(`${BASE_URL}/api/pricing`);
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toHaveProperty('creditPrice');
        expect(data).toHaveProperty('minCredits');
        expect(data).toHaveProperty('freeCredits');
    });
});

describe('E2E: Public Pages', () => {
    it('should load landing page', async () => {
        const response = await fetch(`${BASE_URL}/`);
        expect(response.status).toBe(200);
    });

    it('should load about page', async () => {
        const response = await fetch(`${BASE_URL}/about`);
        expect(response.status).toBe(200);
    });

    it('should load create logo page', async () => {
        const response = await fetch(`${BASE_URL}/create/logo`);
        expect(response.status).toBe(200);
    });

    it('should load create brand page', async () => {
        const response = await fetch(`${BASE_URL}/create/brand`);
        expect(response.status).toBe(200);
    });
});
