import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  inject,
  Injector,
  signal,
  type WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize, type Observable } from 'rxjs';
import { isNotFound } from '../shared/errors';
import { DeleteLotDialog } from './delete-lot-dialog';
import { expiryLabel, expiryStatus, lotError, type Lot, type LotData } from './lot';
import { LotApi } from './lot-api';
import { LotForm } from './lot-form';

type View = 'list' | 'detail' | 'create' | 'edit';

@Component({
  selector: 'app-inventory-page',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    LotForm,
  ],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory.scss',
})
export class InventoryPage {
  private readonly api = inject(LotApi);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);
  readonly lots = signal<Lot[]>([]);
  readonly selected = signal<Lot | null>(null);
  readonly view = signal<View>('list');
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly missing = signal(false);
  readonly notice = signal('');
  readonly expiryLabel = expiryLabel;
  readonly expiryStatus = expiryStatus;
  readonly title = computed(
    () =>
      ({
        list: 'Inventario',
        detail: 'Detalle del producto',
        create: 'Añadir producto',
        edit: 'Editar producto',
      })[this.view()],
  );

  constructor() {
    this.load();
  }

  load(): void {
    if (this.loading()) return;
    this.run(this.api.list(), this.loading, (lots) => this.lots.set(lots));
  }

  create(): void {
    this.selected.set(null);
    this.view.set('create');
    this.error.set('');
    this.notice.set('');
    this.missing.set(false);
    this.focusTitle();
  }

  show(lot: Lot, view: 'detail' | 'edit'): void {
    if (this.loading()) return;
    this.view.set(view);
    this.notice.set('');
    this.run(this.api.get(lot.id), this.loading, (selected) => this.selected.set(selected));
    this.focusTitle();
  }

  back(): void {
    this.view.set('list');
    this.selected.set(null);
    this.load();
    this.focusTitle();
  }

  save(data: LotData): void {
    if (this.saving()) return;
    const lot = this.selected();
    const operation =
      this.view() === 'edit' && lot ? this.api.update(lot.id, data) : this.api.create(data);
    this.run(operation, this.saving, () => {
      this.notice.set('Producto guardado.');
      this.back();
    });
  }

  remove(lot: Lot): void {
    const dialog = this.dialog.open(DeleteLotDialog, {
      data: lot,
      width: '32rem',
      maxWidth: 'calc(100vw - 2rem)',
      restoreFocus: true,
    });
    dialog
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: string | undefined) => this.afterDelete(result));
  }

  private afterDelete(result: string | undefined): void {
    if (!result) return;
    this.notice.set(
      result === 'deleted' ? 'Partida eliminada.' : 'Esta partida ya no está disponible.',
    );
    this.back();
  }

  private run<T>(
    operation: Observable<T>,
    busy: WritableSignal<boolean>,
    next: (value: T) => void,
  ): void {
    busy.set(true);
    this.error.set('');
    this.missing.set(false);
    operation
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => busy.set(false)),
      )
      .subscribe({
        next,
        error: (error: unknown) => {
          this.error.set(lotError(error));
          this.missing.set(isNotFound(error));
        },
      });
  }

  private focusTitle(): void {
    afterNextRender(() => this.document.getElementById('view-title')?.focus(), {
      injector: this.injector,
    });
  }
}
