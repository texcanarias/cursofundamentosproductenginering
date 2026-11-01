import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { DeleteDeliveryDialog } from './delete-delivery-dialog';
import { DeliveriesPage } from './deliveries-page';

const data = { familiaId: 'FAM-001', fecha: '2026-10-31', observacion: 'Entrega completa' };
const delivery = { id: 'one', ...data };
const dialog = { open: vi.fn() };
let http: HttpTestingController;

beforeEach(() => {
  vi.clearAllMocks();
  dialog.open.mockReturnValue({ afterClosed: () => of('deleted') });
  TestBed.configureTestingModule({
    imports: [DeliveriesPage],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: MatDialog, useValue: dialog },
    ],
  });
  http = TestBed.inject(HttpTestingController);
});

afterEach(() => http.verify());

describe('Deliveries states', () => {
  it('distinguishes loading, empty list and populated list', () => {
    const fixture = TestBed.createComponent(DeliveriesPage);
    fixture.detectChanges();
    expect(fixture.componentInstance.loading()).toBe(true);
    http.expectOne('/api/entregas').flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No hay entregas registradas');
    fixture.componentInstance.load();
    http
      .expectOne('/api/entregas')
      .flush([delivery, { ...delivery, id: 'two', fecha: '2026-01-15' }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('article')).toHaveLength(2);
  });

  it('does not present a failed query as an empty list and can retry', () => {
    const fixture = TestBed.createComponent(DeliveriesPage);
    http.expectOne('/api/entregas').flush({}, { status: 500, statusText: 'Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('No hay entregas registradas');
    fixture.componentInstance.load();
    http.expectOne('/api/entregas').flush([delivery]);
    expect(fixture.componentInstance.error()).toBe('');
  });

  it('loads the selected identifier for the detail view', () => {
    const fixture = TestBed.createComponent(DeliveriesPage);
    http.expectOne('/api/entregas').flush([delivery]);
    fixture.componentInstance.show(delivery);
    http.expectOne('/api/entregas/one').flush(delivery);
    expect(fixture.componentInstance.selected()).toEqual(delivery);
    expect(fixture.componentInstance.view()).toBe('detail');
  });

  it('reports a missing delivery and refreshes the list when returning', () => {
    const fixture = TestBed.createComponent(DeliveriesPage);
    http.expectOne('/api/entregas').flush([delivery]);
    fixture.componentInstance.show(delivery);
    http.expectOne('/api/entregas/one').flush({}, { status: 404, statusText: 'Not Found' });
    expect(fixture.componentInstance.missing()).toBe(true);
    expect(fixture.componentInstance.error()).toContain('ya no está disponible');
    fixture.componentInstance.back();
    http.expectOne('/api/entregas').flush([]);
    expect(fixture.componentInstance.missing()).toBe(false);
  });

  it('registers a delivery once and confirms success only after the backend responds', () => {
    const fixture = TestBed.createComponent(DeliveriesPage);
    http.expectOne('/api/entregas').flush([]);
    fixture.componentInstance.create();
    fixture.componentInstance.save(data);
    fixture.componentInstance.save(data);
    http
      .expectOne({ method: 'POST', url: '/api/entregas' })
      .flush(delivery, { status: 201, statusText: 'Created' });
    http.expectOne('/api/entregas').flush([delivery]);
    fixture.detectChanges();
    expect(fixture.componentInstance.view()).toBe('list');
    expect(fixture.componentInstance.notice()).toBe('Entrega registrada.');
    expect(fixture.nativeElement.textContent).toContain(data.familiaId);
  });

  it('keeps the create form state after a failed save and does not claim success', () => {
    const fixture = TestBed.createComponent(DeliveriesPage);
    http.expectOne('/api/entregas').flush([]);
    fixture.componentInstance.create();
    fixture.componentInstance.save(data);
    http
      .expectOne({ method: 'POST', url: '/api/entregas' })
      .flush({}, { status: 500, statusText: 'Error' });
    expect(fixture.componentInstance.view()).toBe('create');
    expect(fixture.componentInstance.saving()).toBe(false);
    expect(fixture.componentInstance.notice()).toBe('');
    expect(fixture.componentInstance.error()).toBeTruthy();
  });

  it('opens the delete confirmation with the selected delivery', () => {
    const fixture = TestBed.createComponent(DeliveriesPage);
    http.expectOne('/api/entregas').flush([delivery]);
    fixture.componentInstance.remove(delivery);
    expect(dialog.open).toHaveBeenCalledWith(
      DeleteDeliveryDialog,
      expect.objectContaining({ data: delivery }),
    );
    http.expectOne('/api/entregas').flush([]);
    expect(fixture.componentInstance.notice()).toBe('Entrega eliminada.');
  });

  it('informs when the delivery is already gone after the confirmation closes', () => {
    dialog.open.mockReturnValueOnce({ afterClosed: () => of('missing') });
    const fixture = TestBed.createComponent(DeliveriesPage);
    http.expectOne('/api/entregas').flush([delivery]);
    fixture.componentInstance.remove(delivery);
    http.expectOne('/api/entregas').flush([]);
    expect(fixture.componentInstance.notice()).toBe('Esta entrega ya no está disponible.');
  });
});
