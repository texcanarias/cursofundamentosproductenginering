import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { describe, expect, it, vi } from 'vitest';
import { DeleteDeliveryDialog } from './delete-delivery-dialog';

const KEY = 'a-la-par:entregas';
const delivery = {
  id: 'one',
  familiaId: 'FAM-001',
  fecha: '2026-10-31',
  observacion: 'Entrega completa',
};
const ref = { close: vi.fn(), disableClose: false };

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  ref.close.mockClear();
  ref.disableClose = false;
  TestBed.configureTestingModule({
    imports: [DeleteDeliveryDialog],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: delivery },
      { provide: MatDialogRef, useValue: ref },
    ],
  });
});

describe('Delete delivery confirmation', () => {
  it('closes successfully after the delivery is removed from storage', () => {
    localStorage.setItem(KEY, JSON.stringify([delivery]));
    const dialog = TestBed.createComponent(DeleteDeliveryDialog).componentInstance;
    dialog.confirm();
    expect(ref.close).toHaveBeenCalledWith('deleted');
    expect(JSON.parse(localStorage.getItem(KEY) ?? '[]')).toEqual([]);
  });

  it('keeps the confirmation open after a storage failure and permits retry', () => {
    localStorage.setItem(KEY, JSON.stringify([delivery]));
    const dialog = TestBed.createComponent(DeleteDeliveryDialog).componentInstance;
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    dialog.confirm();
    expect(ref.close).not.toHaveBeenCalled();
    expect(dialog.error()).toContain('No se pudieron guardar');
    expect(dialog.pending()).toBe(false);
    expect(ref.disableClose).toBe(false);

    spy.mockRestore();
    dialog.confirm();
    expect(ref.close).toHaveBeenCalledWith('deleted');
  });

  it('distinguishes a missing delivery from a successful deletion', () => {
    const dialog = TestBed.createComponent(DeleteDeliveryDialog).componentInstance;
    dialog.confirm();
    expect(dialog.missing()).toBe(true);
    expect(dialog.error()).toContain('ya no está disponible');
    expect(ref.close).not.toHaveBeenCalled();
  });
});
