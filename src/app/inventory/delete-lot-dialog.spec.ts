import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { describe, expect, it, vi } from 'vitest';
import { DeleteLotDialog } from './delete-lot-dialog';

const KEY = 'a-la-par:lotes';
const lot = { id: 'one', nombreProducto: 'Arroz', caducidad: '2027-03-15', ubicacion: 'Almacén A' };
const ref = { close: vi.fn(), disableClose: false };

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  ref.close.mockClear();
  ref.disableClose = false;
  TestBed.configureTestingModule({
    imports: [DeleteLotDialog],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: lot },
      { provide: MatDialogRef, useValue: ref },
    ],
  });
});

describe('Delete confirmation', () => {
  it('closes successfully after the lot is removed from storage', () => {
    localStorage.setItem(KEY, JSON.stringify([lot]));
    const dialog = TestBed.createComponent(DeleteLotDialog).componentInstance;
    dialog.confirm();
    expect(ref.close).toHaveBeenCalledWith('deleted');
    expect(JSON.parse(localStorage.getItem(KEY) ?? '[]')).toEqual([]);
  });

  it('keeps the confirmation open after a storage failure and permits retry', () => {
    localStorage.setItem(KEY, JSON.stringify([lot]));
    const dialog = TestBed.createComponent(DeleteLotDialog).componentInstance;
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

  it('distinguishes a missing lot from a successful deletion', () => {
    const dialog = TestBed.createComponent(DeleteLotDialog).componentInstance;
    dialog.confirm();
    expect(dialog.missing()).toBe(true);
    expect(dialog.error()).toContain('ya no está disponible');
    expect(ref.close).not.toHaveBeenCalled();
  });
});
