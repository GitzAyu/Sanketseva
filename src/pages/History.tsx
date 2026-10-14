import React, { useState, useMemo } from 'react';
import { useDevice } from '../context/DeviceContext';
import { History as HistoryIcon, Download, Search } from 'lucide-react';
import { formatDateTime } from '../utils/formatting';
import { useLanguage } from '../context/LanguageContext';

export const History: React.FC = () => {
  const { events, sensorHistory } = useDevice();
  const { t } = useLanguage();
  const eventLabel = (type: string) => {
    if (type.includes('GAS')) return t.filterGas;
    if (type.includes('FLAME') || type.includes('FIRE')) return t.filterFire;
    if (type.includes('SMOKE')) return t.filterSmoke;
    if (type.includes('POWER')) return t.filterPower;
    if (type.includes('VALVE')) return t.filterValve;
    if (type.includes('FAN')) return t.filterFan;
    return t.safetyEventsTab;
  };
  const [activeTab, setActiveTab] = useState<'events' | 'readings'>('events');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      if (filterType !== 'ALL') {
        if (filterType === 'GAS' && !evt.type.includes('GAS')) return false;
        if (filterType === 'FIRE' && !evt.type.includes('FLAME')) return false;
        if (filterType === 'SMOKE' && !evt.type.includes('SMOKE')) return false;
        if (filterType === 'POWER' && !evt.type.includes('POWER')) return false;
        if (filterType === 'VALVE' && !evt.type.includes('VALVE')) return false;
        if (filterType === 'FAN' && !evt.type.includes('FAN')) return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const severity = evt.severity === 'EMERGENCY' ? t.statusDanger : evt.severity === 'WARNING' ? t.statusWarning : t.statusNormal;
        return (
          eventLabel(evt.type).toLowerCase().includes(query) ||
          severity.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [events, filterType, searchQuery, t]);

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (activeTab === 'events') {
      csvContent += `${t.timestampColumn},${t.eventColumn},${t.severityColumn},${t.details},${t.eventColumn},${t.actionColumn}\n`;
      filteredEvents.forEach((e) => {
        const severity = e.severity === 'EMERGENCY' ? t.statusDanger : e.severity === 'WARNING' ? t.statusWarning : t.statusNormal;
        csvContent += `"${new Date(e.timestamp).toISOString()}","${eventLabel(e.type)}","${severity}","${eventLabel(e.type)}","","${t.noActionRecorded}"\n`;
      });
    } else {
      csvContent += `${t.timestampColumn},${t.gasHistoryColumn},${t.smokeHistoryColumn},${t.temperatureHistoryColumn},${t.humidityHistoryColumn},${t.flameHistoryColumn}\n`;
      sensorHistory.forEach((r) => {
        csvContent += `"${new Date(r.timestamp).toISOString()}",${r.gas},${r.smoke},${r.temperature},${r.humidity},${r.flame}\n`;
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gasguard_${activeTab}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 transition-colors duration-200">
      {/* Header */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              {t.historyTitle}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.historySubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.safetyEventsTab} ({events.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('readings')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'readings'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.sensorDataTab} ({sensorHistory.length})
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{t.exportCsv}</span>
          </button>
        </div>
      </div>

      {activeTab === 'events' ? (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder={t.searchEvents}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-800"
              />
            </div>

            {/* Category filters */}
            <div className="flex items-center gap-1 flex-wrap text-xs font-semibold">
              {([
                ['ALL', t.filterAll], ['GAS', t.filterGas], ['FIRE', t.filterFire],
                ['SMOKE', t.filterSmoke], ['POWER', t.filterPower], ['VALVE', t.filterValve], ['FAN', t.filterFan],
              ] as const).map(([cat, label]) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterType(cat)}
                  className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    filterType === cat
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs font-bold'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-4 font-bold">{t.timeColumn}</th>
                    <th className="py-3 px-4 font-bold">{t.severityColumn}</th>
                    <th className="py-3 px-4 font-bold">{t.eventColumn}</th>
                    <th className="py-3 px-4 font-bold">{t.statusColumn}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 dark:text-slate-500">
                        {t.noMatchingEvents}
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((evt) => (
                      <tr key={evt.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono text-xs">
                          {formatDateTime(evt.timestamp)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                              evt.severity === 'EMERGENCY'
                                ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900'
                                : evt.severity === 'WARNING'
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {evt.severity === 'EMERGENCY' ? t.statusDanger : evt.severity === 'WARNING' ? t.statusWarning : t.statusNormal}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900 dark:text-white">{eventLabel(evt.type)}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold ${
                              evt.resolved ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                            }`}
                          >
                            {evt.resolved ? t.resolved : t.statusActive}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Raw Telemetry Data Grid */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-700 font-sans">
                <tr>
                  <th className="py-3 px-4 font-bold">{t.timestampColumn}</th>
                  <th className="py-3 px-4 font-bold">{t.gasHistoryColumn}</th>
                  <th className="py-3 px-4 font-bold">{t.smokeHistoryColumn}</th>
                  <th className="py-3 px-4 font-bold">{t.temperatureHistoryColumn}</th>
                  <th className="py-3 px-4 font-bold">{t.humidityHistoryColumn}</th>
                  <th className="py-3 px-4 font-bold">{t.flameHistoryColumn}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {sensorHistory.map((reading, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">
                      {formatDateTime(reading.timestamp)}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                      {reading.gas}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                      {reading.smoke}
                    </td>
                    <td className="py-2.5 px-4 text-amber-700 dark:text-amber-400 tabular-nums">
                      {reading.temperature}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 tabular-nums">
                      {reading.humidity}%
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={
                          reading.flame ? 'text-red-700 dark:text-red-400 font-bold' : 'text-emerald-700 dark:text-emerald-400 font-medium'
                        }
                      >
                        {reading.flame ? t.statusDetected : t.statusClear}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
