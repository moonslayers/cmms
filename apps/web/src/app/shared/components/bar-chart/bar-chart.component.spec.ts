import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChartComponent } from './bar-chart.component';

function createData(count: number, baseValue = 10) {
  return Array.from({ length: count }, (_, i) => ({
    label: `Cat${i}`,
    value: baseValue + i * 5,
  }));
}

describe('BarChartComponent', () => {
  let fixture: ComponentFixture<BarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChartComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(BarChartComponent);
    fixture.componentRef.setInput('data', createData(3));
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('barData computed', () => {
    it('returns one entry per data point', () => {
      const bars = fixture.componentInstance.barData();
      expect(bars.length).toBe(3);
    });

    it('computes positive barH for positive values', () => {
      const bars = fixture.componentInstance.barData();
      for (const bar of bars) {
        expect(bar.barH).toBeGreaterThan(0);
      }
    });

    it('assigns colors from the palette cyclically', () => {
      fixture.componentRef.setInput('data', createData(7));
      const bars = fixture.componentInstance.barData();
      const colors = bars.map((b) => b.color);
      expect(new Set(colors).size).toBeGreaterThan(1);
    });

    it('formats values according to valueFormat', () => {
      fixture.componentRef.setInput('valueFormat', 'currency');
      const bars = fixture.componentInstance.barData();
      expect(bars[0].formattedValue).toContain('$');
    });

    it('rotates labels when data has 8+ points', () => {
      fixture.componentRef.setInput('data', createData(8));
      const bars = fixture.componentInstance.barData();
      expect(bars[0].labelTransform).toContain('rotate');
      expect(bars[0].textAnchor).toBe('end');
    });

    it('does not rotate labels when data has fewer than 8 points', () => {
      const bars = fixture.componentInstance.barData();
      expect(bars[0].labelTransform).toBeNull();
      expect(bars[0].textAnchor).toBe('middle');
    });

    it('returns empty array for empty data', () => {
      fixture.componentRef.setInput('data', []);
      expect(fixture.componentInstance.barData()).toEqual([]);
    });

    it('handles single data point', () => {
      fixture.componentRef.setInput('data', [{ label: 'Only', value: 42 }]);
      const bars = fixture.componentInstance.barData();
      expect(bars.length).toBe(1);
      expect(bars[0].barH).toBeGreaterThan(0);
    });

    it('handles data with zero values', () => {
      fixture.componentRef.setInput('data', [{ label: 'Zero', value: 0 }]);
      const bars = fixture.componentInstance.barData();
      expect(bars.length).toBe(1);
      expect(bars[0].barH).toBe(0);
    });
  });

  describe('gridlines computed', () => {
    it('returns 4 gridlines', () => {
      expect(fixture.componentInstance.gridlines().length).toBe(4);
    });

    it('gridline values are formatted strings', () => {
      const lines = fixture.componentInstance.gridlines();
      for (const line of lines) {
        expect(typeof line.value).toBe('string');
        expect(line.value.length).toBeGreaterThan(0);
      }
    });

    it('formats gridlines as currency when valueFormat is currency', () => {
      fixture.componentRef.setInput('valueFormat', 'currency');
      const lines = fixture.componentInstance.gridlines();
      expect(lines[lines.length - 1].value).toContain('$');
    });

    it('y positions are in ascending order (bottom to top)', () => {
      const lines = fixture.componentInstance.gridlines();
      const ys = lines.map((l) => l.y);
      for (let i = 1; i < ys.length; i++) {
        expect(ys[i]).toBeLessThan(ys[i - 1]);
      }
    });
  });
});
