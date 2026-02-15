
import React from 'react';

export const TRANSLATIONS = {
  en: {
    appName: "EyeCare Voice",
    addMedicine: "Add Medicine",
    schedule: "Today's Schedule",
    settings: "Settings",
    medicineName: "Medicine Name",
    time: "Reminder Time",
    save: "Save Reminder",
    taken: "Taken",
    pending: "Pending",
    snooze: "Snooze (5m)",
    markAsTaken: "Mark as Taken",
    language: "Language",
    voice: "Voice Character",
    male: "Male (Puck)",
    female: "Female (Kore)",
    eyeDrops: "Eye Drops",
    ointment: "Ointment",
    moxifloxacin: "(1) Moxifloxacin",
    cmc: "(2) CMC",
    ganciclovir: "(3) Ganciclovir",
    reminderText: (med: string) => {
      if (med === 'Moxifloxacin') return "Please apply your number one, Moxifloxacin eye medicine now.";
      if (med === 'CMC') return "Please apply your number two, C.M.C eye medicine now.";
      if (med === 'Ganciclovir') return "Please apply your number three, Ganciclovir eye medicine now.";
      return `Please apply your ${med} eye medicine now.`;
    },
  },
  te: {
    appName: "కంటి రక్షణ",
    addMedicine: "మందును జోడించండి",
    schedule: "నేటి షెడ్యూల్",
    settings: "సెట్టింగులు",
    medicineName: "మందు పేరు",
    time: "జ్ఞాపక సమయం",
    save: "సేవ్ చేయండి",
    taken: "వేసుకున్నారు",
    pending: "వేసుకోవాలి",
    snooze: "5 నిమిషాల తర్వాత",
    markAsTaken: "వేసుకున్నాను",
    language: "భాష",
    voice: "వాయిస్",
    male: "పురుషుడు (Puck)",
    female: "స్త్రీ (Kore)",
    eyeDrops: "కంటి చుక్కలు",
    ointment: "మలయం",
    moxifloxacin: "(1) మాక్సిఫ్లోక్సాసిన్",
    cmc: "(2) సి.ఎం.సి",
    ganciclovir: "(3) గాన్సిక్లోవిర్",
    reminderText: (med: string) => {
      if (med === 'Moxifloxacin') return "దయచేసి ఇప్పుడు ఒకటో మందు, మాక్సిఫ్లోక్సాసిన్ కంటి చుక్కలు వేయండి.";
      if (med === 'CMC') return "దయచేసి ఇప్పుడు రెండో మందు, సి.ఎం.సి కంటి చుక్కలు వేయండి.";
      if (med === 'Ganciclovir') return "దయచేసి ఇప్పుడు మూడో మందు, గాన్సిక్లోవిర్ కంటి మలయం వేయండి.";
      return "దయచేసి ఇప్పుడు మీ కంటి మందు వేయండి.";
    }
  }
};

export const ICONS = {
  Eye: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.332.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
};
