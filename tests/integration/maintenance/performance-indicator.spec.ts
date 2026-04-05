import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';

const mockPerformanceRows = [
  {
    familia_nome: 'COMPRESSORES',
    tempo_prev: 1800,
    tempo_corretiva: 63,
    total_paradas: BigInt(15),
  },
  {
    familia_nome: 'BOMBAS',
    tempo_prev: 2000,
    tempo_corretiva: 20,
    total_paradas: BigInt(8),
  },
];

const mockPrismaService = {
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $queryRaw: jest.fn().mockResolvedValue(mockPerformanceRows),
};

describe('GET /maintenance/reports/performance-indicator (integration)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Obtain a valid JWT token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@smartnew.com', password: 'smartnew2024' });

    accessToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 401 when no token is provided', async () => {
    const response = await request(app.getHttpServer()).get(
      '/maintenance/reports/performance-indicator',
    );
    expect(response.status).toBe(401);
  });

  it('should return 200 with KPI data when authenticated', async () => {
    const response = await request(app.getHttpServer())
      .get('/maintenance/reports/performance-indicator')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(2);
  });

  it('should return correct KPI structure for each family', async () => {
    const response = await request(app.getHttpServer())
      .get('/maintenance/reports/performance-indicator')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

    const item = response.body.data[0];
    expect(item).toHaveProperty('Familia');
    expect(item).toHaveProperty('DF');
    expect(item).toHaveProperty('MTBF');
    expect(item).toHaveProperty('MTTR');
    expect(item).toHaveProperty('Paradas');
    expect(item).toHaveProperty('tempo_prev');
    expect(item).toHaveProperty('tempo_corretiva');
  });

  it('should calculate DF correctly', async () => {
    const response = await request(app.getHttpServer())
      .get('/maintenance/reports/performance-indicator')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

    const compressores = response.body.data.find(
      (r: { Familia: string }) => r.Familia === 'COMPRESSORES',
    );
    expect(compressores).toBeDefined();
    // DF = ((1800 - 63) / 1800) * 100 = 96.5%
    expect(compressores.DF).toBeCloseTo(96.5, 1);
    expect(compressores.Paradas).toBe(15);
  });

  it('should return 200 with default dates when no dates provided', async () => {
    const response = await request(app.getHttpServer())
      .get('/maintenance/reports/performance-indicator')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should return 400 when startDate format is invalid', async () => {
    const response = await request(app.getHttpServer())
      .get('/maintenance/reports/performance-indicator')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ startDate: '01-01-2024' });

    expect(response.status).toBe(400);
  });

  it('should return 400 when startDate is after endDate', async () => {
    const response = await request(app.getHttpServer())
      .get('/maintenance/reports/performance-indicator')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ startDate: '2024-12-31', endDate: '2024-01-01' });

    expect(response.status).toBe(400);
  });

  it('should accept typeMaintenance filter', async () => {
    const response = await request(app.getHttpServer())
      .get('/maintenance/reports/performance-indicator')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        typeMaintenance: '1,2',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should return table format by default', async () => {
    const response = await request(app.getHttpServer())
      .get('/maintenance/reports/performance-indicator')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data[0]).toHaveProperty('Familia');
  });

  it('should return pie chart format when chartType=pie', async () => {
    const response = await request(app.getHttpServer())
      .get('/maintenance/reports/performance-indicator')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ startDate: '2024-01-01', endDate: '2024-12-31', chartType: 'pie' });

    expect(response.status).toBe(200);
    expect(response.body.data.labels).toBeDefined();
    expect(response.body.data.datasets).toHaveLength(1);
    expect(response.body.data.datasets[0].data).toHaveLength(2);
  });

  it('should return bar chart format when chartType=bar', async () => {
    const response = await request(app.getHttpServer())
      .get('/maintenance/reports/performance-indicator')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ startDate: '2024-01-01', endDate: '2024-12-31', chartType: 'bar' });

    expect(response.status).toBe(200);
    expect(response.body.data.labels).toBeDefined();
    expect(response.body.data.datasets).toHaveLength(3);
    expect(response.body.data.datasets[0].label).toBe('DF (%)');
  });

  it('should return line chart format when chartType=line', async () => {
    const response = await request(app.getHttpServer())
      .get('/maintenance/reports/performance-indicator')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ startDate: '2024-01-01', endDate: '2024-12-31', chartType: 'line' });

    expect(response.status).toBe(200);
    expect(response.body.data.labels).toBeDefined();
    expect(response.body.data.datasets).toHaveLength(2);
    expect(response.body.data.datasets[0].label).toBe('Tempo Previsto (h)');
  });

  it('should reject invalid chartType', async () => {
    const response = await request(app.getHttpServer())
      .get('/maintenance/reports/performance-indicator')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ startDate: '2024-01-01', endDate: '2024-12-31', chartType: 'scatter' });

    expect(response.status).toBe(400);
  });
});
