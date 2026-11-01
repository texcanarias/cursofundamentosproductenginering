import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DeliveryApi } from './delivery-api';

const data = { familiaId: 'FAM-001', fecha: '2026-10-31', observacion: 'Entrega completa' };
const delivery = { id: 'delivery-1', ...data };
let api: DeliveryApi;
let http: HttpTestingController;

beforeEach(() => {
  TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
  api = TestBed.inject(DeliveryApi);
  http = TestBed.inject(HttpTestingController);
});

afterEach(() => http.verify());

describe('Delivery HTTP contract', () => {
  it('lists deliveries and retrieves an individual delivery', () => {
    api.list().subscribe((deliveries) => expect(deliveries).toEqual([delivery]));
    http.expectOne({ method: 'GET', url: '/api/entregas' }).flush([delivery]);
    api.get(delivery.id).subscribe((result) => expect(result).toEqual(delivery));
    http.expectOne({ method: 'GET', url: '/api/entregas/delivery-1' }).flush(delivery);
  });

  it('posts the three fields with an unchanged date string', () => {
    api.create(data).subscribe((result) => expect(result).toEqual(delivery));
    const request = http.expectOne({ method: 'POST', url: '/api/entregas' });
    expect(request.request.body).toEqual(data);
    request.flush(delivery, { status: 201, statusText: 'Created' });
  });

  it('deletes only the selected delivery and encodes path segments', () => {
    api.delete('delivery/1').subscribe();
    http
      .expectOne({ method: 'DELETE', url: '/api/entregas/delivery%2F1' })
      .flush(null, { status: 204, statusText: 'No Content' });
  });

  it('propagates errors without retrying writes', () => {
    api.create(data).subscribe({ error: (error) => expect(error.status).toBe(500) });
    http.expectOne('/api/entregas').flush({}, { status: 500, statusText: 'Error' });
    http.expectNone('/api/entregas');
  });
});
