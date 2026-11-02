import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { InventoryPage } from './inventory-page';

const KEY = 'a-la-par:lotes';
const data = { nombreProducto: 'Arroz', caducidad: '2027-03-15', ubicacion: 'Almacén A' };
const lot = { id: 'one', ...data };

function save(records: unknown[]): void {
  localStorage.setItem(KEY, JSON.stringify(records));
}

function createPage() {
  const fixture = TestBed.createComponent(InventoryPage);
  fixture.detectChanges();
  return fixture;
}

beforeEach(() => {
  localStorage.clear();
  TestBed.configureTestingModule({ imports: [InventoryPage] });
});

afterEach(() => vi.restoreAllMocks());

describe('Inventory states', () => {
  it('distinguishes empty and populated inventory', () => {
    const fixture = createPage();
    expect(fixture.nativeElement.textContent).toContain('No hay productos registrados');

    save([lot, { ...lot, id: 'two' }]);
    fixture.componentInstance.load();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('article')).toHaveLength(2);
  });

  it('does not present unreadable data as an empty inventory and can retry', () => {
    localStorage.setItem(KEY, '{invalid');
    const fixture = createPage();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('No hay productos registrados');

    save([lot]);
    fixture.componentInstance.load();
    fixture.detectChanges();
    expect(fixture.componentInstance.error()).toBe('');
    expect(fixture.nativeElement.querySelectorAll('article')).toHaveLength(1);
  });

  it('loads the selected identifier for detail and edit views', () => {
    save([lot]);
    const fixture = createPage();
    fixture.componentInstance.show(lot, 'detail');
    expect(fixture.componentInstance.selected()).toEqual(lot);
    expect(fixture.componentInstance.view()).toBe('detail');
    fixture.componentInstance.show(lot, 'edit');
    expect(fixture.componentInstance.view()).toBe('edit');
  });

  it('presents the expiry status with text and groups the card actions', () => {
    save([
      { ...lot, id: 'expired', caducidad: '2000-01-01' },
      { ...lot, id: 'future', caducidad: '2099-01-01' },
    ]);
    const fixture = createPage();
    fixture.detectChanges();
    const [expired, future] = fixture.nativeElement.querySelectorAll('article');
    expect(expired.querySelector('.expiry-state')?.textContent).toContain('Caducado');
    expect(future.querySelector('.expiry-state')?.textContent).toContain('más de 30 días');
    expect(expired.querySelector('.data-fields')).toBeTruthy();
    expect(expired.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe(
      'Acciones de Arroz',
    );
  });

  it('keeps the entered values after a failed save and does not claim success', () => {
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

  it('reports a missing lot and refreshes the inventory when returning', () => {
    save([lot]);
    const fixture = createPage();
    save([]);
    fixture.componentInstance.show(lot, 'edit');
    expect(fixture.componentInstance.missing()).toBe(true);
    fixture.componentInstance.back();
    expect(fixture.componentInstance.missing()).toBe(false);
  });
});
