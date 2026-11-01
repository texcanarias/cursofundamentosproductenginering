import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { expiryLabel, lotError, type Lot } from './lot';
import { LotApi } from './lot-api';

@Component({
  selector: 'app-delete-lot-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-lot-dialog.html',
  styleUrl: './inventory.scss',
})
export class DeleteLotDialog {
  readonly lot = inject<Lot>(MAT_DIALOG_DATA);
  readonly ref = inject(MatDialogRef<DeleteLotDialog>);
  private readonly api = inject(LotApi);
  private readonly destroyRef = inject(DestroyRef);
  readonly pending = signal(false);
  readonly error = signal('');
  readonly missing = signal(false);
  readonly expiryLabel = expiryLabel;

  confirm(): void {
    if (this.pending()) return;
    this.pending.set(true);
    this.error.set('');
    this.ref.disableClose = true;
    this.api
      .delete(this.lot.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pending.set(false);
          this.ref.disableClose = false;
        }),
      )
      .subscribe({
        next: () => this.ref.close('deleted'),
        error: (error: HttpErrorResponse) => {
          this.error.set(lotError(error));
          this.missing.set(error.status === 404);
        },
      });
  }
}
