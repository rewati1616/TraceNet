export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'citizen' | 'ngo' | 'police' | 'admin';
  badgeNumber?: string;
  department?: string;
}

export type PriorityLevel = 'normal' | 'child' | 'elderly' | 'medical';
export type CaseStatus = 'missing' | 'investigating' | 'found';

export interface MissingPerson {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  status: CaseStatus;
  priority: PriorityLevel;
  lastSeenLocation: string;
  lastSeenDate: string;
  lastSeenCoords: { lat: number; lng: number };
  description: string;
  features: string[]; // eye color, height, scars, etc.
  photos: string[]; // base64 or URL paths
  reporterName: string;
  reporterContact: string;
  reporterId: string;
  createdAt: string;
  ageProgressedPhoto?: string;
  ageProgressedYears?: number;
  caseNumber: string;
}

export interface Sighting {
  id: string;
  missingPersonId: string;
  location: string;
  coords: { lat: number; lng: number };
  timestamp: string;
  image?: string; // base64 or URL
  reporterName: string;
  isAnonymous: boolean;
  description: string;
  status: 'pending' | 'verified' | 'rejected';
  confidenceScore: number; // calculated by AI or admin matched
  notes?: string;
}

export interface InvestigationNote {
  id: string;
  date: string;
  author: string;
  role: string;
  comment: string;
}

export interface PoliceCase {
  missingPersonId: string;
  officerId: string;
  officerName: string;
  caseNotes: InvestigationNote[];
}

export interface AlertNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'urgent_amber' | 'sighting_matched' | 'system_update';
  missingPersonId?: string;
  coords?: { lat: number; lng: number };
  radiusKm?: number;
}
