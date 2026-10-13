import React, { useState, useMemo } from 'react';
import { useDevice } from '../context/DeviceContext';
import { History as HistoryIcon, Download, Search } from 'lucide-react';
import { formatDateTime } from '../utils/formatting';

export const History: React.FC = () => {
  const { events, sensorHistory } = useDevice();
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
        return (
          evt.title.toLowerCase().includes(query) ||
          evt.description.toLowerCase().includes(query) ||
          (evt.actionTaken && evt.actionTaken.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [events, filterType, searchQuery]);

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (activeTab === 'events') {
      csvContent += 'Timestamp,Type,Severity,Title,Description,ActionTaken\n';
      filteredEvents.forEach((e) => {
        csvContent += `"${new Date(e.timestamp).toISOString()}","${e.type}","${e.severity}","${e.title}","${e.description}","${e.actionTaken || ''}"\n`;
      });
    } else {
      csvContent += 'Timestamp,Gas_Raw_ADC,Smoke_PPM,Temperature_C,Humidity_RH,Flame_Detected\n';
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
              Audit Logs & Sensor History
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete historical record of safety alarms, power controls, equipment actions, and sensor readings
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
              Safety Events ({events.length})
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
              Sensor Data ({sensorHistory.length})
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Export CSV</span>
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
                placeholder="Search event title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-800"
              />
            </div>

            {/* Category filters */}
            <div className="flex items-center gap-1 flex-wrap text-xs font-semibold">
              {(['ALL', 'GAS', 'FIRE', 'SMOKE', 'POWER', 'VALVE', 'FAN'] as const).map((cat) => (
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
                  {cat}
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
                    <th className="py-3 px-4 font-bold">Time</th>
                    <th className="py-3 px-4 font-bold">Severity</th>
                    <th className="py-3 px-4 font-bold">Event Details</th>
                    <th className="py-3 px-4 font-bold">Action Taken</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-slate-500">
                        No events match the selected search criteria.
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
                            {evt.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900 dark:text-white">{evt.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{evt.description}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-xs font-medium">
                          {evt.actionTaken || 'None recorded'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold ${
                              evt.resolved ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                            }`}
                          >
                            {evt.resolved ? 'Resolved' : 'Active'}
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
                  <th className="py-3 px-4 font-bold">Timestamp</th>
                  <th className="py-3 px-4 font-bold">LPG Gas (ADC)</th>
                  <th className="py-3 px-4 font-bold">Smoke (PPM)</th>
                  <th className="py-3 px-4 font-bold">Temperature (°C)</th>
                  <th className="py-3 px-4 font-bold">Humidity (% RH)</th>
                  <th className="py-3 px-4 font-bold">Flame Sensor</th>
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
                        {reading.flame ? 'DETECTED' : 'CLEAR'}
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
