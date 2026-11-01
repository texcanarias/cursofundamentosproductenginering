import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { LotForm } from './lot-form';

const data = { nombreProducto: 'Arroz', caducidad: '1999-01-01', ubicacion: 'Almacén A' };

describe('Lot form', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [LotForm] }));

  it('emits all fields with a past date unchanged', () => {
    const fixture = TestBed.createComponent(LotForm);
    fixture.detectChanges();
    const save = vi.spyOn(fixture.componentInstance.save, 'emit');
    fixture.componentInstance.form.setValue(data);
    fixture.componentInstance.submit();
    expect(save).toHaveBeenCalledWith(data);
  });

  it('loads the selected lot without emitting any changes', () => {
    const fixture = TestBed.createComponent(LotForm);
    fixture.componentRef.setInput('lot', { id: 'selected', ...data });
    fixture.detectChanges();
    expect(fixture.componentInstance.form.getRawValue()).toEqual(data);
  });

  it('shows field errors, focuses an invalid field and blocks invalid submissions', () => {
    const fixture = TestBed.createComponent(LotForm);
    fixture.detectChanges();
    const save = vi.spyOn(fixture.componentInstance.save, 'emit');
    fixture.componentInstance.form.setValue({ ...data, nombreProducto: '   ', caducidad: '' });
    fixture.componentInstance.submit();
    fixture.detectChanges();
    expect(save).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Revisa');
    expect(fixture.nativeElement.querySelector('input[aria-invalid="true"]')).toBeTruthy();
  });

  it('preserves form values and prevents duplicate submissions while pending', () => {
    const fixture = TestBed.createComponent(LotForm);
    fixture.detectChanges();
    fixture.componentInstance.form.setValue(data);
    fixture.componentRef.setInput('pending', true);
    fixture.detectChanges();
    const save = vi.spyOn(fixture.componentInstance.save, 'emit');
    fixture.componentInstance.submit();
    expect(save).not.toHaveBeenCalled();
    expect(fixture.componentInstance.form.getRawValue()).toEqual(data);
    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
  });
});
