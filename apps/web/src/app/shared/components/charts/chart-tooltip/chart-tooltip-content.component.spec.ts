import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ChartTooltipContentComponent} from './chart-tooltip-content.component';

describe('ChartTooltipContentComponent', () => {
  let fixture: ComponentFixture<ChartTooltipContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartTooltipContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartTooltipContentComponent);
    fixture.componentRef.setInput('label', 'Ene');
    fixture.componentRef.setInput('value', '1,200');
  });

  it('should create', async () => {
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders label and value', async () => {
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Ene');
    expect(el.textContent).toContain('1,200');
  });

  it('omits color indicator when color is not set', async () => {
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const span = el.querySelector('span.inline-block');
    expect(span).toBeNull();
  });

  it('renders color indicator when color is provided', async () => {
    fixture.componentRef.setInput('color', '#ff0000');
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const span = el.querySelector('span.inline-block');
    expect(span).toBeTruthy();
    const style = span!.getAttribute('style')!;
    expect(style).toContain('background-color');
    expect(style).toContain('rgb(255, 0, 0)');
  });
});
