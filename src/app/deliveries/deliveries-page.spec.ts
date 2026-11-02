import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { DeleteDeliveryDialog } from './delete-delivery-dialog';
import { DeliveriesPage } from './deliveries-page';

const KEY = 'a-la-par:entregas';
const data = { familiaId: 'FAM-001', fecha: '2026-10-31', observacion: 'Entrega completa' };
const delivery = { id: 'one', ...data };
const dialog = { open: vi.fn() };

function save(records: unknown[]): void {
  localStorage.setItem(KEY, JSON.stringify(records));
}

function createPage() {
  const fixture = TestBed.createComponent(DeliveriesPage);
  fixture.detectChanges();
  return fixture;
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  dialog.open.mockReturnValue({ afterClosed: () => of('deleted') });
  TestBed.configureTestingModule({
    imports: [DeliveriesPage],
    providers: [{ provide: MatDialog, useValue: dialog }],
  });
});

afterEach(() => vi.restoreAllMocks());

describe('Deliveries states', () => {
  it('distinguishes empty and populated list', () => {
    const fixture = createPage();
    expect(fixture.nativeElement.textContent).toContain('No hay entregas registradas');

    save([delivery, { ...delivery, id: 'two', fecha: '2026-01-15' }]);
    fixture.componentInstance.load();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('article')).toHaveLength(2);
  });

  it('does not present unreadable data as an empty list and can retry', () => {
    localStorage.setItem(KEY, '{invalid');
    const fixture = createPage();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('No hay entregas registradas');

    save([delivery]);
    fixture.componentInstance.load();
    fixture.detectChanges();
    expect(fixture.componentInstance.error()).toBe('');
    expect(fixture.nativeElement.querySelectorAll('article')).toHaveLength(1);
  });

  it('loads the selected identifier for the detail view', () => {
    save([delivery]);
    const fixture = createPage();
    fixture.componentInstance.show(delivery);
    expect(fixture.componentInstance.selected()).toEqual(delivery);
    expect(fixture.componentInstance.view()).toBe('detail');
  });

  it('presents the date first and groups the card actions', () => {
    save([delivery]);
    const fixture = createPage();
    fixture.detectChanges();
    const article = fixture.nativeElement.querySelector('article');
    expect(article.querySelector('.data-field--primary')?.textContent).toContain(
      'Fecha de entrega',
    );
    expect(article.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe(
      'Acciones de la entrega de FAM-001',
    );
  });

  it('reports a missing delivery and refreshes the list when returning', () => {
    save([delivery]);
    const fixture = createPage();
    save([]);
    fixture.componentInstance.show(delivery);
    expect(fixture.componentInstance.missing()).toBe(true);
    expect(fixture.componentInstance.error()).toContain('ya no está disponible');
    fixture.componentInstance.back();
    expect(fixture.componentInstance.missing()).toBe(false);
  });

  it('registers a delivery and confirms success', () => {
    const fixture = createPage();
    fixture.componentInstance.create();
    fixture.componentInstance.save(data);
    fixture.detectChanges();
    expect(fixture.componentInstance.view()).toBe('list');
    expect(fixture.componentInstance.notice()).toBe('Entrega registrada.');
    expect(fixture.nativeElement.textContent).toContain(data.familiaId);
  });

  it('keeps the create form state after a failed save and does not claim success', () => {
    const fixture = createPage();
    fixture.componentInstance.create();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    fixture.componentInstance.save(data);
    expect(fixture.componentInstance.view()).toBe('create');
    expect(fixture.componentInstance.saving()).toBe(false);
    expect(fixture.componentInstance.notice()).toBe('');
    expect(fixture.componentInstance.error()).toContain('No se pudieron guardar');
  });

  it('opens the delete confirmation with the selected delivery', () => {
    save([delivery]);
    const fixture = createPage();
    fixture.componentInstance.remove(delivery);
    expect(dialog.open).toHaveBeenCalledWith(
      DeleteDeliveryDialog,
      expect.objectContaining({ data: delivery }),
    );
    expect(fixture.componentInstance.notice()).toBe('Entrega eliminada.');
  });

  it('informs when the delivery is already gone after the confirmation closes', () => {
    dialog.open.mockReturnValueOnce({ afterClosed: () => of('missing') });
    save([delivery]);
    const fixture = createPage();
    fixture.componentInstance.remove(delivery);
    expect(fixture.componentInstance.notice()).toBe('Esta entrega ya no está disponible.');
  });
});
