
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Medicine, AppSettings, Language, ReminderAlert, VoiceGender, MedicineType } from './types';
import { TRANSLATIONS, ICONS } from './constants';
import { speakReminder } from './services/geminiTTS';

const DEFAULT_SETTINGS: AppSettings = {
  language: 'te', // Defaulting to Telugu as per user preference
  voiceGender: 'female',
  snoozeMinutes: 5,
};

const App: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [activeAlert, setActiveAlert] = useState<ReminderAlert | null>(null);
  const [view, setView] = useState<'schedule' | 'add' | 'settings'>('schedule');

  // Load state
  useEffect(() => {
    const savedMeds = localStorage.getItem('eyecare_medicines');
    const savedSettings = localStorage.getItem('eyecare_settings');
    if (savedMeds) setMedicines(JSON.parse(savedMeds));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem('eyecare_medicines', JSON.stringify(medicines));
    localStorage.setItem('eyecare_settings', JSON.stringify(settings));
  }, [medicines, settings]);

  // Daily reset logic: If lastTakenTime was a different day, reset takenToday
  useEffect(() => {
    const today = new Date().toDateString();
    setMedicines(prev => prev.map(m => {
      const lastDate = m.lastTakenTime ? new Date(m.lastTakenTime).toDateString() : '';
      if (lastDate !== today && m.takenToday) {
        return { ...m, takenToday: false };
      }
      return m;
    }));
  }, []);

  // Scheduler logic with 1-month check
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHHMM = now.toTimeString().slice(0, 5);
      const currentTime = now.getTime();
      
      medicines.forEach(med => {
        const daysPassed = Math.floor((currentTime - med.startDate) / 86400000);
        const isWithinDuration = daysPassed < med.durationDays;

        if (isWithinDuration && med.time === currentHHMM && !med.takenToday) {
          if (!activeAlert || activeAlert.medicine.id !== med.id) {
            triggerAlarm(med);
          }
        }
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [medicines, activeAlert]);

  // Repeating Voice Logic (Repeats until taken)
  useEffect(() => {
    let intervalId: any;
    if (activeAlert) {
      const playVoice = () => {
        const voice = settings.voiceGender === 'female' ? 'Kore' : 'Puck';
        const text = TRANSLATIONS['te'].reminderText(activeAlert.medicine.type);
        speakReminder(text, voice);
      };

      playVoice();
      intervalId = setInterval(playVoice, 10000); // Repeat every 10 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeAlert, settings.voiceGender]);

  const triggerAlarm = useCallback((med: Medicine) => {
    setActiveAlert({ medicine: med, triggeredAt: Date.now() });
  }, []);

  const addMedicine = (med: Omit<Medicine, 'id' | 'takenToday' | 'startDate' | 'durationDays'>) => {
    const newMed: Medicine = {
      ...med,
      id: Math.random().toString(36).substr(2, 9),
      takenToday: false,
      startDate: Date.now(),
      durationDays: 30, // Continue for 1 month (30 days)
    };
    setMedicines(prev => [...prev, newMed]);
    setView('schedule');
  };

  const markAsTaken = (id: string) => {
    setMedicines(prev => prev.map(m => 
      m.id === id ? { ...m, takenToday: true, lastTakenTime: Date.now() } : m
    ));
    if (activeAlert?.medicine.id === id) setActiveAlert(null);
  };

  const snooze = (med: Medicine) => {
    const snoozeTime = new Date(Date.now() + settings.snoozeMinutes * 60000);
    const snoozeHHMM = snoozeTime.toTimeString().slice(0, 5);
    
    setMedicines(prev => prev.map(m => 
      m.id === med.id ? { ...m, time: snoozeHHMM, takenToday: false } : m
    ));
    setActiveAlert(null);
  };

  const t = TRANSLATIONS[settings.language];

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 max-w-md mx-auto relative shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="p-6 bg-white border-b flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">{t.appName}</h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">{new Date().toDateString()}</p>
        </div>
        <button 
          onClick={() => setView('settings')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ICONS.Settings />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {view === 'schedule' && (
          <>
            <h2 className="text-lg font-semibold px-2 mb-2">{t.schedule}</h2>
            {medicines.length === 0 ? (
              <div className="text-center py-20 text-slate-400 space-y-4">
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <ICONS.Clock />
                </div>
                <p>No medicines added yet.</p>
                <button 
                  onClick={() => setView('add')}
                  className="text-blue-600 font-medium"
                >
                  + {t.addMedicine}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {medicines.sort((a,b) => a.time.localeCompare(b.time)).map(med => {
                  const daysPassed = Math.floor((Date.now() - med.startDate) / 86400000) + 1;
                  const isExpired = daysPassed > med.durationDays;
                  
                  return (
                    <div key={med.id} className={`p-4 bg-white rounded-2xl border flex items-center gap-4 shadow-sm transition-all ${med.takenToday || isExpired ? 'opacity-60 grayscale' : 'border-blue-100'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${med.takenToday ? 'bg-slate-100' : 'bg-blue-100 text-blue-600'}`}>
                        <span className="font-bold text-lg">{med.type === 'Moxifloxacin' ? '1' : med.type === 'CMC' ? '2' : med.type === 'Ganciclovir' ? '3' : '?'}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-800">{t[med.type.toLowerCase()] || med.name}</h3>
                          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{med.time}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-slate-500">{med.dosage}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Day {daysPassed} / 30</p>
                        </div>
                      </div>
                      {!med.takenToday && !isExpired ? (
                        <button 
                          onClick={() => markAsTaken(med.id)}
                          className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                        >
                          <ICONS.Check />
                        </button>
                      ) : (
                        <span className="text-green-500 font-bold text-xs uppercase tracking-tighter">{isExpired ? 'FINISHED' : 'DONE'}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {view === 'add' && (
          <AddMedicineForm onSave={addMedicine} onCancel={() => setView('schedule')} t={t} />
        )}

        {view === 'settings' && (
          <SettingsPanel 
            settings={settings} 
            setSettings={setSettings} 
            onBack={() => setView('schedule')} 
            t={t} 
          />
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t px-8 py-4 flex justify-around items-center safe-bottom z-10">
        <button onClick={() => setView('schedule')} className={`p-2 rounded-xl transition-all ${view === 'schedule' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
          <ICONS.Clock />
        </button>
        <button onClick={() => setView('add')} className={`p-3 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-200 active:scale-90 transition-all ${view === 'add' ? 'scale-110' : ''}`}>
          <ICONS.Plus />
        </button>
        <button onClick={() => setView('settings')} className={`p-2 rounded-xl transition-all ${view === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
          <ICONS.Settings />
        </button>
      </nav>

      {/* Alarm Overlay */}
      {activeAlert && (
        <div className="fixed inset-0 z-50 bg-blue-600 flex flex-col items-center justify-center p-8 text-white">
          <div className="animate-pulse bg-white/20 p-8 rounded-full mb-8">
            <div className="animate-bounce">
              <ICONS.Eye />
            </div>
          </div>
          <h2 className="text-4xl font-black mb-2 text-center uppercase tracking-wide">
            {t[activeAlert.medicine.type.toLowerCase()]}
          </h2>
          <p className="text-2xl font-medium mb-12 text-center leading-relaxed">
            {TRANSLATIONS['te'].reminderText(activeAlert.medicine.type)}
          </p>
          
          <div className="w-full space-y-4 max-w-xs">
            <button 
              onClick={() => markAsTaken(activeAlert.medicine.id)}
              className="w-full py-5 bg-white text-blue-600 font-bold rounded-2xl shadow-2xl active:scale-95 transition-transform text-xl border-4 border-white/50"
            >
              {t.markAsTaken}
            </button>
            <button 
              onClick={() => snooze(activeAlert.medicine)}
              className="w-full py-5 bg-blue-500 text-white border-2 border-white/20 font-bold rounded-2xl active:scale-95 transition-transform"
            >
              {t.snooze}
            </button>
          </div>
          <p className="mt-8 text-sm opacity-60 italic text-center">Repeat until marked as taken.<br/>Treatment course: 1 Month</p>
        </div>
      )}
    </div>
  );
};

// Sub-components
const AddMedicineForm: React.FC<{ onSave: (m: any) => void, onCancel: () => void, t: any }> = ({ onSave, onCancel, t }) => {
  const [type, setType] = useState<MedicineType>('Moxifloxacin');
  const [time, setTime] = useState('08:00');
  const [dosage, setDosage] = useState('1 Drop');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t.addMedicine}</h2>
        <button onClick={onCancel} className="text-slate-400 px-4 py-2">Cancel</button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">{t.medicineName}</label>
          <div className="grid grid-cols-2 gap-2">
            {['Moxifloxacin', 'CMC', 'Ganciclovir', 'Other'].map(m => (
              <button
                key={m}
                onClick={() => setType(m as MedicineType)}
                className={`py-3 px-4 rounded-xl border-2 transition-all font-medium ${type === m ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md' : 'border-slate-100 bg-white text-slate-600'}`}
              >
                {t[m.toLowerCase()] || m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">{t.time}</label>
          <input 
            type="time" 
            value={time} 
            onChange={e => setTime(e.target.value)}
            className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl font-bold text-2xl focus:border-blue-600 focus:outline-none transition-all text-center"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Dosage</label>
          <input 
            type="text" 
            value={dosage} 
            onChange={e => setDosage(e.target.value)}
            className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl focus:border-blue-600 focus:outline-none"
            placeholder="e.g. 1 Drop"
          />
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-600 font-medium">This reminder will repeat daily for <span className="font-bold underline">1 month</span>.</p>
        </div>

        <button 
          onClick={() => onSave({ type, name: type, time, dosage, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] })}
          className="w-full py-5 bg-blue-600 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all mt-4 text-lg"
        >
          {t.save}
        </button>
      </div>
    </div>
  );
};

const SettingsPanel: React.FC<{ settings: AppSettings, setSettings: any, onBack: () => void, t: any }> = ({ settings, setSettings, onBack, t }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-xl font-bold">{t.settings}</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">{t.language}</label>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setSettings({ ...settings, language: 'en' })}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${settings.language === 'en' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              English
            </button>
            <button 
              onClick={() => setSettings({ ...settings, language: 'te' })}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${settings.language === 'te' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              తెలుగు
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">{t.voice}</label>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setSettings({ ...settings, voiceGender: 'female' })}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${settings.voiceGender === 'female' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              {t.female}
            </button>
            <button 
              onClick={() => setSettings({ ...settings, voiceGender: 'male' })}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${settings.voiceGender === 'male' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              {t.male}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Snooze Duration</label>
          <div className="grid grid-cols-3 gap-2">
            {[2, 5, 10].map(m => (
              <button
                key={m}
                onClick={() => setSettings({ ...settings, snoozeMinutes: m })}
                className={`py-3 rounded-xl border-2 font-bold transition-all ${settings.snoozeMinutes === m ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' : 'border-slate-100 bg-white text-slate-500'}`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="pt-8 border-t">
        <p className="text-center text-xs text-slate-400">EyeCare Voice Reminder v1.0.0</p>
      </div>
    </div>
  );
};

export default App;
