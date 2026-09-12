import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { DonutChartComponent } from '../donut-chart/donut-chart.component';

// jsdom doesn't implement SVGPathElement.getTotalLength; LineChart's
// afterNextRender calls it asynchronously, so we polyfill it module-wide.
const NS_SVG = 'http://www.w3.org/2000/svg';
const testPath = document.createElementNS(NS_SVG, 'path');
const PathConstructor = Object.getPrototypeOf(testPath).constructor as {
  prototype: { getTotalLength?: () => number };
};
if (!PathConstructor.prototype.getTotalLength) {
  PathConstructor.prototype.getTotalLength = () => 100;
}

describe('Chart tooltip regression — no let-x context from BrnTooltip', () => {
  // ─── BarChart ────────────────────────────────────────────────────────
  describe('BarChartComponent', () => {
    let fixture: ComponentFixture<BarChartComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BarChartComponent],
      }).compileComponents();
      fixture = TestBed.createComponent(BarChartComponent);
      fixture.componentRef.setInput('data', [
        { label: 'A', value: 10 },
        { label: 'B', value: 20 },
        { label: 'C', value: 15 },
      ]);
    });

    it('activeTooltipData is null before any interaction', async () => {
      await fixture.whenStable();
      expect(fixture.componentInstance.activeTooltipData()).toBeNull();
    });

    it('onBarEnter sets activeTooltipData with correct values', async () => {
      await fixture.whenStable();
      const comp = fixture.componentInstance;

      comp.onBarEnter(1);
      await fixture.whenStable();

      const data = comp.activeTooltipData();
      expect(data).not.toBeNull();
      expect(data!.label).toBe('B');
      expect(data!.formattedValue).toBe('20');
    });

    it('onBarLeave clears activeTooltipData', async () => {
      await fixture.whenStable();
      const comp = fixture.componentInstance;

      comp.onBarEnter(0);
      await fixture.whenStable();
      expect(comp.activeTooltipData()).not.toBeNull();

      comp.onBarLeave();
      await fixture.whenStable();
      expect(comp.activeTooltipData()).toBeNull();
    });

    it('onBarFocus sets activeTooltipData', async () => {
      await fixture.whenStable();
      const comp = fixture.componentInstance;

      comp.onBarFocus(2);
      await fixture.whenStable();

      const data = comp.activeTooltipData();
      expect(data).not.toBeNull();
      expect(data!.label).toBe('C');
      expect(data!.formattedValue).toBe('15');
    });

    it('onBarBlur clears activeTooltipData', async () => {
      await fixture.whenStable();
      const comp = fixture.componentInstance;

      comp.onBarFocus(0);
      comp.onBarBlur();
      await fixture.whenStable();
      expect(comp.activeTooltipData()).toBeNull();
    });

    it('out-of-range index yields null activeTooltipData', async () => {
      await fixture.whenStable();
      const comp = fixture.componentInstance;

      comp.onBarEnter(99);
      await fixture.whenStable();
      expect(comp.activeTooltipData()).toBeNull();
    });

    it('template renders without crashing when activeTooltipData is null', async () => {
      await fixture.whenStable();
      const svg = fixture.nativeElement.querySelector('svg');
      expect(svg).toBeTruthy();
      const rects = fixture.nativeElement.querySelectorAll('rect');
      expect(rects.length).toBe(3);
    });
  });

  // ─── LineChart ───────────────────────────────────────────────────────
  describe('LineChartComponent', () => {
    let fixture: ComponentFixture<LineChartComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LineChartComponent],
      }).compileComponents();
      fixture = TestBed.createComponent(LineChartComponent);
      fixture.componentRef.setInput('data', [
        { label: 'X', value: 5 },
        { label: 'Y', value: 12 },
        { label: 'Z', value: 8 },
      ]);
    });

    it('activeTooltipData is null before any interaction', async () => {
      await fixture.whenStable();
      expect(fixture.componentInstance.activeTooltipData()).toBeNull();
    });

    it('onPointEnter sets activeTooltipData with correct values', async () => {
      await fixture.whenStable();
      const comp = fixture.componentInstance;

      comp.onPointEnter(0);
      await fixture.whenStable();

      const data = comp.activeTooltipData();
      expect(data).not.toBeNull();
      expect(data!.label).toBe('X');
      expect(data!.formattedValue).toBe('5');
      expect(data!.color).toBe('var(--primary)');
    });

    it('onPointLeave clears activeTooltipData', async () => {
      await fixture.whenStable();
      const comp = fixture.componentInstance;

      comp.onPointEnter(1);
      comp.onPointLeave();
      await fixture.whenStable();
      expect(comp.activeTooltipData()).toBeNull();
    });

    it('onPointFocus sets activeTooltipData', async () => {
      await fixture.whenStable();
      const comp = fixture.componentInstance;

      comp.onPointFocus(2);
      await fixture.whenStable();

      const data = comp.activeTooltipData();
      expect(data).not.toBeNull();
      expect(data!.label).toBe('Z');
      expect(data!.formattedValue).toBe('8');
    });

    it('onPointBlur clears activeTooltipData', async () => {
      await fixture.whenStable();
      const comp = fixture.componentInstance;

      comp.onPointFocus(1);
      comp.onPointBlur();
      await fixture.whenStable();
      expect(comp.activeTooltipData()).toBeNull();
    });

    it('template renders without crashing when activeTooltipData is null', async () => {
      await fixture.whenStable();
      const svg = fixture.nativeElement.querySelector('svg');
      expect(svg).toBeTruthy();
      const circles = fixture.nativeElement.querySelectorAll('circle');
      expect(circles.length).toBe(3);
    });
  });

  // ─── DonutChart ──────────────────────────────────────────────────────
  describe('DonutChartComponent', () => {
    let fixture: ComponentFixture<DonutChartComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DonutChartComponent],
      }).compileComponents();
      fixture = TestBed.createComponent(DonutChartComponent);
      fixture.componentRef.setInput('data', [
        { label: 'P', value: 30 },
        { label: 'Q', value: 70 },
      ]);
    });

    it('activeTooltipData is null before any interaction', async () => {
      await fixture.whenStable();
      expect(fixture.componentInstance.activeTooltipData()).toBeNull();
    });

    it('onEnter sets activeTooltipData with correct values', async () => {
      await fixture.whenStable();
      const comp = fixture.componentInstance;

      comp.onEnter(1);
      await fixture.whenStable();

      const data = comp.activeTooltipData();
      expect(data).not.toBeNull();
      expect(data!.label).toBe('Q');
      expect(data!.formattedValue).toBe('70');
    });

    it('onLeave clears activeTooltipData', async () => {
      await fixture.whenStable();
      const comp = fixture.componentInstance;

      comp.onEnter(0);
      comp.onLeave();
      await fixture.whenStable();
      expect(comp.activeTooltipData()).toBeNull();
    });

    it('out-of-range index yields null activeTooltipData', async () => {
      await fixture.whenStable();
      const comp = fixture.componentInstance;

      comp.onEnter(99);
      await fixture.whenStable();
      expect(comp.activeTooltipData()).toBeNull();
    });

    it('template renders without crashing when activeTooltipData is null', async () => {
      await fixture.whenStable();
      const paths = fixture.nativeElement.querySelectorAll('path');
      expect(paths.length).toBe(2);
    });
  });
});
