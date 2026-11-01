import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
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
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize, type Observable } from 'rxjs';
import { DeleteDeliveryDialog } from './delete-delivery-dialog';
import { DeliveryApi } from './delivery-api';
import { deliveryDateLabel, deliveryError, type Delivery, type DeliveryData } from './delivery';
import { DeliveryForm } from './delivery-form';

type View = 'list' | 'detail' | 'create';

@Component({
  selector: 'app-deliveries-page',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    DeliveryForm,
  ],
  templateUrl: './deliveries-page.html',
  styleUrl: './deliveries.scss',
})
export class DeliveriesPage {
  private readonly api = inject(DeliveryApi);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);
  readonly deliveries = signal<Delivery[]>([]);
  readonly selected = signal<Delivery | null>(null);
  readonly view = signal<View>('list');
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly missing = signal(false);
  readonly notice = signal('');
  readonly deliveryDateLabel = deliveryDateLabel;
  readonly title = computed(
    () =>
      ({
        list: 'Entregas',
        detail: 'Detalle de la entrega',
        create: 'Registrar entrega',
      })[this.view()],
  );

  constructor() {
    this.load();
  }

  load(): void {
    if (this.loading()) return;
    this.run(this.api.list(), this.loading, (deliveries) => this.deliveries.set(deliveries));
  }

  create(): void {
    this.selected.set(null);
    this.view.set('create');
    this.error.set('');
    this.notice.set('');
    this.missing.set(false);
    this.focusTitle();
  }

  show(delivery: Delivery): void {
    if (this.loading()) return;
    this.view.set('detail');
    this.notice.set('');
    this.run(this.api.get(delivery.id), this.loading, (selected) => this.selected.set(selected));
    this.focusTitle();
  }

  back(): void {
    this.view.set('list');
    this.selected.set(null);
    this.load();
    this.focusTitle();
  }

  save(data: DeliveryData): void {
    if (this.saving()) return;
    this.run(this.api.create(data), this.saving, () => {
      this.notice.set('Entrega registrada.');
      this.back();
    });
  }

  remove(delivery: Delivery): void {
    const dialog = this.dialog.open(DeleteDeliveryDialog, {
      data: delivery,
      width: '32rem',
      maxWidth: 'calc(100vw - 2rem)',
      restoreFocus: true,
    });
    dialog
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: string | undefined) => this.afterDelete(result));
  }

  detailLabel(delivery: Delivery): string {
    return `Ver detalle de la entrega de ${delivery.familiaId} del ${this.deliveryDateLabel(delivery.fecha)}`;
  }

  deleteLabel(delivery: Delivery): string {
    return `Eliminar entrega de ${delivery.familiaId} del ${this.deliveryDateLabel(delivery.fecha)}`;
  }

  private afterDelete(result: string | undefined): void {
    if (!result) return;
    this.notice.set(
      result === 'deleted' ? 'Entrega eliminada.' : 'Esta entrega ya no está disponible.',
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
      .subscribe({ next, error: (error: HttpErrorResponse) => this.fail(error) });
  }

  private fail(error: HttpErrorResponse): void {
    this.error.set(deliveryError(error));
    this.missing.set(error.status === 404);
  }

  private focusTitle(): void {
    afterNextRender(() => this.document.getElementById('view-title')?.focus(), {
      injector: this.injector,
    });
  }
}
