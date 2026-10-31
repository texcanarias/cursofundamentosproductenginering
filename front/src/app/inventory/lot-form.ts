import { Component, effect, ElementRef, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { calendarDate, requiredText, type Lot, type LotData } from './lot';

@Component({
  selector: 'app-lot-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './lot-form.html',
  styleUrl: './inventory.scss',
})
export class LotForm {
  readonly lot = input<Lot | null>(null);
  readonly pending = input(false);
  readonly save = output<LotData>();
  readonly cancel = output<void>();
  readonly submitted = signal(false);
  private readonly element: ElementRef<HTMLElement> = inject(ElementRef);
  readonly form = inject(FormBuilder).nonNullable.group({
    nombreProducto: ['', requiredText],
    caducidad: ['', calendarDate],
    ubicacion: ['', requiredText],
  });

  constructor() {
    effect(() =>
      this.form.reset(this.lot() ?? { nombreProducto: '', caducidad: '', ubicacion: '' }),
    );
  }

  submit(): void {
    if (this.pending()) return;
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) return this.focusInvalidField();
    this.save.emit(this.form.getRawValue());
  }

  private focusInvalidField(): void {
    const field = Object.entries(this.form.controls).find(([, control]) => control.invalid)?.[0];
    this.element.nativeElement
      .querySelector<HTMLInputElement>(`[formControlName="${field}"]`)
      ?.focus();
  }
}
