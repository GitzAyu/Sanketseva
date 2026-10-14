import React, { useState, useMemo } from 'react';
import { HistoricalReading } from '../../types/sensors';
import { formatTimestamp } from '../../utils/formatting';
import { Wind, CloudFog, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface GasChartProps {
  data: HistoricalReading[];
  warningThreshold: number;
  dangerThreshold: number;
}

export const GasChart: React.FC<GasChartProps> = ({
  data,
  warningThreshold,
  dangerThreshold,
}) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'1H' | '6H' | '24H'>('1H');
  const [activeChannel, setActiveChannel] = useState<'both' | 'gas' | 'smoke'>('both');

  const filteredData = useMemo(() => {
    if (!data.length) return [];
    const now = Date.now();
    const durationMs =
      filter === '1H' ? 3600000 : filter === '6H' ? 6 * 3600000 : 24 * 3600000;
    const cutoff = now - durationMs;
    const subset = data.filter((d) => d.timestamp >= cutoff);
    return subset.length ? subset : data;
  }, [data, filter]);

  const chartHeight = 220;
  const chartWidth = 700;
  const padding = { top: 20, right: 30, bottom: 30, left: 45 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const maxVal = useMemo(() => {
    let m = Math.max(dangerThreshold + 100, 750);
    filteredData.forEach((d) => {
      if (d.gas > m) m = d.gas + 50;
      if (d.smoke > m) m = d.smoke + 50;
    });
    return m;
  }, [filteredData, dangerThreshold]);

  const minVal = 0;

  const points = useMemo(() => {
    if (filteredData.length < 2) return { gasPoints: '', smokePoints: '', coords: [] };
    const n = filteredData.length;
    const coords = filteredData.map((d, i) => {
      const x = padding.left + (i / (n - 1)) * innerWidth;
      const yGas = padding.top + innerHeight - ((d.gas - minVal) / (maxVal - minVal)) * innerHeight;
      const ySmoke = padding.top + innerHeight - ((d.smoke - minVal) / (maxVal - minVal)) * innerHeight;
      return { x, yGas, ySmoke, data: d };
    });

    const gasPoints = coords.map((c) => `${c.x.toFixed(1)},${c.yGas.toFixed(1)}`).join(' ');
    const smokePoints = coords.map((c) => `${c.x.toFixed(1)},${c.ySmoke.toFixed(1)}`).join(' ');

    return { gasPoints, smokePoints, coords };
  }, [filteredData, maxVal, minVal, innerWidth, innerHeight]);

  const yWarn = padding.top + innerHeight - ((warningThreshold - minVal) / (maxVal - minVal)) * innerHeight;
  const yDanger = padding.top + innerHeight - ((dangerThreshold - minVal) / (maxVal - minVal)) * innerHeight;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              {t.gasPpmTrend} & {t.smokeTrend}
            </h3>
            <span className="text-xs text-rose-700 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/50 flex items-center gap-1">
              <Wind className="w-3 h-3" />
              <span>{t.sensorGas}</span>
            </span>
            <span className="text-xs text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/50 flex items-center gap-1">
              <CloudFog className="w-3 h-3" />
              <span>{t.sensorSmoke}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>
              {t.trendDescription}
            </span>
          </p>
        </div>

        {/* Channel & period filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveChannel('both')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeChannel === 'both'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {t.both}
            </button>
            <button
              type="button"
              onClick={() => setActiveChannel('gas')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeChannel === 'gas'
                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {t.gasOnly}
            </button>
            <button
              type="button"
              onClick={() => setActiveChannel('smoke')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeChannel === 'smoke'
                  ? 'bg-amber-600 text-white shadow-2xs font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {t.smokeOnly}
            </button>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold">
            {(['1H', '6H', '24H'] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setFilter(period)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filter === period
                    ? 'bg-rose-600 text-white shadow-2xs font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Trendline Graphic */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-56 select-none"
          preserveAspectRatio="none"
        >
          {/* Background Grid Lines */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={chartWidth - padding.right}
            y2={padding.top}
            stroke="#94a3b830"
            strokeDasharray="4 4"
          />
          <line
            x1={padding.left}
            y1={padding.top + innerHeight / 2}
            x2={chartWidth - padding.right}
            y2={padding.top + innerHeight / 2}
            stroke="#94a3b820"
            strokeDasharray="4 4"
          />
          <line
            x1={padding.left}
            y1={padding.top + innerHeight}
            x2={chartWidth - padding.right}
            y2={padding.top + innerHeight}
            stroke="#94a3b830"
          />

          {/* Warning Threshold Reference Line */}
          <line
            x1={padding.left}
            y1={yWarn}
            x2={chartWidth - padding.right}
            y2={yWarn}
            stroke="#f59e0b"
            strokeDasharray="5 3"
            strokeWidth="1.5"
          />
          <text
            x={chartWidth - padding.right - 4}
            y={yWarn - 4}
            fill="#d97706"
            fontSize="10"
            fontWeight="bold"
            textAnchor="end"
          >
            {t.warn} ({warningThreshold})
          </text>

          {/* Danger Threshold Reference Line */}
          <line
            x1={padding.left}
            y1={yDanger}
            x2={chartWidth - padding.right}
            y2={yDanger}
            stroke="#f43f5e"
            strokeDasharray="5 3"
            strokeWidth="1.5"
          />
          <text
            x={chartWidth - padding.right - 4}
            y={yDanger - 4}
            fill="#e11d48"
            fontSize="10"
            fontWeight="bold"
            textAnchor="end"
          >
            {t.statusDanger} ({dangerThreshold})
          </text>

          {/* Y Axis Labels */}
          <text x={padding.left - 8} y={padding.top + 4} fill="#94a3b8" fontSize="10" textAnchor="end">
            {maxVal}
          </text>
          <text x={padding.left - 8} y={yWarn + 4} fill="#f59e0b" fontSize="9" textAnchor="end">
            {warningThreshold}
          </text>
          <text x={padding.left - 8} y={padding.top + innerHeight + 4} fill="#94a3b8" fontSize="10" textAnchor="end">
            0
          </text>

          {/* Smoke Polyline */}
          {(activeChannel === 'both' || activeChannel === 'smoke') && points.smokePoints && (
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points.smokePoints}
            />
          )}

          {/* LPG Gas Polyline */}
          {(activeChannel === 'both' || activeChannel === 'gas') && points.gasPoints && (
            <polyline
              fill="none"
              stroke="#e11d48"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points.gasPoints}
            />
          )}

          {/* Time markers on X Axis */}
          {filteredData.length > 0 && (
            <>
              <text x={padding.left} y={chartHeight - 6} fill="#94a3b8" fontSize="10">
                {formatTimestamp(filteredData[0].timestamp)}
              </text>
              <text x={chartWidth / 2} y={chartHeight - 6} fill="#94a3b8" fontSize="10" textAnchor="middle">
                {formatTimestamp(filteredData[Math.floor(filteredData.length / 2)].timestamp)}
              </text>
              <text x={chartWidth - padding.right} y={chartHeight - 6} fill="#94a3b8" fontSize="10" textAnchor="end">
                {formatTimestamp(filteredData[filteredData.length - 1].timestamp)}
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Legend & quick readout */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-rose-600 rounded-full" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">{t.sensorGas}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-amber-500 rounded-full" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">{t.sensorSmoke}</span>
          </div>
        </div>
        <span className="text-[11px] font-mono">
          {t.last}: {t.sensorGas} {filteredData[filteredData.length - 1]?.gas ?? 0} | {t.sensorSmoke} {filteredData[filteredData.length - 1]?.smoke ?? 0}
        </span>
      </div>
    </div>
  );
};
