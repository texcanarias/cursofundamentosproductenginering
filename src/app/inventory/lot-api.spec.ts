import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LotApi } from './lot-api';

const data = { nombreProducto: 'Arroz', caducidad: '2027-03-15', ubicacion: 'Almacén A' };
const lot = { id: 'lot-1', ...data };
let api: LotApi;
let http: HttpTestingController;

beforeEach(() => {
  TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
  api = TestBed.inject(LotApi);
  http = TestBed.inject(HttpTestingController);
});

afterEach(() => http.verify());

describe('Lot HTTP contract', () => {
  it('lists lots and retrieves an individual lot', () => {
    api.list().subscribe((lots) => expect(lots).toEqual([lot]));
    http.expectOne({ method: 'GET', url: '/api/lotes' }).flush([lot]);
    api.get(lot.id).subscribe((result) => expect(result).toEqual(lot));
    http.expectOne({ method: 'GET', url: '/api/lotes/lot-1' }).flush(lot);
  });

  it('posts the three editable fields with an unchanged date string', () => {
    api.create(data).subscribe((result) => expect(result).toEqual(lot));
    const request = http.expectOne({ method: 'POST', url: '/api/lotes' });
    expect(request.request.body).toEqual(data);
    request.flush(lot, { status: 201, statusText: 'Created' });
  });

  it('puts all three fields to the selected identifier', () => {
    api.update(lot.id, data).subscribe((result) => expect(result).toEqual(lot));
    const request = http.expectOne({ method: 'PUT', url: '/api/lotes/lot-1' });
    expect(request.request.body).toEqual(data);
    request.flush(lot);
  });

  it('deletes only the selected identifier and encodes path segments', () => {
    api.delete('lot/1').subscribe();
    http
      .expectOne({ method: 'DELETE', url: '/api/lotes/lot%2F1' })
      .flush(null, { status: 204, statusText: 'No Content' });
  });

  it('propagates errors without retrying writes', () => {
    api.create(data).subscribe({ error: (error) => expect(error.status).toBe(500) });
    http.expectOne('/api/lotes').flush({}, { status: 500, statusText: 'Error' });
    http.expectNone('/api/lotes');
  });
});
