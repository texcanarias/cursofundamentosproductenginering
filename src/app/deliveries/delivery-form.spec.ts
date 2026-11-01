import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { DeliveryForm } from './delivery-form';

const data = { familiaId: 'FAM-001', fecha: '2026-01-15', observacion: 'Entrega completa' };

describe('Delivery form', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [DeliveryForm] }));

  it('emits all fields with a past date unchanged', () => {
    const fixture = TestBed.createComponent(DeliveryForm);
    fixture.detectChanges();
    const save = vi.spyOn(fixture.componentInstance.save, 'emit');
    fixture.componentInstance.form.setValue(data);
    fixture.componentInstance.submit();
    expect(save).toHaveBeenCalledWith(data);
  });

  it('accepts an empty observation', () => {
    const fixture = TestBed.createComponent(DeliveryForm);
    fixture.detectChanges();
    const save = vi.spyOn(fixture.componentInstance.save, 'emit');
    fixture.componentInstance.form.setValue({ ...data, observacion: '' });
    fixture.componentInstance.submit();
    expect(save).toHaveBeenCalledWith({ ...data, observacion: '' });
  });

  it('shows field errors, focuses an invalid field and blocks invalid submissions', () => {
    const fixture = TestBed.createComponent(DeliveryForm);
    fixture.detectChanges();
    const save = vi.spyOn(fixture.componentInstance.save, 'emit');
    fixture.componentInstance.form.setValue({ ...data, familiaId: '   ', fecha: '' });
    fixture.componentInstance.submit();
    fixture.detectChanges();
    expect(save).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Revisa');
    expect(fixture.nativeElement.querySelectorAll('mat-error')).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('input[aria-invalid="true"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('input:focus')).toBeTruthy();
  });

  it('preserves form values and prevents duplicate submissions while pending', () => {
    const fixture = TestBed.createComponent(DeliveryForm);
    fixture.detectChanges();
    fixture.componentInstance.form.setValue(data);
    fixture.componentRef.setInput('pending', true);
    fixture.detectChanges();
    const save = vi.spyOn(fixture.componentInstance.save, 'emit');
    fixture.componentInstance.submit();
    expect(save).not.toHaveBeenCalled();
    expect(fixture.componentInstance.form.getRawValue()).toEqual(data);
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(true);
  });
});
