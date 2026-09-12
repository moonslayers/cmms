import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonutChartComponent } from './donut-chart.component';

function createDonutData(count: number, baseValue = 20) {
  return Array.from({ length: count }, (_, i) => ({
    label: `Item${i}`,
    value: baseValue + i * 10,
  }));
}

describe('DonutChartComponent', () => {
  let fixture: ComponentFixture<DonutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonutChartComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(DonutChartComponent);
    fixture.componentRef.setInput('data', createDonutData(3));
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('segments computed', () => {
    it('returns one segment per data point', () => {
      const segs = fixture.componentInstance.segments();
      expect(segs.length).toBe(3);
    });

    it('computes startAngle and endAngle that span 360° total', () => {
      const segs = fixture.componentInstance.segments();
      const totalDelta = segs.reduce((sum, s) => sum + (s.endAngle - s.startAngle), 0);
      expect(totalDelta).toBeCloseTo(360, 0);
    });

    it('first segment starts at -90° (12 o\'clock)', () => {
      const segs = fixture.componentInstance.segments();
      expect(segs[0].startAngle).toBe(-90);
    });

    it('last segment ends at 270° (= 360 - 90)', () => {
      const segs = fixture.componentInstance.segments();
      expect(segs[segs.length - 1].endAngle).toBeCloseTo(270, 0);
    });

    it('segments are contiguous (each start equals previous end)', () => {
      const segs = fixture.componentInstance.segments();
      for (let i = 1; i < segs.length; i++) {
        expect(segs[i].startAngle).toBeCloseTo(segs[i - 1].endAngle, 10);
      }
    });

    it('assigns colors from the palette when not provided', () => {
      const segs = fixture.componentInstance.segments();
      const colors = segs.map((s) => s.color);
      for (const c of colors) {
        expect(c.length).toBeGreaterThan(0);
      }
    });

    it('returns empty array when total is 0', () => {
      fixture.componentRef.setInput('data', [
        { label: 'A', value: 0 },
        { label: 'B', value: 0 },
      ]);
      expect(fixture.componentInstance.segments()).toEqual([]);
    });

    it('returns empty array for empty data', () => {
      fixture.componentRef.setInput('data', []);
      expect(fixture.componentInstance.segments()).toEqual([]);
    });

    it('handles single segment (full circle)', () => {
      fixture.componentRef.setInput('data', [{ label: 'Only', value: 100 }]);
      const segs = fixture.componentInstance.segments();
      expect(segs.length).toBe(1);
      const delta = segs[0].endAngle - segs[0].startAngle;
      expect(delta).toBeCloseTo(360, 0);
    });
  });

  describe('describeArc', () => {
    it('returns an SVG path starting with M', () => {
      const comp = fixture.componentInstance;
      const d = comp.describeArc(50, 50, 40, 0, 90);
      expect(d).toMatch(/^M /);
    });

    it('handles full circle (delta >= 359.99)', () => {
      const comp = fixture.componentInstance;
      const d = comp.describeArc(50, 50, 40, -90, 270);
      expect(d).toContain('A ');
      expect(d.split(' A ').length).toBeGreaterThanOrEqual(3);
    });

    it('handles small arc (delta < 180)', () => {
      const comp = fixture.componentInstance;
      const d = comp.describeArc(50, 50, 40, 0, 45);
      expect(d).toMatch(/^M /);
      expect(d).toContain('A ');
    });

    it('handles large arc (delta > 180, < 359.99)', () => {
      const comp = fixture.componentInstance;
      const d = comp.describeArc(50, 50, 40, 0, 200);
      expect(d).toContain('A ');
    });
  });

  describe('activeIndex / tooltip', () => {
    it('activeTooltipData is null initially', () => {
      expect(fixture.componentInstance.activeTooltipData()).toBeNull();
    });

    it('onEnter sets activeIndex', () => {
      fixture.componentInstance.onEnter(1);
      expect(fixture.componentInstance.activeIndex()).toBe(1);
    });

    it('onLeave clears activeIndex', () => {
      fixture.componentInstance.onEnter(0);
      fixture.componentInstance.onLeave();
      expect(fixture.componentInstance.activeIndex()).toBeNull();
    });

    it('out-of-range index yields null activeTooltipData', () => {
      fixture.componentInstance.onEnter(99);
      expect(fixture.componentInstance.activeTooltipData()).toBeNull();
    });
  });

  describe('reducedMotion computed', () => {
    it('is a boolean', () => {
      expect(typeof fixture.componentInstance.reducedMotion()).toBe('boolean');
    });
  });
});
