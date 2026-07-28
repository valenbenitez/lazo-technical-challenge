import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/modules/infrastructure/prisma/prisma.service';
import { ObligationStatus, ObligationType } from '../generated/prisma/client';

describe('PATCH /obligations/:id/update-status (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const createdIds: string[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterEach(async () => {
    if (createdIds.length === 0) return;
    await prisma.obligation.deleteMany({
      where: { id: { in: [...createdIds] } },
    });
    createdIds.length = 0;
  });

  afterAll(async () => {
    await app.close();
  });

  async function seedObligation(data: {
    status: ObligationStatus;
    requiresDocument?: boolean;
    documentUrl?: string | null;
  }) {
    const obligation = await prisma.obligation.create({
      data: {
        type: ObligationType.annual_report,
        title: `e2e-update-status-${Date.now()}`,
        description: 'e2e seed',
        status: data.status,
        dueDate: new Date('2099-12-31T00:00:00.000Z'),
        owner: 'e2e-owner',
        requiresDocument: data.requiresDocument ?? false,
        documentUrl: data.documentUrl ?? null,
        companyTaxId: 'e2e-tax-0001',
      },
    });
    createdIds.push(obligation.id);
    return obligation;
  }

  it('happy path: pending → in_progress returns success, persists status and history', async () => {
    const obligation = await seedObligation({
      status: ObligationStatus.pending,
    });

    const response = await request(app.getHttpServer())
      .patch(`/obligations/${obligation.id}/update-status`)
      .send({ status: 'in_progress' })
      .expect(200);

    const body = response.body as {
      status: string;
      data: { id: string; status: string; companyTaxId: string };
    };
    expect(body.status).toBe('success');
    expect(body.data.id).toBe(obligation.id);
    expect(body.data.status).toBe('in_progress');
    expect(body.data.companyTaxId).not.toBe('e2e-tax-0001');

    const persisted = await prisma.obligation.findUniqueOrThrow({
      where: { id: obligation.id },
    });
    expect(persisted.status).toBe(ObligationStatus.in_progress);

    const history = await prisma.obligationStatusHistory.findMany({
      where: { obligationId: obligation.id },
    });
    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({
      fromStatus: ObligationStatus.pending,
      toStatus: ObligationStatus.in_progress,
    });
  });

  it('doc-gated: in_progress without documentUrl → submitted returns 400 INVALID_STATUS_TRANSITION', async () => {
    const obligation = await seedObligation({
      status: ObligationStatus.in_progress,
      requiresDocument: true,
      documentUrl: null,
    });

    const response = await request(app.getHttpServer())
      .patch(`/obligations/${obligation.id}/update-status`)
      .send({ status: 'submitted' })
      .expect(400);

    const body = response.body as { code: string; message: string };
    expect(body.code).toBe('INVALID_STATUS_TRANSITION');
    expect(typeof body.message).toBe('string');

    const persisted = await prisma.obligation.findUniqueOrThrow({
      where: { id: obligation.id },
    });
    expect(persisted.status).toBe(ObligationStatus.in_progress);

    const history = await prisma.obligationStatusHistory.findMany({
      where: { obligationId: obligation.id },
    });
    expect(history).toHaveLength(0);
  });

  it('not found: nonexistent id returns 404 OBLIGATION_NOT_FOUND', async () => {
    const response = await request(app.getHttpServer())
      .patch('/obligations/00000000-0000-4000-8000-000000000000/update-status')
      .send({ status: 'in_progress' })
      .expect(404);

    const body = response.body as { code: string; message: string };
    expect(body.code).toBe('OBLIGATION_NOT_FOUND');
    expect(typeof body.message).toBe('string');
  });
});
