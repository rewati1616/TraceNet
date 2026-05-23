import { MissingPerson, Sighting, PoliceCase, AlertNotification, User } from './types';

// Let's create high-quality default vector avatar graphics or stock visuals for our default profiles
const FACE_MALE_1 = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop"; 
const FACE_CHILD_1 = "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=500&auto=format&fit=crop";
const FACE_ELDER_1 = "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=500&auto=format&fit=crop";
const FACE_FEMALE_1 = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500&auto=format&fit=crop";

export interface DBState {
  users: User[];
  cases: MissingPerson[];
  sightings: Sighting[];
  policeCases: PoliceCase[];
  notifications: AlertNotification[];
  cctvRecordings: { id: string; name: string; timestamp: string; duration: string }[];
}

const DEFAULT_STATE: DBState = {
  users: [
    {
      id: "u_1",
      name: "Inspector Sachin Kadam",
      email: "sachin.kadam@police.gov.in",
      phone: "+91 98200 12345",
      role: "police",
      badgeNumber: "MUP-81722",
      department: "Mumbai Crime Branch (Zone 4)"
    },
    {
      id: "u_2",
      name: "Radhika NGO Coordinator",
      email: "radhika@pukarngo.org",
      phone: "+91 88791 44556",
      role: "ngo"
    },
    {
      id: "u_3",
      name: "Anonymous Citizen",
      email: "citizen@tracenet.org",
      phone: "+91 91100 22334",
      role: "citizen"
    }
  ],
  cases: [
    {
      id: "case_1",
      name: "Aarav Sharma",
      age: 8,
      gender: "Male",
      status: "missing",
      priority: "child",
      lastSeenLocation: "Gateway of India, Colaba, Mumbai",
      lastSeenDate: "2026-05-22",
      lastSeenCoords: { lat: 18.9220, lng: 72.8347 },
      description: "Wearing a yellow cartoon t-shirt and blue shorts. Aarav has a small scar near his left eyebrow and speaks English and Hindi. Responds to the nickname 'Chiku'. He wandered away during a family trip near the waterfront.",
      features: ["Scar near left eyebrow", "Deep brown eyes", "Mole on right collarbone"],
      photos: [FACE_CHILD_1],
      reporterName: "Meera Sharma (Mother)",
      reporterContact: "+91 98765 43210",
      reporterId: "u_3",
      createdAt: "2026-05-22T14:30:00Z",
      caseNumber: "MN-2026-0941"
    },
    {
      id: "case_2",
      name: "Anant Deshmukh",
      age: 74,
      gender: "Male",
      status: "investigating",
      priority: "elderly",
      lastSeenLocation: "Saras Baug mandir entry, Pune",
      lastSeenDate: "2026-05-21",
      lastSeenCoords: { lat: 18.5018, lng: 73.8529 },
      description: "Suffers from advanced Alzheimer's disease. Speaks Marathi and broken Hindi. Walks with a mild limp; wearing a traditional white Nehru cap, light brown kurta, and carrying a brass pocket watch. May look disoriented or confused.",
      features: ["Alzheimer's patient", "Light limp on left leg", "Surgically treated cataract in both eyes"],
      photos: [FACE_ELDER_1],
      reporterName: "Sunil Deshmukh (Son)",
      reporterContact: "+91 96199 88776",
      reporterId: "ngo",
      createdAt: "2026-05-21T09:15:00Z",
      caseNumber: "MN-2026-0812"
    },
    {
      id: "case_3",
      name: "Priyanka Patil",
      age: 26,
      gender: "Female",
      status: "missing",
      priority: "medical",
      lastSeenLocation: "Phoenix Marketcity VIP entrance, Kurla, Mumbai",
      lastSeenDate: "2026-05-20",
      lastSeenCoords: { lat: 19.0865, lng: 72.8890 },
      description: "Requires daily insulin therapy for Type 1 Diabetes. Missing since Wednesday evening after shopping. Last wearing a green floral dress and carrying a black hand clutch. Left her phone and medical kit in her vehicle.",
      features: ["Type 1 Diabetic", "Long dark hair", "Wearing black fitness band on left wrist"],
      photos: [FACE_FEMALE_1],
      reporterName: "Anil Patil (Brother)",
      reporterContact: "+91 77380 55432",
      reporterId: "u_3",
      createdAt: "2026-05-20T18:40:00Z",
      caseNumber: "MN-2026-0715"
    },
    {
      id: "case_4",
      name: "Karan Johar",
      age: 31,
      gender: "Male",
      status: "found",
      priority: "normal",
      lastSeenLocation: "Marine Drive Promenade, Mumbai",
      lastSeenDate: "2026-05-15",
      lastSeenCoords: { lat: 18.9438, lng: 72.8228 },
      description: "Reported missing after failing to arrive at work. Found safe and sound in Goa four days later; reunited with active assistance of the local cyber team.",
      features: ["Short black hair", "Glasses"],
      photos: [FACE_MALE_1],
      reporterName: "Sanjay Johar (Father)",
      reporterContact: "+91 91234 56789",
      reporterId: "u_1",
      createdAt: "2026-05-15T08:00:00Z",
      caseNumber: "MN-2026-0551"
    }
  ],
  sightings: [
    {
      id: "s_1",
      missingPersonId: "case_1",
      location: "Colaba Causeway tea stall, Mumbai",
      coords: { lat: 18.9190, lng: 72.8330 },
      timestamp: "2026-05-22T16:45:00Z",
      reporterName: "Siddhesh Tawde (Vendor)",
      isAnonymous: false,
      description: "A boy matching Aarav's description was seen sitting with a local balloon seller holding a yellow cartoon shirt. Seemed hungry.",
      status: "verified",
      confidenceScore: 92.5,
      notes: "CCTV confirmed balloon seller and boy entered the alleyway at 16:50. Patrol team dispatched immediately."
    },
    {
      id: "s_2",
      missingPersonId: "case_1",
      location: "Marine Lines Station, Platform 2",
      coords: { lat: 18.9442, lng: 72.8242 },
      timestamp: "2026-05-23T04:20:00Z",
      reporterName: "Anonymous commuter",
      isAnonymous: true,
      description: "Heavy match registered. A young kid alone on the platform bench matching Gateway child.",
      status: "pending",
      confidenceScore: 84.0
    },
    {
      id: "s_3",
      missingPersonId: "case_2",
      location: "Swargate Bus Stand, Pune",
      coords: { lat: 18.5015, lng: 73.8635 },
      timestamp: "2026-05-22T11:20:00Z",
      reporterName: "Rajendra Shinde (Conductor)",
      isAnonymous: false,
      description: "An elderly gent speaking Marathi looked confused at the ticket counter. He asked for a ticket to Satara but didn't have enough money. Walked towards PMT buses parking.",
      status: "verified",
      confidenceScore: 87.0,
      notes: "Officer confirmed the brass watch and Nehru cap in Swargate bus camera snapshots."
    }
  ],
  policeCases: [
    {
      missingPersonId: "case_1",
      officerId: "u_1",
      officerName: "Inspector Sachin Kadam",
      caseNotes: [
        {
          id: "n_1",
          date: "2026-05-22T15:00:00Z",
          author: "Inspector Sachin Kadam",
          role: "police",
          comment: "First response initiated. Alerts broadcasted to all local Colaba beats. Requested marine patrol unit to scan water boundaries of Gateway waterfront."
        },
        {
          id: "n_2",
          date: "2026-05-22T17:20:00Z",
          author: "Inspector Sachin Kadam",
          role: "police",
          comment: "Validated Colaba Causeway sighting (S_1). Balloon seller in question was interviewed. Kid left with a stranger in a dark auto headed north. Cyber division checking auto registry camera details."
        }
      ]
    },
    {
      missingPersonId: "case_2",
      officerId: "u_1",
      officerName: "Inspector Sachin Kadam",
      caseNotes: [
        {
          id: "n_3",
          date: "2026-05-21T11:00:00Z",
          author: "Inspector Sachin Kadam",
          role: "police",
          comment: "Liaised with NGO Pukar to circulate posters in Pune local trains & temples. Saras Baug security footage analyzed - last seen walking south at 10:14 AM."
        }
      ]
    }
  ],
  notifications: [
    {
      id: "notif_1",
      title: "URGENT AMBER ALERT (MUMBAI)",
      description: "Aarav Sharma (8) missing from Gateway of India since 22 May. Wearing yellow t-shirt. High risk child missing.",
      timestamp: "2026-05-22T14:45:00Z",
      type: "urgent_amber",
      missingPersonId: "case_1",
      coords: { lat: 18.9220, lng: 72.8347 },
      radiusKm: 5
    },
    {
      id: "notif_2",
      title: "AMBER ALERT (PUNE)",
      description: "Anant Deshmukh (74) missing from Saras Baug. Advanced Alzheimer's condition. Walks with limp.",
      timestamp: "2026-05-21T09:30:00Z",
      type: "urgent_amber",
      missingPersonId: "case_2",
      coords: { lat: 18.5018, lng: 73.8529 },
      radiusKm: 10
    },
    {
      id: "notif_3",
      title: "CRITICAL SIGHTING ENROUTE PUNE",
      description: "Conductor reported Anant Deshmukh at Swargate Bus Terminal. Confident match.",
      timestamp: "2026-05-22T11:40:00Z",
      type: "sighting_matched",
      missingPersonId: "case_2"
    }
  ],
  cctvRecordings: [
    { id: "cctv_1", name: "Gateway Waterfront Cam-02", timestamp: "2026-05-22T14:15:00Z", duration: "03:15" },
    { id: "cctv_2", name: "Colaba Main Market-North West", timestamp: "2026-05-22T16:30:00Z", duration: "08:45" },
    { id: "cctv_3", name: "Terminal Entry PMT-Pune", timestamp: "2026-05-22T11:00:00Z", duration: "12:30" }
  ]
};

// Simple In-Memory Database Controller (persists in variable so it lives as long as server runs)
let dbState: DBState = { ...DEFAULT_STATE };

export function getDB(): DBState {
  return dbState;
}

export function saveDB(newState: Partial<DBState>) {
  dbState = { ...dbState, ...newState };
}

export function resetDB() {
  dbState = JSON.parse(JSON.stringify(DEFAULT_STATE));
}
