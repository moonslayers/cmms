import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LineChartComponent, type LineChartDataPoint } from './line-chart.component';
import { formatChartValue } from '../charts/chart.utils';

function createData(values: number[]): LineChartDataPoint[] {
  return values.map((v, i) => ({ label: `P${i}`, value: v }));
}

describe('LineChartComponent', () => {
  let fixture: ComponentFixture<LineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartComponent);
    fixture.componentRef.setInput('data', createData([100, 200, 300]));
    fixture.componentRef.setInput('animate', false);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('dashStyle', () => {
    it('returns dasharray none when animate is false (reduced motion scenario)', () => {
      fixture.componentRef.setInput('animate', false);
      const style = fixture.componentInstance.dashStyle();
      expect(style.dasharray).toBe('none');
      expect(style.dashoffset).toBe('0');
    });

    it('returns dasharray none when pathLen is 0', () => {
      fixture.componentInstance.pathLen.set(0);
      fixture.componentInstance.animated.set(false);
      const style = fixture.componentInstance.dashStyle();
      expect(style.dasharray).toBe('none');
      expect(style.dashoffset).toBe('0');
    });

    it('applies correct dash when animated is true and pathLen is set', () => {
      fixture.componentInstance.pathLen.set(500);
      fixture.componentInstance.animated.set(true);
      const style = fixture.componentInstance.dashStyle();
      expect(style.dasharray).toBe('500 500');
      expect(style.dashoffset).toBe('0');
    });

    it('does NOT hide the line when animate is false even if pathLen is set', () => {
      fixture.componentInstance.pathLen.set(500);
      fixture.componentInstance.animated.set(false);
      const style = fixture.componentInstance.dashStyle();
      expect(style.dasharray).toBe('none');
      expect(style.dashoffset).toBe('0');
    });

    it('line is never hidden with dashoffset equal to pathLen when animate is false', () => {
      fixture.componentInstance.pathLen.set(300);
      fixture.componentInstance.animated.set(false);
      const style = fixture.componentInstance.dashStyle();
      expect(style.dashoffset).not.toBe('300');
    });
  });

  describe('gridLines labels', () => {
    it('gridLines computes correct tick values', () => {
      const lines = fixture.componentInstance.gridLines();
      expect(lines.length).toBe(5);
      expect(lines[0]).toBe(0);
      expect(lines[lines.length - 1]).toBe(fixture.componentInstance.maxValue());
    });

    it('formatChartValue produces formatted output for currency', () => {
      expect(formatChartValue(1234, 'currency')).toContain('1,234');
      expect(formatChartValue(1234, 'currency')).toMatch(/\$/);
    });

    it('formatChartValue produces formatted output for number', () => {
      expect(formatChartValue(1234, 'number')).toBe('1,234');
    });

    it('formatChartValue produces formatted output for compact', () => {
      expect(formatChartValue(1500, 'compact')).toMatch(/1\.5\s?k/i);
    });
  });

  describe('data-driven computed values', () => {
    it('computes maxValue correctly', () => {
      fixture.componentRef.setInput('data', createData([10, 50, 30]));
      expect(fixture.componentInstance.maxValue()).toBe(50);
    });

    it('computes empty correctly', () => {
      expect(fixture.componentInstance.empty()).toBe(false);
      fixture.componentRef.setInput('data', []);
      expect(fixture.componentInstance.empty()).toBe(true);
    });

    it('formattedPoints has correct length', () => {
      const pts = fixture.componentInstance.formattedPoints();
      expect(pts.length).toBe(3);
    });

    it('formattedPoints includes formattedValue', () => {
      fixture.componentRef.setInput('valueFormat', 'currency');
      const pts = fixture.componentInstance.formattedPoints();
      expect(pts[0].formattedValue).toContain('100');
    });
  });

  describe('pathD computed', () => {
    it('returns a non-empty SVG path string for 3 points', () => {
      const d = fixture.componentInstance.pathD();
      expect(d.length).toBeGreaterThan(0);
      expect(d).toMatch(/^M /);
    });

    it('contains L commands for each point after the first', () => {
      const d = fixture.componentInstance.pathD();
      const segments = d.split(' L ');
      expect(segments.length).toBe(3);
    });

    it('returns empty string for empty data', () => {
      fixture.componentRef.setInput('data', []);
      expect(fixture.componentInstance.pathD()).toBe('');
    });

    it('returns a single M command for a single point', () => {
      fixture.componentRef.setInput('data', createData([50]));
      const d = fixture.componentInstance.pathD();
      expect(d).toMatch(/^M /);
      expect(d).not.toContain(' L ');
    });
  });

  describe('areaD computed', () => {
    it('returns a non-empty SVG path that closes with Z', () => {
      const d = fixture.componentInstance.areaD();
      expect(d.length).toBeGreaterThan(0);
      expect(d).toMatch(/ Z$/);
    });

    it('includes the line portion followed by closing segments', () => {
      const d = fixture.componentInstance.areaD();
      const parts = d.split(' Z')[0];
      const lCount = (parts.match(/ L /g) || []).length;
      expect(lCount).toBeGreaterThanOrEqual(3);
    });

    it('returns empty string for empty data', () => {
      fixture.componentRef.setInput('data', []);
      expect(fixture.componentInstance.areaD()).toBe('');
    });

    it('closes properly for a single point', () => {
      fixture.componentRef.setInput('data', createData([42]));
      const d = fixture.componentInstance.areaD();
      expect(d).toMatch(/ Z$/);
    });
  });

  describe('gridLines formatted labels', () => {
    it('template renders formatted values in SVG text elements', () => {
      fixture.componentRef.setInput('valueFormat', 'currency');
      fixture.detectChanges();
      const texts = fixture.nativeElement.querySelectorAll('text');
      const values = Array.from(texts).map((t) => (t as SVGTextElement).textContent?.trim());
      expect(values.some((v) => v?.includes('$'))).toBe(true);
    });

    it('gridLines are monotonically increasing', () => {
      const lines = fixture.componentInstance.gridLines();
      for (let i = 1; i < lines.length; i++) {
        expect(lines[i]).toBeGreaterThanOrEqual(lines[i - 1]);
      }
    });
  });

  describe('reducedMotion computed', () => {
    it('is a boolean', () => {
      expect(typeof fixture.componentInstance.reducedMotion()).toBe('boolean');
    });
  });
});
