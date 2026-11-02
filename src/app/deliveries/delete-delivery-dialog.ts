import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { isNotFound } from '../shared/errors';
import { deliveryDateLabel, deliveryError, type Delivery } from './delivery';
import { DeliveryApi } from './delivery-api';

@Component({
  selector: 'app-delete-delivery-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-delivery-dialog.html',
  styleUrl: './deliveries.scss',
})
export class DeleteDeliveryDialog {
  readonly delivery = inject<Delivery>(MAT_DIALOG_DATA);
  readonly ref = inject(MatDialogRef<DeleteDeliveryDialog>);
  private readonly api = inject(DeliveryApi);
  private readonly destroyRef = inject(DestroyRef);
  readonly pending = signal(false);
  readonly error = signal('');
  readonly missing = signal(false);
  readonly deliveryDateLabel = deliveryDateLabel;

  confirm(): void {
    if (this.pending()) return;
    this.pending.set(true);
    this.error.set('');
    this.ref.disableClose = true;
    this.api
      .delete(this.delivery.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pending.set(false);
          this.ref.disableClose = false;
        }),
      )
      .subscribe({
        next: () => this.ref.close('deleted'),
        error: (error: unknown) => {
          this.error.set(deliveryError(error));
          this.missing.set(isNotFound(error));
        },
      });
  }
}
