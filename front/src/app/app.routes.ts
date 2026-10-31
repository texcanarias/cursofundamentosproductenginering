import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inventario' },
  {
    path: 'inventario',
    title: 'Inventario · A la par',
    loadComponent: () =>
      import('./inventory/inventory-page').then((module) => module.InventoryPage),
  },
  { path: '**', redirectTo: 'inventario' },
];
