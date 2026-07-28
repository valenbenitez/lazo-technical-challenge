import {
  assertCanSubmit,
  assertValidDueDate,
  canTransition,
  createObligation,
  getValidTransitions,
  isOverdue,
  Obligation,
  Status,
  TRANSITIONS,
  Type,
  updateObligationStatus,
} from './obligation';

const NOW = new Date('2026-07-28T12:00:00.000Z');
const TODAY = new Date('2026-07-28T08:00:00.000Z');
const YESTERDAY = new Date('2026-07-27T08:00:00.000Z');
const TOMORROW = new Date('2026-07-29T08:00:00.000Z');

function makeObligation(overrides: Partial<Obligation> = {}): Obligation {
  return {
    id: 'obl-1',
    type: Type.ANNUAL_REPORT,
    title: 'Annual report',
    description: '',
    status: Status.PENDING,
    dueDate: TOMORROW,
    owner: 'founder@example.com',
    requiresDocument: false,
    companyTaxId: '12-3456789',
    enabled: true,
    deletedAt: null,
    ...overrides,
  };
}

describe('obligation domain', () => {
  describe('canTransition / TRANSITIONS', () => {
    it.each([
      [Status.PENDING, Status.IN_PROGRESS],
      [Status.IN_PROGRESS, Status.SUBMITTED],
      [Status.IN_PROGRESS, Status.PENDING],
      [Status.SUBMITTED, Status.DONE],
      [Status.SUBMITTED, Status.IN_PROGRESS],
      [Status.DONE, Status.IN_PROGRESS],
    ])('given %s → %s, when canTransition, then true', (from, to) => {
      expect(canTransition(from, to)).toBe(true);
      expect(TRANSITIONS[from]).toContain(to);
    });

    it.each([
      [Status.PENDING, Status.SUBMITTED],
      [Status.PENDING, Status.DONE],
      [Status.IN_PROGRESS, Status.DONE],
      [Status.SUBMITTED, Status.PENDING],
      [Status.DONE, Status.PENDING],
      [Status.DONE, Status.SUBMITTED],
    ])('given %s → %s, when canTransition, then false', (from, to) => {
      expect(canTransition(from, to)).toBe(false);
      expect(TRANSITIONS[from]).not.toContain(to);
    });
  });

  describe('assertCanSubmit', () => {
    it('given requiresDocument false, when assertCanSubmit without url, then true', () => {
      expect(assertCanSubmit(false)).toBe(true);
      expect(assertCanSubmit(false, null)).toBe(true);
    });

    it('given requiresDocument true with documentUrl, when assertCanSubmit, then true', () => {
      expect(assertCanSubmit(true, 'https://docs.example/file.pdf')).toBe(true);
    });

    it('given requiresDocument true without documentUrl, when assertCanSubmit, then false', () => {
      expect(assertCanSubmit(true)).toBe(false);
      expect(assertCanSubmit(true, null)).toBe(false);
      expect(assertCanSubmit(true, '')).toBe(false);
    });
  });

  describe('getValidTransitions', () => {
    it('given IN_PROGRESS requiring document without url, when getValidTransitions, then SUBMITTED excluded', () => {
      const obligation = makeObligation({
        status: Status.IN_PROGRESS,
        requiresDocument: true,
        documentUrl: undefined,
      });

      expect(getValidTransitions(Status.IN_PROGRESS, obligation)).toEqual([
        Status.PENDING,
      ]);
      expect(getValidTransitions(Status.IN_PROGRESS, obligation)).not.toContain(
        Status.SUBMITTED,
      );
    });

    it('given IN_PROGRESS requiring document with url, when getValidTransitions, then SUBMITTED included', () => {
      const obligation = makeObligation({
        status: Status.IN_PROGRESS,
        requiresDocument: true,
        documentUrl: 'https://docs.example/file.pdf',
      });

      expect(getValidTransitions(Status.IN_PROGRESS, obligation)).toEqual([
        Status.SUBMITTED,
        Status.PENDING,
      ]);
    });

    it('given IN_PROGRESS without requiresDocument, when getValidTransitions, then full transition list', () => {
      const obligation = makeObligation({
        status: Status.IN_PROGRESS,
        requiresDocument: false,
      });

      expect(getValidTransitions(Status.IN_PROGRESS, obligation)).toEqual([
        ...TRANSITIONS[Status.IN_PROGRESS],
      ]);
    });

    it('given PENDING, when getValidTransitions, then TRANSITIONS[PENDING] unchanged', () => {
      const obligation = makeObligation({ status: Status.PENDING });

      expect(getValidTransitions(Status.PENDING, obligation)).toEqual([
        ...TRANSITIONS[Status.PENDING],
      ]);
    });
  });

  describe('assertValidDueDate', () => {
    it('given dueDate today, when assertValidDueDate with fixed now, then true', () => {
      expect(assertValidDueDate(TODAY, NOW)).toBe(true);
    });

    it('given dueDate tomorrow, when assertValidDueDate with fixed now, then true', () => {
      expect(assertValidDueDate(TOMORROW, NOW)).toBe(true);
    });

    it('given dueDate yesterday, when assertValidDueDate with fixed now, then false', () => {
      expect(assertValidDueDate(YESTERDAY, NOW)).toBe(false);
    });
  });

  describe('isOverdue', () => {
    it('given past dueDate and PENDING, when isOverdue, then true', () => {
      expect(
        isOverdue({ dueDate: YESTERDAY, status: Status.PENDING, now: NOW }),
      ).toBe(true);
    });

    it('given past dueDate and IN_PROGRESS, when isOverdue, then true', () => {
      expect(
        isOverdue({
          dueDate: YESTERDAY,
          status: Status.IN_PROGRESS,
          now: NOW,
        }),
      ).toBe(true);
    });

    it('given dueDate today, when isOverdue, then false', () => {
      expect(
        isOverdue({ dueDate: TODAY, status: Status.PENDING, now: NOW }),
      ).toBe(false);
    });

    it('given future dueDate, when isOverdue, then false', () => {
      expect(
        isOverdue({ dueDate: TOMORROW, status: Status.PENDING, now: NOW }),
      ).toBe(false);
    });

    it('given past dueDate and SUBMITTED, when isOverdue, then false', () => {
      expect(
        isOverdue({ dueDate: YESTERDAY, status: Status.SUBMITTED, now: NOW }),
      ).toBe(false);
    });

    it('given past dueDate and DONE, when isOverdue, then false', () => {
      expect(
        isOverdue({ dueDate: YESTERDAY, status: Status.DONE, now: NOW }),
      ).toBe(false);
    });
  });

  describe('createObligation', () => {
    it('given create data without description, when createObligation, then defaults pending/enabled/empty description', () => {
      const created = createObligation({
        type: Type.FRANCHISE_TAX,
        title: 'Franchise tax',
        dueDate: TOMORROW,
        owner: 'owner@example.com',
        requiresDocument: true,
        companyTaxId: '98-7654321',
      });

      expect(created).toEqual({
        type: Type.FRANCHISE_TAX,
        title: 'Franchise tax',
        description: '',
        dueDate: TOMORROW,
        owner: 'owner@example.com',
        requiresDocument: true,
        companyTaxId: '98-7654321',
        status: Status.PENDING,
        enabled: true,
        deletedAt: null,
      });
    });

    it('given create data with description, when createObligation, then keeps description', () => {
      const created = createObligation({
        type: Type.BOI_REPORT,
        title: 'BOI',
        description: 'Beneficial ownership',
        dueDate: TOMORROW,
        owner: 'owner@example.com',
        requiresDocument: false,
        companyTaxId: '11-1111111',
      });

      expect(created.description).toBe('Beneficial ownership');
      expect(created.status).toBe(Status.PENDING);
      expect(created.enabled).toBe(true);
    });
  });

  describe('updateObligationStatus', () => {
    it('given valid PENDING → IN_PROGRESS, when updateObligationStatus, then success', () => {
      const obligation = makeObligation({ status: Status.PENDING });

      expect(updateObligationStatus(obligation, Status.IN_PROGRESS)).toEqual({
        success: true,
      });
    });

    it('given invalid PENDING → SUBMITTED, when updateObligationStatus, then invalid transition error', () => {
      const obligation = makeObligation({ status: Status.PENDING });

      expect(updateObligationStatus(obligation, Status.SUBMITTED)).toEqual({
        success: false,
        error: 'Invalid status transition',
      });
    });

    it('given IN_PROGRESS requiring document without url → SUBMITTED, when updateObligationStatus, then document required error', () => {
      const obligation = makeObligation({
        status: Status.IN_PROGRESS,
        requiresDocument: true,
      });

      expect(updateObligationStatus(obligation, Status.SUBMITTED)).toEqual({
        success: false,
        error: 'Document is required for submission',
      });
    });

    it('given IN_PROGRESS requiring document with url → SUBMITTED, when updateObligationStatus, then success', () => {
      const obligation = makeObligation({
        status: Status.IN_PROGRESS,
        requiresDocument: true,
        documentUrl: 'https://docs.example/file.pdf',
      });

      expect(updateObligationStatus(obligation, Status.SUBMITTED)).toEqual({
        success: true,
      });
    });
  });
});
