import React, { useState, useEffect } from "react";
import { 
  Eye, Bell, Shield, MapPin, Users, Globe, Activity, Search, PlusCircle, 
  Map, Camera, AlertTriangle, User, Phone, CheckCircle, Clock, X, Info, 
  Share2, Share, ArrowRight, Grid, Calendar, RefreshCw, MapPinned, FileText, 
  Award, Sliders, ChevronRight, Check, CheckSquare, Upload, HelpCircle, Flame
} from "lucide-react";
import Navbar from "./components/Navbar";
import { MissingPerson, Sighting, AlertNotification, InvestigationNote, User as AppUser } from "./types";

// Translation Dictionary for English, Hindi, and Marathi
const t = {
  heroTitle: {
    en: "TRACE AND RECOVER SECURELY",
    hi: "सुरक्षित रूप से खोजें और पुनः प्राप्त करें",
    mr: "सुरक्षितपणे शोधून काढा आणि परत मिळवा"
  },
  heroSub: {
    en: "TraceNet coordinates direct citizen intelligence with state-of-the-art AI facial recognition layers, real-time geo-overlays, and tactical police dispatch tracking.",
    hi: "ट्रेसनेट अत्याधुनिक एआई चेहरा पहचान, रीयल-टाइम जियो-ओवरले और पुलिस प्रेषण ट्रैकिंग के साथ नागरिक खुफिया जानकारी को जोड़ता है।",
    mr: "ट्रेसनेट अत्याधुनिक AI चेहरा ओळख, रिअल-टाइम जिओ-ओवरले आणि पोलीस प्रेषण ट्रॅकिंगसह नागरिक गुप्तचर माहिती एकत्र करते."
  },
  reportBttn: {
    en: "Report Missing Person",
    hi: "लापता व्यक्ति की रिपोर्ट करें",
    mr: "बेपत्ता व्यक्तीची नोंद करा"
  },
  uploadPhoto: {
    en: "Upload Image File",
    hi: "छवि फ़ाइल अपलोड करें",
    mr: "फोटो फाईल अपलोड करा"
  },
  name: { en: "Name", hi: "नाम", mr: "नाव" },
  age: { en: "Age", hi: "आयु", mr: "वय" },
  gender: { en: "Gender", hi: "लिंग", mr: "लिंग" },
  lastSeen: { en: "Last Seen Location", hi: "अंतिम बार देखा गया स्थान", mr: "शेवटचे पाहिलेले ठिकाण" },
  lastSeenDate: { en: "Last Seen Date", hi: "अंतिम बार देखी गई तिथि", mr: "शेवटची पाहिलेली तारीख" },
  description: { en: "Brief Description & Physical Signs", hi: "संक्षिप्त विवरण और शारीरिक संकेत", mr: "थोडक्यात वर्णन आणि शारीरिक खुणा" },
  submit: { en: "Submit Report", hi: "रिपोर्ट जमा करें", mr: "अहवाल सादर करा" },
  successMsg: { en: "Reported successfully", hi: "सफलतापूर्वक रिपोर्ट किया गया", mr: "यशस्वीरित्या नोंद झाले" },
  priority: { en: "Priority Level", hi: "प्राथमिकता स्तर", mr: "प्राधान्य पातळी" },
  normal: { en: "Normal State", hi: "सामान्य स्थिति", mr: "सामान्य स्थिती" },
  child: { en: "Child Missing (Critical)", hi: "लापता बच्चा (गंभीर)", mr: "बेपत्ता मुल (अतिशय गंभीर)" },
  elderly: { en: "Elderly (Alzheimer/Dementia)", hi: "वृद्ध व्यक्ति (भूलने की बीमारी)", mr: "वृद्ध व्यक्ती (स्मृतीभ्रंश)" },
  medical: { en: "Critical Medical Condition", hi: "गंभीर चिकित्सा स्थिति", mr: "गंभीर वैद्यकीय परिस्थिती" },
  landmarkTitle: {
    en: "Forensic Facial Scan",
    hi: "फोरेंसिक चेहरा स्कैन",
    mr: "फॉरेन्सिक चेहरा स्कॅन"
  }
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [lang, setLang] = useState<'en' | 'hi' | 'mr'>("en");
  const [userRole, setUserRole] = useState<'citizen' | 'ngo' | 'police'>("citizen");

  // Global State Stores
  const [cases, setCases] = useState<MissingPerson[]>([]);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [stats, setStats] = useState<any>({
    totalCases: 0,
    activeCases: 0,
    foundCases: 0,
    totalSightings: 0,
    pendingSightings: 0,
    heatmapSightings: []
  });

  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; text: string; type: 'success' | 'alert' | 'info' }[]>([]);

  // Selected object states for interactive modals/drawers
  const [selectedCase, setSelectedCase] = useState<MissingPerson | null>(null);
  const [showShareModal, setShowShareModal] = useState<MissingPerson | null>(null);
  const [ageProgressResult, setAgeProgressResult] = useState<any>(null);
  const [targetProgressionAge, setTargetProgressionAge] = useState<number>(18);
  const [ageProgressLoading, setAgeProgressLoading] = useState(false);

  // CCTV Scanning simulation state
  const [cctvTarget, setCctvTarget] = useState<string>("cctv_1");
  const [cctvScanning, setCctvScanning] = useState(false);
  const [cctvFrames, setCctvFrames] = useState<any[]>([]);
  const [cctvSummaryMsg, setCctvSummaryMsg] = useState("");

  // Standalone Face Match state
  const [faceMatchFile, setFaceMatchFile] = useState<string | null>(null);
  const [faceMatchResult, setFaceMatchResult] = useState<any[]>([]);
  const [faceMatchLoading, setFaceMatchLoading] = useState(false);

  // Form States for Reporting Person
  const [createForm, setCreateForm] = useState({
    name: "",
    age: "12",
    gender: "Male",
    p_level: "child",
    lastSeenLocation: "",
    lastSeenDate: "2026-05-22",
    description: "",
    reporterName: "",
    reporterContact: "",
    features: ""
  });
  const [selectedFileStr, setSelectedFileStr] = useState<string>("");

  // Form States for Sighting Senders
  const [sightingForm, setSightingForm] = useState({
    missingPersonId: "",
    location: "",
    description: "",
    reporterName: "",
    isAnonymous: false,
    imageStr: ""
  });

  // Police Official Notes Form
  const [newPoliceNoteText, setNewPoliceNoteText] = useState("");
  const [policeCaseNotes, setPoliceCaseNotes] = useState<InvestigationNote[]>([]);

  // Custom Interactive MAP MapState coordinates
  const [activeMapCoords, setActiveMapCoords] = useState<{ lat: number; lng: number; title: string }>({
    lat: 19.0760,
    lng: 72.8777,
    title: "Mumbai Center"
  });

  // Trigger Toast Notification utility
  const addToast = (text: string, type: 'success' | 'alert' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5500);
  };

  // Run on initial load and whenever primary views change
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Cases
      const casesRes = await fetch("/api/cases");
      if (casesRes.ok) {
        const casesData = await casesRes.json();
        setCases(casesData);
        if (casesData.length > 0 && !selectedCase) {
          // Set initial default selected case for map plotting & details views
          setSelectedCase(casesData[0]);
          setActiveMapCoords({
            lat: casesData[0].lastSeenCoords.lat,
            lng: casesData[0].lastSeenCoords.lng,
            title: casesData[0].lastSeenLocation
          });
        }
      }

      // 2. Fetch Sightings
      const sightRes = await fetch("/api/sightings");
      if (sightRes.ok) {
        const sightData = await sightRes.json();
        setSightings(sightData);
      }

      // 3. Fetch Notifications
      const notRes = await fetch("/api/notifications");
      if (notRes.ok) {
        const notData = await notRes.json();
        setNotifications(notData);
      }

      // 4. Fetch Stats
      const statsRes = await fetch("/api/police/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (e) {
      addToast("Failed to connect to digital nodes. Running in offline sandbox.", "alert");
    } finally {
      setLoading(false);
    }
  };

  // Fetch police notes for selected case
  useEffect(() => {
    if (selectedCase) {
      fetch(`/api/cases/${selectedCase.id}/police-notes`)
        .then(res => res.json())
        .then(data => {
          setPoliceCaseNotes(data.caseNotes || []);
        })
        .catch(() => {});
    }
  }, [selectedCase]);

  // Convert uploaded image directly into Base64 representation to stream values
  const handleImageUploadBase64 = (e: React.ChangeEvent<HTMLInputElement>, isSighting: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isSighting) {
          setSightingForm(prev => ({ ...prev, imageStr: reader.result as string }));
        } else {
          setSelectedFileStr(reader.result as string);
        }
        addToast(`Image parsed successfully (${(file.size / 1024).toFixed(0)} KB)`, "success");
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit report missing person case to database
  const handleSubmitNewCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.lastSeenLocation || !createForm.lastSeenDate) {
      addToast("Please fill all mandatory fields correctly.", "alert");
      return;
    }

    try {
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createForm.name,
          age: createForm.age,
          gender: createForm.gender,
          p_level: createForm.p_level,
          lastSeenLocation: createForm.lastSeenLocation,
          lastSeenDate: createForm.lastSeenDate,
          description: createForm.description,
          features: createForm.features.split(",").map(f => f.trim()).filter(Boolean),
          photos: selectedFileStr ? [selectedFileStr] : [],
          reporterName: createForm.reporterName,
          reporterContact: createForm.reporterContact
        })
      });

      if (response.ok) {
        addToast(`Case file for ${createForm.name} added to TraceNet database.`, "success");
        // Reset states
        setCreateForm({
          name: "",
          age: "12",
          gender: "Male",
          p_level: "child",
          lastSeenLocation: "",
          lastSeenDate: "2026-05-22",
          description: "",
          reporterName: "",
          reporterContact: "",
          features: ""
        });
        setSelectedFileStr("");
        setCurrentPage("feed");
      } else {
        const err = await response.json();
        addToast(err.error || "Submission failed", "alert");
      }
    } catch (e) {
      addToast("Server connection error during registry creation.", "alert");
    }
  };

  // Submit user sighting report
  const handleSubmitSighting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sightingForm.missingPersonId || !sightingForm.location) {
      addToast("Please choose a missing person and specify where they were spotted.", "alert");
      return;
    }

    try {
      addToast("Analyzing uploaded sighting file using TraceNet AI Engine...", "info");
      const res = await fetch("/api/sightings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missingPersonId: sightingForm.missingPersonId,
          location: sightingForm.location,
          image: sightingForm.imageStr || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500&auto=format&fit=crop",
          reporterName: sightingForm.isAnonymous ? "Anonymous Citizen" : sightingForm.reporterName,
          isAnonymous: sightingForm.isAnonymous,
          description: sightingForm.description
        })
      });

      if (res.ok) {
        const data = await res.json();
        addToast(`Sighting alert sent. AI Match confidence score: ${data.confidenceScore}%`, "success");
        setSightingForm({
          missingPersonId: "",
          location: "",
          description: "",
          reporterName: "",
          isAnonymous: false,
          imageStr: ""
        });
        setCurrentPage("landing");
      } else {
        addToast("Failed to upload sighting.", "alert");
      }
    } catch (e) {
      addToast("Submission error on TraceNet uplink.", "alert");
    }
  };

  // Run AI Facial Scans on uploaded standalone files
  const handleFaceMatchSearch = async () => {
    if (!faceMatchFile) {
      addToast("Please upload or drag a high-contrast face photograph.", "alert");
      return;
    }

    setFaceMatchLoading(true);
    try {
      const res = await fetch("/api/ai/match-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: faceMatchFile })
      });

      if (res.ok) {
        const data = await res.json();
        setFaceMatchResult(data.matches || []);
        addToast(`Found ${data.matches?.length || 0} relative likeness metrics matched.`, "success");
      } else {
        addToast("Error communicating with microservice.", "alert");
      }
    } catch (e) {
      addToast("Face Recognition network timed out.", "alert");
    } finally {
      setFaceMatchLoading(false);
    }
  };

  // Submit modern AI Age progression simulation
  const handleRunAgeProgression = async (caseId: string) => {
    setAgeProgressLoading(true);
    setAgeProgressResult(null);
    try {
      const res = await fetch(`/api/cases/${caseId}/age-progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetAge: targetProgressionAge })
      });

      if (res.ok) {
        const data = await res.json();
        setAgeProgressResult(data);
        addToast(`Forensic model simulated successfully to ${targetProgressionAge} years.`, "success");
        
        // Update case list so it reflects aged parameters
        setCases(prev => prev.map(c => c.id === caseId ? { ...c, ageProgressedPhoto: data.progressedPhoto, ageProgressedYears: targetProgressionAge } : c));
      } else {
        addToast("Age progression generator crashed.", "alert");
      }
    } catch (e) {
      addToast("Uplink failed during progression rendering.", "alert");
    } finally {
      setAgeProgressLoading(false);
    }
  };

  // CCTV Video analysis frame trigger simulation
  const handleCctvNeuromorphicScan = async () => {
    setCctvScanning(true);
    setCctvFrames([]);
    setCctvSummaryMsg("Booting automatic frame extraction sequence...");

    setTimeout(async () => {
      try {
        const res = await fetch("/api/ai/cctv-scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cctvName: cctvTarget })
        });

        if (res.ok) {
          const data = await res.json();
          setCctvFrames(data.matchedFrames || []);
          setCctvSummaryMsg(data.summary || "");
          addToast("Found match detections in CCTV log streams.", "success");
        }
      } catch (e) {
        addToast("Error reading stream frames.", "alert");
      } finally {
        setCctvScanning(false);
      }
    }, 2800);
  };

  // Submit Official Police Case Notes
  const handleAddOfficialNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !newPoliceNoteText.trim()) return;

    try {
      const res = await fetch(`/api/cases/${selectedCase.id}/police-notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: "Inspector Sachin Kadam",
          role: "police",
          comment: newPoliceNoteText
        })
      });

      if (res.ok) {
        const data = await res.json();
        setPoliceCaseNotes(data.caseNotes || []);
        setNewPoliceNoteText("");
        addToast("Chronological log entry pushed with digital police stamp.", "success");
      }
    } catch (e) {
      addToast("Failed to write case notes.", "alert");
    }
  };

  // Change Case State (e.g., Change missing to found)
  const handleChangeCaseStatus = async (caseId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/cases/${caseId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        addToast(`Case status successfully logged as ${newStatus.toUpperCase()}`, "success");
        setCases(prev => prev.map(c => c.id === caseId ? { ...c, status: newStatus as any } : c));
        // Reset local selected representation state
        if (selectedCase && selectedCase.id === caseId) {
          setSelectedCase(prev => prev ? { ...prev, status: newStatus as any } : null);
        }
      }
    } catch (e) {
      addToast("Could not update case status on server.", "alert");
    }
  };

  // Verify Sighting report status (Approve or Reject)
  const handleVerifySighting = async (sightingId: string, verifStatus: 'verified' | 'rejected') => {
    try {
      const res = await fetch(`/api/sightings/${sightingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: verifStatus })
      });

      if (res.ok) {
        addToast(`Sighting cataloged as ${verifStatus.toUpperCase()}`, "success");
        setSightings(prev => prev.map(s => s.id === sightingId ? { ...s, status: verifStatus } : s));
      }
    } catch (e) {
      addToast("Fail verifying sighting data.", "alert");
    }
  };

  // Quick helper reset DB action
  const handleFormatSandboxUplink = async () => {
    if (confirm("Reset local database state to initial mock reports?")) {
      const res = await fetch("/api/reset-db", { method: "POST" });
      if (res.ok) {
        addToast("TraceNet memory database wiped and re-seeded.", "info");
        fetchData();
      }
    }
  };

  // Filter missing persons list based on active page criteria
  const filteredCases = cases.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.lastSeenLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === "all" || c.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col antialiased selection:bg-blue-500/30 selection:text-white pb-10">
      
      {/* Dynamic Toast popup container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 max-w-sm w-full pointer-events-none" id="toast_container">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border flex gap-3 shadow-2xl items-start transition-all duration-300 animate-in slide-in-from-right-10 ${
              toast.type === 'alert' 
                ? 'bg-red-950/95 border-red-700/60 text-red-100 shadow-red-950/50' 
                : toast.type === 'info'
                ? 'bg-indigo-950 border-indigo-700/60 text-indigo-100 shadow-indigo-950/50'
                : 'bg-slate-900 border-blue-500/40 text-blue-100 shadow-blue-950/50'
            }`}
          >
            {toast.type === 'alert' ? (
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-xs font-mono font-bold tracking-wider opacity-60">SYSTEM EVENT</p>
              <p className="text-sm font-sans font-medium leading-relaxed">{toast.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Primary Navigation Hub */}
      <Navbar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        lang={lang}
        setLang={setLang}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Main Structural Layout Frame */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* LANDING PAGE / ACTIVE PANELS OVERVIEW */}
        {currentPage === "landing" && (
          <div className="space-y-10" id="landing_page">
            {/* Ambient background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-500/5 blur-3xl pointer-events-none rounded-full"></div>

            {/* HERO PANEL BLOCK */}
            <section className="text-center space-y-6 pt-6 relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-[10px] md:text-xs font-mono border border-blue-500/20 font-bold uppercase tracking-widest shadow-inner">
                <Flame className="h-4 w-4 text-red-500 animate-bounce" />
                NEURAL RECONNAISSANCE ONLINE : {cases.filter(c => c.status !== 'found').length} ACTIVE TARGETS
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white font-sans max-w-3xl mx-auto leading-[1.1]">
                {t.heroTitle[lang]}
              </h1>
              
              <p className="text-sm md:text-base text-slate-400 font-sans max-w-2xl mx-auto leading-relaxed">
                {t.heroSub[lang]}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  id="bttn_report_missing_hero"
                  onClick={() => setCurrentPage("report_person")}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 text-white font-bold text-sm tracking-wide transition-all flex items-center space-x-2 border border-blue-400/20"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>{t.reportBttn[lang]}</span>
                </button>
                <button
                  id="bttn_goto_matching_hero"
                  onClick={() => setCurrentPage("ai_match_search")}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-300 border border-slate-800 text-sm font-bold tracking-wide transition flex items-center space-x-2"
                >
                  <Eye className="h-5 w-5 text-blue-400" />
                  <span>Run Facial Search</span>
                </button>
                <button
                  id="bttn_goto_cctv_hero"
                  onClick={() => setCurrentPage("cctv_scan")}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-300 border border-slate-800 text-sm font-bold tracking-wide transition flex items-center space-x-2"
                >
                  <Shield className="h-5 w-5 text-indigo-400" />
                  <span>Scan CCTV Footage</span>
                </button>
              </div>
            </section>

            {/* BENTO STATISTICAL COUNTERS BAR */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats_bar">
              <div className="bg-slate-900/40 rounded-3xl p-5 border border-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/20 transition-all">
                <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Users className="h-10 w-10 text-blue-400" />
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2">Total System Cases</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{stats.totalCases}</span>
                  <span className="text-xs text-slate-400 font-mono">Recorded</span>
                </div>
              </div>

              <div className="bg-slate-900/40 rounded-3xl p-5 border border-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-red-500/20 transition-all">
                <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <AlertTriangle className="h-10 w-10 text-red-500 animate-pulse" />
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2">Active Missing Persons</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-red-400">{stats.activeCases}</span>
                  <span className="text-xs text-red-400/60 font-mono">Searching</span>
                </div>
              </div>

              <div className="bg-slate-900/40 rounded-3xl p-5 border border-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-green-500/20 transition-all">
                <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <CheckCircle className="h-10 w-10 text-green-400" />
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Located & Returned</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-green-400">{stats.foundCases}</span>
                  <span className="text-xs text-green-400/60 font-mono">Recovered</span>
                </div>
              </div>

              <div className="bg-slate-900/40 rounded-3xl p-5 border border-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-indigo-500/20 transition-all">
                <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Activity className="h-10 w-10 text-indigo-400" />
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Citizen Logs Sent</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-indigo-400">{stats.totalSightings}</span>
                  <span className="text-xs text-indigo-400/60 font-mono">Spot Verified</span>
                </div>
              </div>
            </div>

            {/* INTEGRATED EMERGENCY INTERACTIVE MAP OVERLAY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="map_dashboard_segment">
              <div className="lg:col-span-8 bg-slate-900/45 border border-white/5 rounded-3xl p-6 relative flex flex-col min-h-[440px] overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 z-10">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Map className="h-5 w-5 text-blue-500" />
                      TraceNet Tactical Geo-Overlay
                    </h3>
                    <p className="text-xs text-slate-400">Interactive live marker tracking missing cases & verified citizen report heat maps</p>
                  </div>
                  <div className="px-3 py-1 rounded bg-[#020617] border border-slate-800 text-[10px] font-mono font-bold text-slate-400">
                    LAT: {activeMapCoords.lat.toFixed(4)} | LNG: {activeMapCoords.lng.toFixed(4)}
                  </div>
                </div>

                {/* THE MAP VECTOR GRAPHIC INTERACTIVE GRID */}
                <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-850 relative overflow-hidden min-h-[280px]">
                  
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10 pointer-events-none">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div key={i} className="border-t border-l border-white"></div>
                    ))}
                  </div>

                  {/* Radiating wave animations representing radar */}
                  <div className="absolute top-[35%] left-[55%] -translate-x-1/2 -translate-y-1/2 h-44 w-44 rounded-full border border-blue-500/10 animate-ping opacity-30 pointer-events-none"></div>
                  <div className="absolute top-[35%] left-[55%] -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full border border-blue-500/5 animate-ping opacity-20 pointer-events-none"></div>

                  {/* Sighting markers plotting on our map visualization */}
                  {sightings.map((sight, index) => {
                    // map numeric layout offset calculation
                    const xPercent = 30 + (sight.coords.lng - 72.8) * 450;
                    const yPercent = 80 - (sight.coords.lat - 18.9) * 220;
                    const isSelected = selectedCase && selectedCase.id === sight.missingPersonId;

                    return (
                      <button
                        key={sight.id}
                        onClick={() => {
                          const associated = cases.find(c => c.id === sight.missingPersonId);
                          if (associated) {
                            setSelectedCase(associated);
                            setActiveMapCoords({ lat: sight.coords.lat, lng: sight.coords.lng, title: sight.location });
                            addToast(`Plotting Sighting: ${sight.location}`, "info");
                          }
                        }}
                        className="absolute group z-20 cursor-pointer pointer-events-auto transition text-left"
                        style={{
                          left: `${Math.max(10, Math.min(90, xPercent))}%`,
                          top: `${Math.max(10, Math.min(90, yPercent))}%`
                        }}
                      >
                        <span className="relative flex h-5.5 w-5.5 items-center justify-center">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            sight.status === 'verified' ? 'bg-emerald-400' : 'bg-orange-400'
                          }`}></span>
                          <span className={`relative inline-flex rounded-full h-3.5 w-3.5 items-center justify-center ${
                            sight.status === 'verified' ? 'bg-emerald-500' : 'bg-orange-500'
                          } text-[8px] font-bold text-slate-950`}>
                            {index + 1}
                          </span>
                        </span>

                        {/* Hover card */}
                        <div className="absolute hidden group-hover:block bottom-6 left-0 w-48 bg-slate-950/95 border border-slate-800 p-2.5 rounded-lg shadow-2xl backdrop-blur-md z-40 pointer-events-none text-xs">
                          <p className="font-bold text-white mb-0.5 font-mono">SIGHTING RECORD</p>
                          <p className="text-[10px] text-slate-400 truncate">{sight.location}</p>
                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-[10px] text-blue-400 font-bold">AI Match Ratio:</span>
                            <span className="text-[10px] bg-blue-950 text-blue-300 font-mono font-bold px-1 rounded">{sight.confidenceScore}%</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {/* Active Target Last Seen anchor markers */}
                  {cases.slice(0, 3).map((item, index) => {
                    const xPercent = 40 + (item.lastSeenCoords.lng - 72.8) * 400;
                    const yPercent = 70 - (item.lastSeenCoords.lat - 18.9) * 200;
                    const isActiveSelected = selectedCase?.id === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedCase(item);
                          setActiveMapCoords({ lat: item.lastSeenCoords.lat, lng: item.lastSeenCoords.lng, title: item.lastSeenLocation });
                        }}
                        className="absolute group z-30 cursor-pointer pointer-events-auto transition text-left"
                        style={{
                          left: `${Math.max(10, Math.min(90, xPercent))}%`,
                          top: `${Math.max(10, Math.min(90, yPercent))}%`
                        }}
                      >
                        <div className="flex items-center gap-1.5 bg-slate-950/95 border border-blue-500/40 p-1 rounded-full shadow-lg">
                          <span className="relative flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border border-white flex-shrink-0"></span>
                          </span>
                          <span className="text-[10px] text-white font-mono font-bold pr-1.5 hidden xl:inline">{item.name.split(" ")[0]}</span>
                        </div>

                        {/* Interactive popup detailed node */}
                        {isActiveSelected && (
                          <div className="absolute bottom-8 -left-12 w-56 bg-slate-950 border-2 border-blue-500/60 p-3 rounded-xl shadow-2xl backdrop-blur z-50 pointer-events-auto">
                            <div className="flex justify-between items-start gap-1 pb-1.5 border-b border-slate-800">
                              <span className="font-bold text-xs text-white uppercase tracking-tight">{item.name} ({item.age})</span>
                              <span className="text-[8px] bg-red-950 text-red-400 px-1 py-0.2 rounded font-mono font-bold uppercase">{item.priority}</span>
                            </div>
                            <p className="text-[10px] text-slate-300 mt-1 lines-clamp-2 leading-tight italic">Last seen at: "{item.lastSeenLocation}"</p>
                            <div className="mt-2 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                              <span>Date: {item.lastSeenDate}</span>
                              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}

                  {/* Geographic Overlay legends */}
                  <div className="absolute bottom-3 left-3 p-2 bg-[#020617]/90 border border-slate-800 rounded-lg text-[10px] space-y-1">
                    <p className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Legend Markers</p>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-600"></span>
                      <span className="text-slate-300">Last Seen Anchor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span className="text-slate-300">Verified Sighting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                      <span className="text-slate-300">Pending Sighting</span>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 text-slate-500 text-[11px] font-mono tracking-tighter bg-slate-950/80 p-2 rounded border border-slate-850">
                    <p>RADAR SWEEP: PASS</p>
                    <p className="text-blue-400">FPS: 60 // PING: 12ms</p>
                  </div>
                </div>

                {/* Sighting alert quick trigger strip */}
                <div className="mt-4 p-3 bg-blue-950/20 border border-blue-900/40 rounded-2xl flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8.5 w-8.5 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <MapPinned className="h-4.5 w-4.5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">Spotted someone matching a file?</p>
                      <p className="text-[11px] text-slate-400">Submit coordinates with snapshot anonymously or verified.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // Pre-fill default sighting fields
                      if (selectedCase) {
                        setSightingForm(prev => ({ ...prev, missingPersonId: selectedCase.id }));
                      }
                      setCurrentPage("report_sighting");
                    }}
                    className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
                  >
                    Report Sighting Here
                  </button>
                </div>
              </div>

              {/* RIGHT SIDEBAR: QUICK ACTION SIGHTINGS TRACK & AGE PROGRESS DETAILS */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* PREVIEW CONTAINER FOR SELECTED MISSING TARGET */}
                <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 backdrop-blur-sm shadow-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">SELECTED FOCUS PROFILE</h4>
                    <span className="text-[10px] bg-red-950 text-red-400 font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                      {selectedCase?.priority || "child"} EMERGENCY
                    </span>
                  </div>

                  {selectedCase ? (
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-950 relative border-2 border-blue-900/40 flex-shrink-0">
                          <img 
                            src={selectedCase.photos[0]} 
                            alt={selectedCase.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-1 right-1 bg-slate-950/80 px-1 rounded text-[8px] font-mono font-bold text-blue-400 uppercase">
                            FILE
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-black text-white truncate leading-tight tracking-tight">{selectedCase.name}</h4>
                          <p className="text-xs font-mono text-slate-400 mt-1">Age: <span className="font-bold text-slate-200">{selectedCase.age} years</span></p>
                          <p className="text-xs font-mono text-slate-400">Gender: <span className="font-bold text-slate-200">{selectedCase.gender}</span></p>
                          <p className="text-[11px] text-slate-400 mt-1 uppercase font-mono tracking-tighter text-blue-400">{selectedCase.caseNumber}</p>
                          
                          {/* Case Status Badge */}
                          <div className="mt-2.5">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              selectedCase.status === 'missing' 
                                ? 'bg-red-950 text-red-400 border border-red-900/40' 
                                : selectedCase.status === 'investigating'
                                ? 'bg-indigo-950 text-indigo-300 border border-indigo-900/40'
                                : 'bg-green-950 text-green-300 border border-green-900/40'
                            }`}>
                              ● {selectedCase.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                        <p className="font-bold text-slate-400 font-mono text-[10px] uppercase mb-1">Last Tracker details</p>
                        <p className="mb-1.5"><strong className="text-slate-400">Location:</strong> {selectedCase.lastSeenLocation}</p>
                        <p className="line-clamp-3 text-slate-300"><strong className="text-slate-400">Features:</strong> {selectedCase.description}</p>
                      </div>

                      {/* AGE PROGRESSION INTERACTIVE DRAWER CONTROLLER */}
                      <div className="bg-gradient-to-tr from-indigo-950/40 to-slate-900/30 p-4 rounded-2xl border border-indigo-900/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Sliders className="h-4.5 w-4.5 text-indigo-400" />
                          <h5 className="text-xs font-bold text-indigo-200 uppercase tracking-wide">AI Age Progression Predictor</h5>
                        </div>
                        <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">
                          Forensically model aging parameters to see what the missing child might look like now.
                        </p>

                        <div className="flex items-center justify-between gap-3 text-xs mb-3 font-mono">
                          <label className="text-slate-400">Target Proj. Age:</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              min={selectedCase.age + 1}
                              max={selectedCase.age + 30}
                              value={targetProgressionAge}
                              onChange={(e) => setTargetProgressionAge(Number(e.target.value))}
                              className="w-14 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-center text-white font-bold"
                            />
                            <span className="text-slate-500">years</span>
                          </div>
                        </div>

                        {selectedCase.ageProgressedPhoto && (
                          <div className="mb-3.5 p-2 bg-slate-950 rounded-xl border border-slate-850 flex gap-2 items-center">
                            <img 
                              src={selectedCase.ageProgressedPhoto} 
                              alt="Progressed projection" 
                              className="w-11 h-11 object-cover rounded-md border border-indigo-500/20"
                            />
                            <div className="text-[10px] leading-tight flex-1">
                              <p className="font-bold text-indigo-400">Prediction Cached</p>
                              <p className="text-slate-400">Simulate file to +{targetProgressionAge - selectedCase.age}y</p>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => handleRunAgeProgression(selectedCase.id)}
                          disabled={ageProgressLoading}
                          className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-950 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                        >
                          {ageProgressLoading ? (
                            <>
                              <RefreshCw className="h-3 w-3 animate-spin" />
                              <span>Mapping facial structure changes...</span>
                            </>
                          ) : (
                            <>
                              <Sliders className="h-3.5 w-3.5" />
                              <span>Forecast aged face at {targetProgressionAge}y</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* SHARE BROADCAST AUTO-POST CREATION CARD */}
                      <button
                        onClick={() => setShowShareModal(selectedCase)}
                        className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                      >
                        <Share2 className="h-4 w-4 text-blue-400" />
                        <span>Instant Social Media Card</span>
                      </button>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      <HelpCircle className="h-8 w-8 mx-auto text-slate-700 mb-2 animate-pulse" />
                      Please register a missing case vector to execute diagnostic profiles.
                    </div>
                  )}
                </div>

                {/* SENSITIVE LOCAL POLICE NOTIFICATIONS SUMMARY */}
                <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 backdrop-blur-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Live Drone Alert Stream</h4>
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                  </div>
                  
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {notifications.slice(0, 3).map(notif => (
                      <div key={notif.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-850 text-[11px] leading-relaxed relative">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-red-400 uppercase tracking-tight font-mono">{notif.title}</span>
                          <span className="text-[9px] text-slate-500">{new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-slate-300 font-sans">{notif.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* DIRECT CASE REDIRECT GRID LINK */}
            <div className="pt-6 text-center">
              <button
                onClick={() => setCurrentPage("feed")}
                className="inline-flex items-center gap-2 group px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-300 hover:text-white transition"
              >
                <span>Navigate to full Active Trace Database Grid</span>
                <ArrowRight className="h-3 w-3 text-blue-500 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>

          </div>
        )}


        {/* MISSING PERSONS LISTINGS / FEED PAGE */}
        {currentPage === "feed" && (
          <div className="space-y-6" id="cases_feed_page">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-500" />
                  Active Search Records Database
                </h2>
                <p className="text-xs text-slate-400">Search and verify profiles, physical signs, priority emergency tags, and view forensic aged simulations.</p>
              </div>
              <button
                onClick={() => setCurrentPage("report_person")}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Missing Case</span>
              </button>
            </div>

            {/* ADVANCED FILTER FORM PANEL */}
            <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search text field */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Query Name, Case or Area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-[#020617] text-white border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-mono"
                />
              </div>

              {/* Status Selector dropdown */}
              <div className="flex gap-3 w-full md:w-auto items-center justify-end">
                <div className="flex items-center gap-1.5 bg-[#020617] px-2 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">Priority:</span>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="bg-transparent text-xs text-slate-200 border-none font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="all">ALL CASES</option>
                    <option value="child">CHILDREN ONLY</option>
                    <option value="elderly">ELDERLY (ALZHEIMER)</option>
                    <option value="medical">MEDICAL PRIORITY</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-[#020617] px-2 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-xs text-slate-200 border-none font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="all">ANY STATE</option>
                    <option value="missing">STILL MISSING</option>
                    <option value="investigating">UNDER TACTICAL STUDY</option>
                    <option value="found">FOUND SAFE & CLOSED</option>
                  </select>
                </div>
              </div>

            </div>

            {/* RESULTS DIRECT FEED CARDS GRID */}
            {filteredCases.length === 0 ? (
              <div className="py-24 text-center rounded-3xl bg-slate-900/20 border border-slate-900">
                <HelpCircle className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-400">No trace matches found for your current search parameters.</p>
                <button
                  onClick={() => { setSearchQuery(""); setStatusFilter("all"); setPriorityFilter("all"); }}
                  className="mt-3.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-xs text-slate-300 font-bold rounded-lg transition"
                >
                  Clear System Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map((item) => {
                  const hasAgeProgressed = !!item.ageProgressedPhoto;
                  return (
                    <div 
                      key={item.id} 
                      className={`group bg-slate-900/40 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                        selectedCase?.id === item.id 
                          ? 'border-blue-500/40 shadow-blue-500/10 shadow-2xl bg-indigo-950/20' 
                          : 'border-white/5 hover:border-blue-500/20 shadow-lg'
                      }`}
                    >
                      {/* Alert status tag ribbon */}
                      <div className="absolute top-3.5 right-3.5 z-10 flex gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${
                          item.priority === 'child' ? 'bg-red-950 text-red-400' : 'bg-slate-900/90 text-slate-300'
                        }`}>
                          {item.priority}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-slate-905 text-blue-400 uppercase tracking-wider">
                          {item.caseNumber}
                        </span>
                      </div>

                      {/* Card Content Header Media */}
                      <div className="p-5 flex gap-4">
                        
                        <div className="relative">
                          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative z-0">
                            {hasAgeProgressed ? (
                              <img 
                                src={item.ageProgressedPhoto} 
                                alt={`${item.name} simulated aged`} 
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <img 
                                src={item.photos[0]} 
                                alt={item.name} 
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                              />
                            )}
                          </div>
                          
                          {/* Indicator badge if photo is aged progression simulated */}
                          {hasAgeProgressed && (
                            <span className="absolute -bottom-2 -right-1 bg-indigo-600 border border-indigo-400 text-white rounded px-1.5 py-0.2 text-[8px] font-mono font-bold uppercase shadow-2xl">
                              AGED PROFILE
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-black text-white leading-tight font-sans truncate">{item.name}</h3>
                          <p className="text-[11px] font-mono text-slate-400 mt-1">Age Check: <span className="text-slate-200 font-bold">{item.age}y</span></p>
                          <p className="text-[11px] font-mono text-slate-400 mt-0.5">Gender Field: {item.gender}</p>
                          
                          <div className="mt-2 text-[10px] text-slate-400 line-clamp-2">
                            {item.description}
                          </div>

                          <div className="mt-2.5">
                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              item.status === 'missing' 
                                ? 'bg-red-950/70 text-red-400 border border-red-900/30' 
                                : item.status === 'investigating'
                                ? 'bg-indigo-950/70 text-indigo-300 border border-indigo-900/40'
                                : 'bg-green-950/70 text-green-300 border border-green-900/40'
                            }`}>
                              ● {item.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                      </div>

                      {/* Technical physical identifiers tags strip */}
                      {item.features && item.features.length > 0 && (
                        <div className="px-5 pb-3">
                          <div className="flex flex-wrap gap-1">
                            {item.features.slice(0, 3).map((feat, fIdx) => (
                              <span key={fIdx} className="text-[9px] bg-slate-950/60 border border-slate-850 px-1.5 py-0.5 rounded text-slate-400 font-sans">
                                #{feat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer Actions Strip inside Case Cards */}
                      <div className="px-5 py-3 bg-[#020617]/40 border-t border-slate-900/60 flex items-center justify-between gap-2 rounded-b-3xl">
                        <button
                          onClick={() => {
                            setSelectedCase(item);
                            setActiveMapCoords({
                              lat: item.lastSeenCoords.lat,
                              lng: item.lastSeenCoords.lng,
                              title: item.lastSeenLocation
                            });
                            // scroll or redirect focus slightly to map if wanted
                            window.scrollTo({ top: 320, behavior: 'smooth' });
                            addToast(`Plotting anchor location for ${item.name}`, "info");
                          }}
                          className="text-[10px] font-bold text-blue-400 hover:text-white transition flex items-center gap-1 font-mono uppercase"
                        >
                          <MapPin className="h-3.5 w-3.5" />
                          <span>Locate Anchor</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setShowShareModal(item)}
                            className="p-1 px-2 text-[10px] font-bold bg-[#020617]/80 hover:bg-slate-950 border border-slate-800 text-slate-300 rounded-lg flex items-center gap-1 transition"
                            title="Generate WhatsApp, Facebook, or Instagram Broadcast Story Card"
                          >
                            <Share2 className="h-3 w-3 text-slate-400" />
                            <span>Share Alert</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedCase(item);
                              setTargetProgressionAge(item.age + 5);
                              setAgeProgressResult(null);
                              // Highlight panel or show a quick pop notification
                              addToast(`Opened AI Progression toolkit in sidebar for ${item.name}.`, "info");
                              window.scrollTo({ top: 400, behavior: "smooth" });
                            }}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded-lg transition"
                          >
                            Aged Simulation
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* QUICK LINK TO RESET DATA FOR TESTERS */}
            <div className="mt-12 text-center">
              <p className="text-xs text-slate-500 mb-2">Development Testing Suite: Click below to refresh database state.</p>
              <button
                onClick={handleFormatSandboxUplink}
                className="px-4 py-1.5 text-xs font-mono font-bold bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-850 hover:text-white rounded-lg transition"
              >
                Reset Database state to Sample Reports
              </button>
            </div>
          </div>
        )}


        {/* REPORT NEW MISSING PERSON LAUNCHER FORM */}
        {currentPage === "report_person" && (
          <div className="max-w-2xl mx-auto bg-slate-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md space-y-6" id="report_person_form">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-blue-500" />
                Submit Digital Missing Person registry
              </h2>
              <p className="text-xs text-slate-400">File a legal trace profile directly into TraceNet. Fields with asterisk are required. Instant geo alerts broadcast automatically.</p>
            </div>

            <form onSubmit={handleSubmitNewCase} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold uppercase tracking-wider">Target Person Name*</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Aarav Sharma"
                    value={createForm.name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#020617] text-white border border-slate-800 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold uppercase tracking-wider">Priority Tagging*</label>
                  <select
                    value={createForm.p_level}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, p_level: e.target.value }))}
                    className="w-full bg-[#020617] text-slate-200 border border-slate-800 rounded-lg p-2.5 font-bold cursor-pointer"
                  >
                    <option value="child">Child Missing (High Priority)</option>
                    <option value="elderly">Elderly (Alzheimer condition)</option>
                    <option value="medical">Critical Medically Urgent</option>
                    <option value="normal">Normal Priority State</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold uppercase tracking-wider">Age (Years)*</label>
                  <input
                    type="number"
                    required
                    value={createForm.age}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full bg-[#020617] text-white border border-slate-800 rounded-lg p-2.5 text-center font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold uppercase tracking-wider">Gender Field*</label>
                  <select
                    value={createForm.gender}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full bg-[#020617] text-slate-200 border border-slate-800 rounded-lg p-2.5 cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold uppercase tracking-wider font-mono">Select Last Seen Date*</label>
                  <input
                    type="date"
                    required
                    value={createForm.lastSeenDate}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, lastSeenDate: e.target.value }))}
                    className="w-full bg-[#020617] text-white border border-slate-800 rounded-lg p-2 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-bold uppercase tracking-wider">Last Seen Location Spot*</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Platform 4 Swargate Bus Stand, Pune"
                  value={createForm.lastSeenLocation}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, lastSeenLocation: e.target.value }))}
                  className="w-full bg-[#020617] text-white border border-slate-800 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-bold uppercase tracking-wider">Specific Physical Identifiers (Comma separated list)</label>
                <input
                  type="text"
                  placeholder="E.g. Scar near eyebrow, glasses, carrying black watch"
                  value={createForm.features}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, features: e.target.value }))}
                  className="w-full bg-[#020617] text-white border border-slate-800 rounded-lg p-2.5 placeholder-slate-600"
                />
              </div>

              {/* Photo Upload with live render base64 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <label className="block text-slate-400 mb-2 font-bold uppercase tracking-wider">Attach High Resolution Identification Snapshot*</label>
                
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden relative">
                    {selectedFileStr ? (
                      <img src={selectedFileStr} alt="Attached face thumbnail" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="h-6 w-6 text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <p className="text-[11px] text-slate-400 font-sans">
                      Ensure file is centered, clearly illuminated, and showcases core facial geometry factors for standard AI identification mapping.
                    </p>
                    <input
                      type="file"
                      id="case_file_upload"
                      accept="image/*"
                      onChange={(e) => handleImageUploadBase64(e, false)}
                      className="text-xs text-slate-400 block w-full file:mr-4 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold uppercase tracking-wider">Your Name (Reporter Contact)*</label>
                  <input
                    type="text"
                    required
                    placeholder="Sunil Deshmukh (Son)"
                    value={createForm.reporterName}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, reporterName: e.target.value }))}
                    className="w-full bg-[#020617] text-white border border-slate-800 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold uppercase tracking-wider">Your Phone Contact No.*</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98200 XXXXX"
                    value={createForm.reporterContact}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, reporterContact: e.target.value }))}
                    className="w-full bg-[#020617] text-white border border-slate-800 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-bold uppercase tracking-wider">Chronological circumstances leading to loss</label>
                <textarea
                  placeholder="Tell us everything about the last known whereabouts, outfit worn, response tags and medical requirements..."
                  rows={3}
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-[#020617] text-white border border-slate-800 rounded-lg p-2.5"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold tracking-widest text-[11px] uppercase transition shadow-lg shadow-blue-500/10"
                >
                  Publish and broadcast Amber Alert
                </button>
              </div>

            </form>
          </div>
        )}


        {/* REPORT CITIZEN SIGHTING FORM */}
        {currentPage === "report_sighting" && (
          <div className="max-w-2xl mx-auto bg-slate-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur space-y-6" id="report_sighting_form">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPinned className="h-5 w-5 text-emerald-400" />
                Report Immediate Sighting Coordinate
              </h2>
              <p className="text-xs text-slate-400">spotted someone in a bus terminal, street, or market? Inform authorities with location and snapshot. Supports 100% anonymous submission.</p>
            </div>

            <form onSubmit={handleSubmitSighting} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-400 mb-1.5 font-bold uppercase tracking-wider">Target Missing Person Profile*</label>
                <select
                  required
                  value={sightingForm.missingPersonId}
                  onChange={(e) => {
                    setSightingForm(prev => ({ ...prev, missingPersonId: e.target.value }));
                    const selection = cases.find(c => c.id === e.target.value);
                    if (selection) setSelectedCase(selection);
                  }}
                  className="w-full bg-[#020617] text-slate-200 border border-slate-800 rounded-lg p-2.5 cursor-pointer font-bold font-sans"
                >
                  <option value="">-- CHOOSE PERSON TO MATCH --</option>
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.caseNumber})</option>
                  ))}
                </select>
              </div>

              {selectedCase && (
                <div className="p-3 bg-blue-950/20 rounded-xl border border-blue-900/30 flex gap-3 items-center">
                  <img src={selectedCase.photos[0]} className="w-12 h-12 object-cover rounded-lg border border-slate-850" />
                  <div>
                    <p className="font-bold text-white text-xs">Matching Against: {selectedCase.name}</p>
                    <p className="text-[10px] text-slate-400 italic">Last Seen Around: {selectedCase.lastSeenLocation}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-400 mb-1.5 font-bold uppercase tracking-wider">Spot Location Details*</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Swargate Terminal gate 2 close to public phone, Pune"
                  value={sightingForm.location}
                  onChange={(e) => setSightingForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-[#020617] text-white border border-slate-800 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Anonymity Checkbox toggle */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-300">Submit Anonymously?</p>
                  <p className="text-[10px] text-slate-500">Enable this to map sightings without sending your phone and name details to NGO database.</p>
                </div>
                <button
                  type="button"
                  id="anonymous_toggle_btn"
                  onClick={() => setSightingForm(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition ${
                    sightingForm.isAnonymous 
                      ? 'bg-red-950 text-red-400 border border-red-900/40' 
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {sightingForm.isAnonymous ? "ANONYMOUS ACTIVE" : "STANDARD MODE"}
                </button>
              </div>

              {!sightingForm.isAnonymous && (
                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-semibold text-[10px]">YOUR FULL NAME (Will be hidden from public logs)</label>
                    <input
                      type="text"
                      placeholder="My name"
                      value={sightingForm.reporterName}
                      onChange={(e) => setSightingForm(prev => ({ ...prev, reporterName: e.target.value }))}
                      className="w-full bg-[#020617] text-white border border-slate-800 rounded-lg p-2"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-400 mb-1.5 font-bold uppercase tracking-wider">Describe physical tags (Outfit, companions, direction traveled)</label>
                <textarea
                  placeholder="Provide precise visual factors: he seemed lost or he was sitting with a tea seller wearing matching yellow cap..."
                  rows={3}
                  value={sightingForm.description}
                  onChange={(e) => setSightingForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-[#020617] text-white border border-slate-800 rounded-lg p-2"
                ></textarea>
              </div>

              {/* Upload image for sighting matching metrics */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <label className="block text-slate-400 mb-1.5 font-bold uppercase tracking-wider">Select Spotted Snapshot file for AI Similarity Index check</label>
                
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-20 h-20 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden relative">
                    {sightingForm.imageStr ? (
                      <img src={sightingForm.imageStr} className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="h-5 w-5 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-500 mb-2 font-sans">
                      Our platform proxies the file to Gemini AI to analyze anatomical landmark matches.
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUploadBase64(e, true)}
                      className="text-xs text-slate-400 block w-full file:mr-4 file:py-1 file:px-2.5 file:rounded file:bg-blue-600 file:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold tracking-widest text-[11px] uppercase transition shadow-lg"
                >
                  Submit Sighting to TraceNet AI validation system
                </button>
              </div>

            </form>
          </div>
        )}


        {/* AI STANDALONE SIMILARITY MATCHING SYSTEM */}
        {currentPage === "ai_match_search" && (
          <div className="space-y-6" id="ai_match_page">
            <div className="max-w-4xl mx-auto space-y-6">
              
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Eye className="h-6 w-6 text-blue-500" />
                  Universal AI Facial Recognition Search Portal
                </h2>
                <p className="text-xs text-slate-400">
                  Upload any photo of an unknown person or search-target to prompt the Gemini facial aligner. The system checks against active records in real-time, mapping anatomic indices and returning statistical match confidence records.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* File input controller */}
                <div className="lg:col-span-5 bg-slate-900/40 p-5 rounded-3xl border border-white/5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Input Verification Image</h3>
                  
                  <div className="aspect-square bg-slate-950 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                    {faceMatchFile ? (
                      <div className="w-full h-full relative group">
                        <img src={faceMatchFile} className="w-full h-full object-cover rounded-lg" />
                        <button
                          onClick={() => setFaceMatchFile(null)}
                          className="absolute top-2 right-2 bg-slate-950 p-1.5 rounded-full border border-slate-800 text-slate-400 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Camera className="h-10 w-10 text-slate-600 mx-auto" />
                        <div className="text-xs">
                          <p className="text-slate-300 font-bold mb-1">Click to select inspection snapshot</p>
                          <p className="text-slate-500">Supports JPG, PNG (Max 15MB)</p>
                        </div>
                        
                        {/* Sample selectors */}
                        <div className="pt-4">
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1.5">Or use sandbox sample</p>
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => {
                                setFaceMatchFile("https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500&auto=format&fit=crop");
                                addToast("Loaded Sample Photo A", "success");
                              }}
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 text-[10px] rounded"
                            >
                              Sample A
                            </button>
                            <button
                              onClick={() => {
                                setFaceMatchFile("https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=500&auto=format&fit=crop");
                                addToast("Loaded Sample Photo B", "success");
                              }}
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 text-[10px] rounded"
                            >
                              Sample B
                            </button>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Hide real input behind nice style */}
                  <div className="pt-1">
                    <input
                      type="file"
                      id="standalone_scan_upload"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const r = new FileReader();
                          r.onloadend = () => setFaceMatchFile(r.result as string);
                          r.readAsDataURL(file);
                        }
                      }}
                      className="text-xs text-slate-400 block w-full file:mr-4 file:py-1 file:px-2.5 file:rounded file:bg-slate-800 file:text-slate-200"
                    />
                  </div>

                  <button
                    onClick={handleFaceMatchSearch}
                    disabled={faceMatchLoading}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-950 text-white font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase transition flex items-center justify-center gap-1.5"
                  >
                    {faceMatchLoading ? (
                      <>
                        <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                        <span>Replicating facial map geometry...</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        <span>Run TraceNet face check</span>
                      </>
                    )}
                  </button>

                </div>

                {/* Match result feed cards */}
                <div className="lg:col-span-7 bg-slate-900/40 p-5 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Facial Scan Identification Output</h3>
                    <span className="text-[10px] bg-blue-950 text-blue-300 font-bold px-2 py-0.5 rounded uppercase">
                      Gemini model v3.5
                    </span>
                  </div>

                  {faceMatchResult.length > 0 ? (
                    <div className="space-y-4">
                      {faceMatchResult.map((matchCandidate, index) => (
                        <div key={matchCandidate.caseId || index} className="p-4 rounded-2xl bg-slate-950 border border-slate-850 text-xs space-y-3">
                          
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div className="flex gap-3 items-center">
                              <img src={matchCandidate.missingPerson?.photos[0]} className="w-12 h-12 object-cover rounded-xl border border-slate-800" />
                              <div>
                                <h4 className="font-bold text-white text-sm">{matchCandidate.missingPerson?.name || "Subject Match File"}</h4>
                                <p className="text-[10px] text-slate-500 font-mono">Case Code: {matchCandidate.missingPerson?.caseNumber}</p>
                              </div>
                            </div>
                            
                            {/* Confidence Score Gauge */}
                            <div className="text-right">
                              <p className="text-[9px] text-slate-500 uppercase font-mono">Confidence rating</p>
                              <p className="text-xl font-mono font-black text-blue-400">{matchCandidate.confidence}%</p>
                            </div>
                          </div>

                          <div className="p-3 rounded-lg bg-[#020617] text-slate-300 font-sans leading-relaxed border border-slate-900">
                            <p className="font-bold text-[9px] text-slate-400 font-mono uppercase mb-0.5">FORENSIC RULING REPORT</p>
                            <p>{matchCandidate.summaryExplained}</p>
                          </div>

                          {/* Landmarks check bullets list */}
                          {matchCandidate.landmarksMatched && (
                            <div>
                              <p className="text-[10px] text-slate-500 font-bold font-mono uppercase mb-1">Aligned landmarks metrics</p>
                              <div className="flex flex-wrap gap-1.5">
                                {matchCandidate.landmarksMatched.map((lm: string, idx: number) => (
                                  <span key={idx} className="bg-indigo-950/40 border border-indigo-900/40 px-2 py-0.5 rounded text-[10px] text-indigo-300">
                                    ✓ {lm}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="pt-2 flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedCase(matchCandidate.missingPerson);
                                setCurrentPage("landing");
                                window.scrollTo({ top: 300, behavior: 'smooth' });
                              }}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-[10px] font-bold text-slate-300 rounded-lg border border-slate-800 transition"
                            >
                              Explore Geo Map
                            </button>
                            {userRole === 'police' && (
                              <button
                                onClick={() => {
                                  handleChangeCaseStatus(matchCandidate.missingPerson.id, "found");
                                }}
                                className="px-3 py-1.5 bg-green-900/30 text-green-400 hover:bg-green-800/40 text-[10px] font-bold rounded-lg border border-green-800/20 transition"
                              >
                                Mark Found
                              </button>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center text-slate-600 text-xs">
                      <HelpCircle className="h-10 w-10 text-slate-800 mx-auto mb-3" />
                      Please upload a verification target on the left panel to execute neural matching.
                    </div>
                  )}

                </div>

              </div>

            </div>
          </div>
        )}


        {/* CCTV FOOTAGE EXTRACTION & FACE MATCH ENGINE */}
        {currentPage === "cctv_scan" && (
          <div className="space-y-6" id="cctv_page">
            <div className="max-w-4xl mx-auto space-y-6">
              
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Shield className="h-6 w-6 text-indigo-500" />
                  Tactical CCTV Video AI Frame Matcher
                </h2>
                <p className="text-xs text-slate-400">
                  Select a municipal CCTV camera hub link, extract video frames sequentially, and trigger a scanning pipeline compared with active missing subject profiles.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* CCTV Selector control frame */}
                <div className="lg:col-span-5 bg-slate-900/40 p-5 rounded-3xl border border-white/5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Active Street CCTV Nodes</h3>

                  <div className="space-y-2">
                    <label className="block text-[10px] text-slate-500 uppercase font-bold font-mono">Choose Municipal Camera Unit:</label>
                    <select
                      value={cctvTarget}
                      onChange={(e) => setCctvTarget(e.target.value)}
                      className="w-full bg-[#020617] text-slate-200 border border-slate-800 rounded-lg p-2.5 font-bold cursor-pointer font-mono"
                    >
                      <option value="cctv_1">Gateway Waterfront Cam-02</option>
                      <option value="cctv_2">Colaba Main Market-North West (High Density)</option>
                      <option value="cctv_3">Swargate Terminal Entrance - Pune (Sector 12)</option>
                    </select>
                  </div>

                  {/* Simulator Video Preview Box */}
                  <div className="aspect-video bg-slate-950 rounded-2xl border border-slate-850 relative overflow-hidden flex flex-col items-center justify-center p-4">
                    
                    {cctvScanning ? (
                      <div className="space-y-3 text-center">
                        <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin mx-auto" />
                        <div>
                          <p className="text-xs text-indigo-300 font-bold font-mono">EXTRACTING FRAME CORES...</p>
                          <p className="text-[10px] text-slate-500 font-mono">Segment analyzer linked</p>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 z-0">
                        {/* Static sample scene layout */}
                        <div className="absolute inset-0 opacity-20 bg-slate-900 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500&auto=format&fit=crop')` }}></div>
                        <div className="absolute inset-0 bg-indigo-950/25"></div>
                        
                        <div className="absolute top-2 left-2 text-[8px] font-mono text-indigo-400 tracking-tighter bg-slate-950/80 px-1.5 py-0.5 rounded">
                          ● FEED LIVE // GATEWAY_02
                        </div>
                        <div className="absolute bottom-2 right-2 text-[8px] font-mono text-slate-400">
                          UTC 2026-05-23
                        </div>

                        {/* Scanner sweep line */}
                        <div className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-lg shadow-blue-500/50 translate-y-[45%] pointer-events-none"></div>

                        <div className="flex items-center justify-center h-full text-center relative z-10 p-3">
                          <p className="text-[10px] font-mono font-bold text-slate-200 bg-slate-950/80 px-2 py-1 rounded border border-slate-850">
                            CCTV STREAM SIGNAL ESTABLISHED
                          </p>
                        </div>
                      </div>
                    )}

                  </div>

                  <button
                    onClick={handleCctvNeuromorphicScan}
                    disabled={cctvScanning}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-950 text-white font-bold py-3 rounded-xl text-xs tracking-wider uppercase transition flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-950/30"
                  >
                    {cctvScanning ? "Scanning Frame Logs..." : "Start Frame Recognition check"}
                  </button>

                  <div className="p-3 bg-indigo-950/10 border border-indigo-900/30 rounded-xl text-[10px] leading-relaxed text-slate-400">
                    <p className="font-bold text-slate-300 mb-0.5 uppercase font-mono">Neural CCTV Mapping Specification</p>
                    <p>Detects outline boundaries, filters backdrop noise, and triggers warning dispatch logs when matching confidence surpasses 75.0% threshold.</p>
                  </div>

                </div>

                {/* CCTV Scan frame list outputs */}
                <div className="lg:col-span-7 bg-slate-900/40 p-5 rounded-3xl border border-white/5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono pb-2 border-b border-slate-800">
                    Extracted Frame Matches Log
                  </h3>

                  {cctvSummaryMsg && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-xs font-mono font-bold text-indigo-300">
                      System Verdict: {cctvSummaryMsg}
                    </div>
                  )}

                  {cctvFrames.length > 0 ? (
                    <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
                      {cctvFrames.map((frame, fIdx) => (
                        <div key={fIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex gap-4 items-center justify-between text-xs text-slate-300">
                          
                          <div className="flex gap-3 items-center">
                            <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-800 relative overflow-hidden flex-shrink-0">
                              <img src={frame.snapshot} className="w-full h-full object-cover" />
                              <div className="absolute top-0.5 left-0.5 text-[7px] bg-red-600 text-white px-1 py-0.2 rounded font-mono">
                                MATCH
                              </div>
                            </div>
                            
                            <div>
                              <p className="font-bold text-white uppercase">{frame.matchedCase?.name || "Subject"}</p>
                              <p className="text-[10px] text-slate-500 font-mono">CCTV Timestamp: {frame.timestamp}</p>
                              <p className="text-[10px] text-slate-500 font-mono">Frame Target MS: {frame.frameTimeMs}ms</p>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <span className="text-[10px] text-slate-500 block uppercase font-mono mb-0.5">Similarity Confidence</span>
                            <span className="text-base font-black text-indigo-400 font-mono">{frame.confidence}%</span>
                            
                            <div className="mt-1">
                              <span className="inline-block px-1.5 py-0.2 rounded bg-indigo-900 text-indigo-200 text-[8px] font-mono">
                                PLOTTED ALERT
                              </span>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-24 text-center text-slate-600 text-xs">
                      <HelpCircle className="h-10 w-10 text-slate-800 mx-auto mb-3" />
                      Select a Street camera and click mapping check. Extracted bounding matches will register above.
                    </div>
                  )}

                </div>

              </div>

            </div>
          </div>
        )}


        {/* THE TACTICAL POLICE / ADMIN DIGITALLY SEALED DASHBOARD */}
        {currentPage === "police_dashboard" && (
          <div className="space-y-6 animate-in fade-in" id="police_terminal_page">
            
            {/* Header control board banner */}
            <div className="p-5 bg-indigo-950/20 border border-indigo-900/40 rounded-3xl backdrop-blur flex justify-between items-center gap-4 flex-wrap">
              <div>
                <span className="text-[10px] font-mono bg-indigo-900/60 text-indigo-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider block w-max mb-1.5">
                  Secure Intelligence Node active // Zone 4 Mumbai
                </span>
                <h2 className="text-title text-2xl font-black text-white flex items-center gap-2">
                  <Shield className="h-6 w-6 text-blue-500" />
                  Police Digital Control Terminal
                </h2>
                <p className="text-xs text-slate-400">
                  Inspect case files, process incoming anonymous citizen sightings, verify similarity matrices, and stamp chronological logs.
                </p>
              </div>

              {/* Toggling simulator button info */}
              <div className="bg-[#020617] p-2.5 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">Officer session</p>
                <p className="font-bold text-white">Inspector Sachin Kadam</p>
                <p className="text-[10px] text-blue-400 font-mono leading-tight">MUP-81722 // Crime Division</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Case list control board panel */}
              <div className="lg:col-span-4 bg-slate-900/40 border border-white/5 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Search Active Cases ({cases.length})</h3>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">A-Z sorting</span>
                </div>

                <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
                  {cases.map((c) => {
                    const isFocus = selectedCase?.id === c.id;
                    return (
                      <button
                        key={c.id}
                        id={`police_case_select_${c.id}`}
                        onClick={() => setSelectedCase(c)}
                        className={`w-full p-3 rounded-2xl border text-left flex gap-3 transition-all relative ${
                          isFocus 
                            ? 'bg-blue-950/35 border-blue-500/50 shadow-md shadow-blue-500/5 text-white' 
                            : 'bg-[#020617] border-slate-850 hover:border-slate-800 text-slate-350'
                        }`}
                      >
                        {/* Status bar pulse line */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                          c.status === 'missing' ? 'bg-red-500' : c.status === 'investigating' ? 'bg-indigo-500' : 'bg-emerald-500'
                        }`}></div>

                        <img src={c.photos[0]} className="w-11 h-11 object-cover rounded-xl border border-slate-850" />
                        
                        <div className="flex-1 min-w-0 text-xs pl-1">
                          <p className="font-bold truncate text-white">{c.name}</p>
                          <p className="text-[10px] font-mono text-slate-400">File No: {c.caseNumber}</p>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-[9px] uppercase tracking-tighter opacity-60">Age: {c.age} years</span>
                            <span className={`inline-block px-1 rounded text-[8px] font-bold uppercase ${
                              c.status === 'found' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'
                            }`}>
                              {c.status}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="bg-slate-950/90 border border-slate-850 p-4 rounded-2xl space-y-2.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Chronological Stats Meter</h4>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Verification Pending:</span>
                      <span className="font-bold text-orange-400 font-mono">{sightings.filter(s=>s.status==='pending').length} logs</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Verified Sightings:</span>
                      <span className="font-bold text-emerald-400 font-mono">{sightings.filter(s=>s.status==='verified').length} logs</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CCTV Node alignment:</span>
                      <span className="font-bold text-blue-400 font-mono">STABLE // SECURE</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Center Active investigation details logs panel */}
              <div className="lg:col-span-8 space-y-6">
                
                {selectedCase ? (
                  <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur space-y-5">
                    
                    {/* Focus details bar header */}
                    <div className="flex justify-between items-start gap-3 pb-3 border-b border-slate-800 flex-wrap">
                      <div>
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                          {selectedCase.name} 
                          <span className="text-xs bg-slate-950 px-2 py-0.5 text-blue-400 rounded-md border border-slate-850 font-mono tracking-tight font-normal">
                            {selectedCase.caseNumber}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Filed by: <strong className="text-slate-200">{selectedCase.reporterName}</strong> ({selectedCase.reporterContact})
                        </p>
                      </div>

                      {/* Status quick switcher dropdown */}
                      <div className="flex items-center gap-2 bg-[#020617] p-1.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider pl-1.5">Action Status:</span>
                        <select
                          value={selectedCase.status}
                          id="police_status_dropdown_select"
                          onChange={(e) => handleChangeCaseStatus(selectedCase.id, e.target.value)}
                          className="bg-transparent text-xs text-slate-100 border-none font-bold focus:outline-none focus:ring-0 cursor-pointer uppercase pr-2.5"
                        >
                          <option value="missing">STILL MISSING</option>
                          <option value="investigating">UNDER TACTICAL STUDY</option>
                          <option value="found">FOUND SAFE & CLOSED</option>
                        </select>
                      </div>
                    </div>

                    {/* SIGHTINGS DISPATCH WAITING VERIFICATION ROW */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-3 flex items-center gap-2">
                        <MapPinned className="h-4 w-4 text-orange-400" />
                        Citizen Sightings Pending Officer Verification ({sightings.filter(s=>s.missingPersonId===selectedCase.id).length})
                      </h4>

                      <div className="space-y-3">
                        {sightings.filter(s => s.missingPersonId === selectedCase.id).length === 0 ? (
                          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 text-center text-slate-500 text-xs">
                            No citizen sighting files uploaded for this case coordinate yet.
                          </div>
                        ) : (
                          sightings.filter(s => s.missingPersonId === selectedCase.id).map((s) => (
                            <div key={s.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col md:flex-row gap-4 justify-between items-stretch">
                              
                              <div className="flex gap-3 items-start flex-1 min-w-0">
                                <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden flex-shrink-0">
                                  {s.image ? (
                                    <img src={s.image} className="w-full h-full object-cover" />
                                  ) : (
                                    <Camera className="h-4.5 w-4.5 text-slate-600 m-auto" />
                                  )}
                                  <div className="absolute top-0.5 left-0.5 text-[6px] bg-indigo-950 text-indigo-300 px-1 rounded font-mono">
                                    IMAGE
                                  </div>
                                </div>

                                <div className="text-xs space-y-1 flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-white uppercase">{s.reporterName}</span>
                                    {s.isAnonymous && (
                                      <span className="text-[8px] bg-red-950 text-red-400 px-1 py-0.2 rounded font-semibold font-mono">
                                        ANONYMOUS COMMUTER
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-slate-350 italic text-[11px] leading-snug font-sans">"{s.description}"</p>
                                  <p className="text-[10px] text-slate-500 font-mono">📍 Coordinates: {s.location}</p>
                                  
                                  {/* Metric assessment AI feedback */}
                                  <div className="mt-2 text-[10px] text-blue-400 leading-relaxed font-mono bg-[#020617] px-2.5 py-1 rounded border border-slate-900">
                                    AI Landmark similarity assessment: <strong className="text-white text-[11px]">{s.confidenceScore}% match</strong>. {s.notes}
                                  </div>
                                </div>
                              </div>

                              {/* Approvals action widgets */}
                              <div className="flex flex-row md:flex-col justify-between items-end md:items-stretch gap-2 border-t md:border-t-0 md:border-l border-slate-850 pt-2.5 md:pt-0 md:pl-4 flex-shrink-0">
                                <div className="text-[10px] text-slate-500 font-mono">
                                  Status: <span className={`font-bold ${s.status === 'verified' ? 'text-emerald-400' : s.status === 'rejected' ? 'text-red-400' : 'text-orange-400'}`}>{s.status}</span>
                                </div>
                                
                                {s.status === 'pending' ? (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleVerifySighting(s.id, "verified")}
                                      className="px-2 py-1 text-[9px] font-bold bg-green-900/30 hover:bg-green-800/40 text-green-400 border border-green-800/20 rounded-md transition uppercase"
                                      title="Mark sighting as officially confirmed and update case coordinate map."
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleVerifySighting(s.id, "rejected")}
                                      className="px-2 py-1 text-[9px] font-bold bg-red-950 hover:bg-red-900 text-red-400 border border-red-900/40 rounded-md transition uppercase"
                                      title="Reject as background noise or invalid matching file."
                                    >
                                      Reject
                                    </button>
                                  </div>
                                ) : (
                                  <div className="text-[10px] text-slate-500 font-bold uppercase font-mono italic">
                                    Processed
                                  </div>
                                )}
                              </div>

                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* OFFICIAL CHRONOLOGICAL CHASE LOGS SUBMISSION */}
                    <div className="pt-4 border-t border-slate-800">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-400" />
                          Official Chronological Investigation Logs
                        </h4>
                        <span className="text-[9px] px-1.5 py-0.2 bg-[#020617] text-slate-500 rounded font-mono border border-slate-850">
                          LOG COUNT: {policeCaseNotes.length}
                        </span>
                      </div>

                      {/* Display log entries list */}
                      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 mb-4">
                        {policeCaseNotes.length === 0 ? (
                          <div className="p-3 bg-slate-950/50 border border-slate-900 text-center text-slate-600 italic text-[11px] rounded-xl">
                            No log trails recorded for this trace code. Add an official stamp update below.
                          </div>
                        ) : (
                          policeCaseNotes.map(note => {
                            const isSystem = note.role === 'system';
                            return (
                              <div key={note.id} className={`p-3 rounded-xl text-xs space-y-1 ${
                                isSystem 
                                  ? 'bg-blue-950/25 border border-blue-900/30 text-slate-300' 
                                  : 'bg-slate-950 border border-slate-850 text-slate-200'
                              }`}>
                                <div className="flex justify-between items-center text-[10px] font-mono">
                                  <span className={`font-bold ${isSystem ? 'text-indigo-400':'text-blue-400'}`}>
                                    {note.author}
                                  </span>
                                  <span className="text-slate-500">
                                    {new Date(note.date).toLocaleString()}
                                  </span>
                                </div>
                                <p className="font-sans leading-relaxed">{note.comment}</p>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Write new note trail form */}
                      <form onSubmit={handleAddOfficialNote} className="flex gap-2.5 items-center">
                        <input
                          type="text"
                          required
                          placeholder="Type an official chronological update: 'Patrol dispatched to Bus Terminal platform'..."
                          value={newPoliceNoteText}
                          id="police_note_comment_input"
                          onChange={(e) => setNewPoliceNoteText(e.target.value)}
                          className="flex-1 bg-[#020617] text-white border border-slate-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-blue-500 font-sans"
                        />
                        <button
                          type="submit"
                          className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl uppercase transition flex-shrink-0 font-mono tracking-wider"
                        >
                          Stamp Log
                        </button>
                      </form>
                    </div>

                  </div>
                ) : (
                  <div className="py-24 text-center bg-slate-900/20 border border-slate-900 rounded-3xl">
                    <User className="h-10 w-10 text-slate-800 mx-auto mb-3" />
                    <p className="text-slate-400 font-bold text-sm">Please highlight an active trace record on the left sidebar to access official police control controls.</p>
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

      </main>

      {/* STATIC POLISHED BOTTOM BAR */}
      <footer className="mt-20 border-t border-slate-900 bg-slate-950/50 py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-sans">
          <p className="tracking-wide">© 2026 TRACENET DIGITAL SEARCH SYSTEM. SHIFTING SURVEILLANCE PARADIGMS FOR CITIZEN SAFETY.</p>
          <div className="flex gap-6 items-center">
            <a href="#reset" onClick={(e) => { e.preventDefault(); handleFormatSandboxUplink(); }} className="text-blue-500 hover:text-blue-400 hover:underline">Reset Mock DB</a>
            <span className="text-slate-700">|</span>
            <p className="font-mono text-slate-600">ENCRYPTED L3 PORT 3000</p>
          </div>
        </div>
      </footer>

      {/* SOCIAL MEDIA POPUP AUTO-SHARING CARD OVERLAY */}
      {showShareModal && (
        <div className="fixed inset-0 bg-[#020617]/90 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowShareModal(null)}
              className="absolute top-4 right-4 bg-slate-950 p-2 rounded-full border border-slate-850 hover:bg-slate-800 transition text-slate-400 hover:text-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] bg-red-950 text-red-500 font-bold px-2 py-0.5 rounded font-mono uppercase tracking-widest inline-block mb-1.5">
                GENERATED EMERGENCY BROADCAST SOCIAL CARD
              </span>
              <h3 className="text-lg font-bold text-white uppercase">Instant Media Share Toolkit</h3>
              <p className="text-xs text-slate-400">Copy the structured format for WhatsApp broadcast, Twitter posts or download high-contrast Instagram story design.</p>
            </div>

            {/* INSTAGRAM / FB AMBER IMAGE PREVIEW */}
            <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-2xl space-y-3.5 relative overflow-hidden" id="social_sticker_card">
              <div className="absolute top-0 right-0 h-44 w-44 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between border-b border-red-900/40 pb-2">
                <span className="text-xs font-black text-red-500 tracking-wider">▲ AMBER ALERT</span>
                <span className="text-[9px] text-red-400 font-mono">TRACE ID: {showShareModal.caseNumber}</span>
              </div>

              <div className="flex gap-4">
                <img src={showShareModal.photos[0]} className="w-16 h-16 object-cover rounded-xl border border-red-500/40" />
                <div className="text-xs space-y-1">
                  <p className="text-base font-black text-white">{showShareModal.name}</p>
                  <p className="text-slate-300">Age: <strong className="text-white">{showShareModal.age} years</strong> // Gender: {showShareModal.gender}</p>
                  <p className="text-slate-300 truncate">Last Seen: <span className="font-bold text-red-400">{showShareModal.lastSeenLocation}</span></p>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-normal font-sans pt-1">
                <strong>Description Check:</strong> {showShareModal.description.slice(0, 160)}...
              </p>

              <div className="p-2.5 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <div>
                  <p className="font-bold text-slate-200">HELPLINE CONTACT:</p>
                  <p className="text-emerald-400 font-bold font-mono text-xs">{showShareModal.reporterContact}</p>
                </div>
                <div className="text-right">
                  <p>SCAN TO MAP SIGHTINGS</p>
                  <p className="text-blue-400">TRACENET.GOV.IN</p>
                </div>
              </div>
            </div>

            {/* TWITTER & WHATSAPP SHARING FORMAT TEXT BOXES */}
            <div className="mt-5 space-y-3.5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">WhatsApp Broadcast Copy-text:</span>
                  <button
                    onClick={() => {
                      const text = `🚨 *TRACE-NET AMBER ALERT* 🚨\n*NAME:* ${showShareModal.name}\n*AGE:* ${showShareModal.age} years\n*LAST SEEN LOCATION:* ${showShareModal.lastSeenLocation}\n*CONTACT HELPLINE:* ${showShareModal.reporterContact}\nHelp reunite this person by reporting sightings here: ${window.location.href}`;
                      navigator.clipboard.writeText(text);
                      addToast("WhatsApp text template copied to clipboard!", "success");
                    }}
                    className="text-[10px] text-blue-400 hover:text-white transition font-mono"
                  >
                    Copy WhatsApp text
                  </button>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 text-[11px] text-slate-300 font-mono font-bold leading-normal whitespaces-pre">
                  🚨 *TRACE-NET AMBER ALERT* 🚨<br/>
                  *NAME:* {showShareModal.name}<br/>
                  *AGE:* {showShareModal.age} yrs // *LAST SEEN:* {showShareModal.lastSeenLocation}<br/>
                  *CONTACT:* {showShareModal.reporterContact}<br/>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Twitter/X formatted Tweet:</span>
                  <button
                    onClick={() => {
                      const text = `🚨 #AmberAlert: ${showShareModal.name} (${showShareModal.age}y) has been reported missing outside of ${showShareModal.lastSeenLocation}. High Priority. Help families locate them with TraceNet AI overlays. RT. Contact: ${showShareModal.reporterContact}`;
                      navigator.clipboard.writeText(text);
                      addToast("Tweet template copied!", "success");
                    }}
                    className="text-[10px] text-blue-400 hover:text-white transition font-mono"
                  >
                    Copy Tweet
                  </button>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 text-[11px] text-slate-400 tracking-tight leading-normal font-sans">
                  🚨 #AmberAlert: <span className="text-white font-bold">{showShareModal.name}</span> ({showShareModal.age}y) has been reported missing outside of <span className="text-red-400 font-bold">{showShareModal.lastSeenLocation}</span>. High Priority tracker. Help families locate them with TraceNet AI. RT. Contact: {showShareModal.reporterContact}
                </div>
              </div>
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setShowShareModal(null)}
                className="px-4.5 py-1.5 bg-slate-950 hover:bg-slate-850 text-xs font-bold text-slate-300 rounded-lg transition border border-slate-800"
              >
                Close Share overlay
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
