import { Component, ElementRef, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { calendarDate, requiredText, type DeliveryData } from './delivery';

@Component({
  selector: 'app-delivery-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './delivery-form.html',
  styleUrl: './deliveries.scss',
})
export class DeliveryForm {
  readonly pending = input(false);
  readonly save = output<DeliveryData>();
  readonly cancelRequested = output<void>();
  readonly submitted = signal(false);
  private readonly element: ElementRef<HTMLElement> = inject(ElementRef);
  readonly form = inject(FormBuilder).nonNullable.group({
    familiaId: ['', requiredText],
    fecha: ['', calendarDate],
    observacion: [''],
  });

  submit(): void {
    if (this.pending()) return;
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) return this.focusInvalidField();
    this.save.emit(this.form.getRawValue());
  }

  private focusInvalidField(): void {
    const field = Object.entries(this.form.controls).find(([, control]) => control.invalid)?.[0];
    this.element.nativeElement.querySelector<HTMLElement>(`[formControlName="${field}"]`)?.focus();
  }
}
