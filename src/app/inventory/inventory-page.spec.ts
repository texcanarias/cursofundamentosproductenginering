import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { InventoryPage } from './inventory-page';

const data = { nombreProducto: 'Arroz', caducidad: '2027-03-15', ubicacion: 'Almacén A' };
const lot = { id: 'one', ...data };
let http: HttpTestingController;

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [InventoryPage],
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });
  http = TestBed.inject(HttpTestingController);
});

afterEach(() => http.verify());

describe('Inventory states', () => {
  it('distinguishes loading, empty inventory and populated inventory', () => {
    const fixture = TestBed.createComponent(InventoryPage);
    fixture.detectChanges();
    expect(fixture.componentInstance.loading()).toBe(true);
    http.expectOne('/api/lotes').flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No hay productos registrados');
    fixture.componentInstance.load();
    http.expectOne('/api/lotes').flush([lot, { ...lot, id: 'two' }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('article')).toHaveLength(2);
  });

  it('does not present a failed query as an empty inventory and can retry', () => {
    const fixture = TestBed.createComponent(InventoryPage);
    http.expectOne('/api/lotes').flush({}, { status: 500, statusText: 'Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('No hay productos registrados');
    fixture.componentInstance.load();
    http.expectOne('/api/lotes').flush([lot]);
    expect(fixture.componentInstance.error()).toBe('');
  });

  it('loads the selected identifier for detail and edit views', () => {
    const fixture = TestBed.createComponent(InventoryPage);
    http.expectOne('/api/lotes').flush([lot]);
    fixture.componentInstance.show(lot, 'detail');
    http.expectOne('/api/lotes/one').flush(lot);
    expect(fixture.componentInstance.selected()).toEqual(lot);
    expect(fixture.componentInstance.view()).toBe('detail');
    fixture.componentInstance.show(lot, 'edit');
    http.expectOne('/api/lotes/one').flush(lot);
    expect(fixture.componentInstance.view()).toBe('edit');
  });

  it('keeps entered values after a failed save and does not duplicate writes', () => {
    const fixture = TestBed.createComponent(InventoryPage);
    http.expectOne('/api/lotes').flush([]);
    fixture.componentInstance.create();
    fixture.detectChanges();
    const form = fixture.componentInstance;
    form.save(data);
    form.save(data);
    http
      .expectOne({ method: 'POST', url: '/api/lotes' })
      .flush({}, { status: 500, statusText: 'Error' });
    expect(form.view()).toBe('create');
    expect(form.saving()).toBe(false);
    expect(form.notice()).toBe('');
    expect(form.error()).toBeTruthy();
  });

  it('reports a missing lot and refreshes the inventory when returning', () => {
    const fixture = TestBed.createComponent(InventoryPage);
    http.expectOne('/api/lotes').flush([lot]);
    fixture.componentInstance.show(lot, 'edit');
    http.expectOne('/api/lotes/one').flush({}, { status: 404, statusText: 'Not Found' });
    expect(fixture.componentInstance.missing()).toBe(true);
    fixture.componentInstance.back();
    http.expectOne('/api/lotes').flush([]);
    expect(fixture.componentInstance.missing()).toBe(false);
  });
});
