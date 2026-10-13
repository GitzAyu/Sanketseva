import React, { useState, useMemo } from 'react';
import { HistoricalReading } from '../../types/sensors';
import { Droplets } from 'lucide-react';

interface HumidityChartProps {
  data: HistoricalReading[];
}

export const HumidityChart: React.FC<HumidityChartProps> = ({ data }) => {
  const [filter, setFilter] = useState<'1H' | '6H' | '24H'>('1H');

  const filteredData = useMemo(() => {
    if (!data.length) return [];
    const now = Date.now();
    const durationMs =
      filter === '1H' ? 3600000 : filter === '6H' ? 6 * 3600000 : 24 * 3600000;
    const cutoff = now - durationMs;
    const subset = data.filter((d) => d.timestamp >= cutoff);
    return subset.length ? subset : data;
  }, [data, filter]);

  const chartHeight = 160;
  const chartWidth = 400;
  const padding = { top: 15, right: 20, bottom: 25, left: 35 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const minHum = 20;
  const maxHum = 90;

  const polylinePoints = useMemo(() => {
    if (filteredData.length < 2) return '';
    const n = filteredData.length;
    return filteredData
      .map((d, i) => {
        const x = padding.left + (i / (n - 1)) * innerWidth;
        const y = padding.top + innerHeight - ((d.humidity - minHum) / (maxHum - minHum)) * innerHeight;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [filteredData, innerWidth, innerHeight]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-sky-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Relative Air Humidity History
          </h3>
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
          {(['1H', '6H', '24H'] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setFilter(period)}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                filter === period
                  ? 'bg-sky-600 text-white font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-36" preserveAspectRatio="none">
        <line x1={padding.left} y1={padding.top} x2={chartWidth - padding.right} y2={padding.top} stroke="#94a3b825" strokeDasharray="3 3" />
        <line x1={padding.left} y1={padding.top + innerHeight} x2={chartWidth - padding.right} y2={padding.top + innerHeight} stroke="#94a3b825" />

        {polylinePoints && (
          <polyline
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />
        )}
      </svg>
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-slate-800">
        <span>Min: {minHum}%</span>
        <span>Latest: {filteredData[filteredData.length - 1]?.humidity ?? 0}% RH</span>
        <span>Max: {maxHum}%</span>
      </div>
    </div>
  );
};
