import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';
import { DeleteDeliveryDialog } from './delete-delivery-dialog';

const delivery = {
  id: 'one',
  familiaId: 'FAM-001',
  fecha: '2026-10-31',
  observacion: 'Entrega completa',
};
const ref = { close: vi.fn(), disableClose: false };
let http: HttpTestingController;

beforeEach(() => {
  vi.clearAllMocks();
  ref.disableClose = false;
  TestBed.configureTestingModule({
    imports: [DeleteDeliveryDialog],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: MAT_DIALOG_DATA, useValue: delivery },
      { provide: MatDialogRef, useValue: ref },
    ],
  });
  http = TestBed.inject(HttpTestingController);
});

afterEach(() => http.verify());

describe('Delete delivery confirmation', () => {
  it('only closes successfully after DELETE completes and prevents duplicates', () => {
    const dialog = TestBed.createComponent(DeleteDeliveryDialog).componentInstance;
    dialog.confirm();
    dialog.confirm();
    expect(dialog.pending()).toBe(true);
    expect(ref.disableClose).toBe(true);
    expect(ref.close).not.toHaveBeenCalled();
    http
      .expectOne({ method: 'DELETE', url: '/api/entregas/one' })
      .flush(null, { status: 204, statusText: 'No Content' });
    expect(ref.close).toHaveBeenCalledWith('deleted');
  });

  it('keeps the confirmation open after a network error and permits retry', () => {
    const dialog = TestBed.createComponent(DeleteDeliveryDialog).componentInstance;
    dialog.confirm();
    http.expectOne('/api/entregas/one').error(new ProgressEvent('error'));
    expect(ref.close).not.toHaveBeenCalled();
    expect(dialog.error()).toContain('No hay conexión');
    expect(dialog.pending()).toBe(false);
    expect(ref.disableClose).toBe(false);
    dialog.confirm();
    http.expectOne('/api/entregas/one').flush(null, { status: 204, statusText: 'No Content' });
    expect(ref.close).toHaveBeenCalledWith('deleted');
  });

  it('distinguishes a missing delivery from a successful deletion', () => {
    const dialog = TestBed.createComponent(DeleteDeliveryDialog).componentInstance;
    dialog.confirm();
    http.expectOne('/api/entregas/one').flush({}, { status: 404, statusText: 'Not Found' });
    expect(dialog.missing()).toBe(true);
    expect(dialog.error()).toContain('ya no está disponible');
    expect(ref.close).not.toHaveBeenCalled();
  });
});
