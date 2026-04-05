import request from 'supertest';
import app from '../src/app';
import { describe, it, expect } from '@jest/globals';

describe('App Endpoints', () => {
  it('should return ok for health check', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('should return 401 for unauthorized access to records', async () => {
    const res = await request(app).get('/api/records');
    expect(res.status).toBe(401);
  });
});
