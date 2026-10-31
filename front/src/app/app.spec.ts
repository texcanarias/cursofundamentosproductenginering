import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders the brand with an accessible home link and decorative symbol', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const brand = compiled.querySelector('header a.brand');
    expect(brand?.getAttribute('aria-label')).toBe('A la par Gestión comunitaria, inicio');
    expect(brand?.textContent).toContain('A la par');
    expect(brand?.querySelector('img')?.getAttribute('alt')).toBe('');
    expect(compiled.querySelector('.brand-purpose')?.textContent).toBe('Gestión comunitaria');
  });

  it('renders a main landmark and skip link', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('main#main-content')).toBeTruthy();
    expect(compiled.querySelector('a.skip-link')?.textContent?.trim()).toBe('Saltar al contenido');
  });
});
