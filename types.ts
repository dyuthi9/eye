
export type Language = 'en' | 'te';
export type VoiceGender = 'male' | 'female';
export type MedicineType = 'Moxifloxacin' | 'CMC' | 'Ganciclovir' | 'Other';

export interface Medicine {
  id: string;
  name: string;
  type: MedicineType;
  dosage: string;
  time: string; // HH:mm format
  days: string[]; // e.g., ["Mon", "Tue"...]
  takenToday: boolean;
  lastTakenTime?: number;
  startDate: number; // Timestamp
  durationDays: number;
}

export interface AppSettings {
  language: Language;
  voiceGender: VoiceGender;
  snoozeMinutes: number;
}

export interface ReminderAlert {
  medicine: Medicine;
  triggeredAt: number;
}
