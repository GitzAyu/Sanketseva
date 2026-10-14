import React from 'react';
import { Bell, Fan, ShowerHead, Lock, Unlock, Zap } from 'lucide-react';
import { useDevice } from '../../context/DeviceContext';
import { useLanguage } from '../../context/LanguageContext';

type ItemProps = {
  className?: string;
  title: string;
  state: string;
  active: boolean;
  icon: React.ReactNode;
  mobile?: boolean;
};

const HouseItem: React.FC<ItemProps> = ({ className, title, state, active, icon, mobile = false }) => (
  <div className={mobile
    ? 'flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800/60'
    : `absolute z-10 flex min-w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 ${className ?? ''}`}>
    <div className={`${mobile ? 'h-9 w-9 rounded-xl' : 'h-11 w-11 rounded-2xl'} grid shrink-0 place-items-center border bg-white shadow-sm dark:bg-slate-900 ${active ? 'border-emerald-300 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300' : 'border-slate-300 text-slate-500 grayscale dark:border-slate-700 dark:text-slate-400'}`}>
      {icon}
    </div>
    <div className={mobile ? 'min-w-0' : 'rounded-lg border border-slate-200 bg-white/95 px-2 py-1 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/95'}>
      <div className={`${mobile ? '' : 'max-w-28'} truncate text-[10px] font-semibold text-slate-700 dark:text-slate-200`}>{title}</div>
      <div className={`text-[10px] font-bold ${active ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'}`}>{state}</div>
    </div>
  </div>
);

export const HouseActuatorLayout: React.FC = () => {
  const { device } = useDevice();
  const { t } = useLanguage();
  const powerOn = device.actuators.powerCut.state === 'ON';
  const valveOpen = device.actuators.valve.state === 'OPEN';
  const fanOn = device.actuators.fan.state === 'ON';
  const showerOn = device.actuators.extinguisher.state === 'ON';
  const alarmOn = device.actuators.buzzer.state === 'ON';

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="mb-2">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t.houseStatusTitle}</h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.houseStatusSubtitle}</p>
      </div>
      <div className="hidden md:block">
      <div className="relative mx-auto aspect-[700/340] w-full min-w-[640px] max-w-3xl">
        <svg viewBox="0 0 700 340" className="absolute inset-0 h-full w-full" role="img" aria-label={t.houseStatusTitle}>
          <path d="M112 119 350 22l238 97" fill="none" stroke="currentColor" strokeWidth="10" strokeLinejoin="round" className="text-slate-300 dark:text-slate-700" />
          <path d="M157 112v197h386V112" fill="currentColor" className="text-slate-50 dark:text-slate-800/70" />
          <path d="M157 112v197h386V112M350 113v196M157 210h386" fill="none" stroke="currentColor" strokeWidth="5" className="text-slate-300 dark:text-slate-700" />
          <path d="M115 122 350 27l235 95" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-400 dark:text-slate-600" />
          <path d="M199 309v-57h50v57M421 309v-58h75v58" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-300 dark:text-slate-700" />
          <path d="M178 185h32m308 0h-32M350 166v28m0 40v26" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 6" className="text-slate-400 dark:text-slate-600" />
        </svg>
        <HouseItem className="left-[25%] top-[70%]" title={t.powerCutName} state={powerOn ? t.powerOnShort : t.powerOffShort} active={powerOn} icon={<Zap className="h-5 w-5" />} />
        <HouseItem className="left-[40%] top-[70%]" title={t.valveName} state={valveOpen ? t.statusOpen : t.statusClosed} active={valveOpen} icon={valveOpen ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />} />
        <HouseItem className="left-[50%] top-[40%]" title={t.fanName} state={fanOn ? t.statusActive : t.statusInactive} active={fanOn} icon={<Fan className={`h-5 w-5 ${fanOn ? 'animate-spin motion-reduce:animate-none' : ''}`} />} />
        <HouseItem className="left-[66%] top-[40%]" title={t.extinguisherName} state={showerOn ? t.statusActive : t.statusInactive} active={showerOn} icon={<ShowerHead className="h-5 w-5" />} />
        <HouseItem className="left-[75%] top-[70%]" title={t.buzzerName} state={alarmOn ? t.statusActive : t.statusInactive} active={alarmOn} icon={<Bell className="h-5 w-5" />} />
      </div>
      </div>
      <div className="grid grid-cols-2 gap-2 md:hidden">
        <HouseItem mobile title={t.powerCutName} state={powerOn ? t.powerOnShort : t.powerOffShort} active={powerOn} icon={<Zap className="h-4 w-4" />} />
        <HouseItem mobile title={t.valveName} state={valveOpen ? t.statusOpen : t.statusClosed} active={valveOpen} icon={valveOpen ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />} />
        <HouseItem mobile title={t.fanName} state={fanOn ? t.statusActive : t.statusInactive} active={fanOn} icon={<Fan className={`h-4 w-4 ${fanOn ? 'animate-spin motion-reduce:animate-none' : ''}`} />} />
        <HouseItem mobile title={t.extinguisherName} state={showerOn ? t.statusActive : t.statusInactive} active={showerOn} icon={<ShowerHead className="h-4 w-4" />} />
        <HouseItem mobile title={t.buzzerName} state={alarmOn ? t.statusActive : t.statusInactive} active={alarmOn} icon={<Bell className="h-4 w-4" />} />
      </div>
    </section>
  );
};
