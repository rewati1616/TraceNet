import React, { useState, useEffect } from "react";
import { Eye, Bell, Shield, MapPin, Users, Globe, Activity } from "lucide-react";

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  lang: 'en' | 'hi' | 'mr';
  setLang: (lang: 'en' | 'hi' | 'mr') => void;
  userRole: 'citizen' | 'ngo' | 'police';
  setUserRole: (role: 'citizen' | 'ngo' | 'police') => void;
}

export default function Navbar({
  currentPage,
  setCurrentPage,
  lang,
  setLang,
  userRole,
  setUserRole
}: NavbarProps) {
  const [tickerText, setTickerText] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Fetch notifications list for top ticker and alert box
    fetch("/api/notifications")
      .then(res => res.json())
      .then(data => {
        setNotifications(data || []);
        if (data && data.length > 0) {
          const urgent = data.find((n: any) => n.type === 'urgent_amber');
          setTickerText(urgent ? urgent.description : data[0].description);
        }
      })
      .catch(() => {});
  }, [currentPage]);

  const navItems = [
    { id: "landing", label: { en: "Home", hi: "मुख्य पृष्ठ", mr: "मुख्य पान" }, icon: Activity },
    { id: "feed", label: { en: "Active Cases", hi: "सक्रिय मामले", mr: "सक्रिय केसेस" }, icon: Users },
    { id: "report_person", label: { en: "Report Missing", hi: "लापता रिपोर्ट", mr: "बेपत्ता नोंद" }, icon: MapPin },
    { id: "ai_match_search", label: { en: "AI Face Scan", hi: "एआई चेहरा पहचान", mr: "AI चेहरा स्कॅन" }, icon: Eye },
    { id: "cctv_scan", label: { en: "CCTV Scanning", hi: "सीसीटीवी विश्लेषण", mr: "CCTV विश्लेषण" }, icon: Shield },
    { id: "police_dashboard", label: { en: "Police Terminal", hi: "पुलिस टर्मिनल", mr: "पोलीस टर्मिनल" }, icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-900/40 bg-slate-950/80 backdrop-blur-md">
      {/* Ticker Bar */}
      <div className="w-full bg-red-950/90 border-b border-red-800/40 py-1.5 px-4 overflow-hidden relative">
        <div className="flex items-center space-x-2 text-xs md:text-sm font-semibold text-red-100 uppercase tracking-wider">
          <span className="inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-red-400 font-mono">EMERGENCY BROADCAST:</span>
          <div className="animate-marquee whitespace-nowrap overflow-visible inline-block pl-4">
            {tickerText || "TraceNet tracking engine is active. Please upload any sightings immediately to aid investigations."}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Branding Logo */}
        <div 
          onClick={() => setCurrentPage("landing")} 
          className="flex items-center space-x-3 cursor-pointer group"
          id="nav_brand"
        >
          <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
            <Activity className="h-6 w-6 text-white stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-widest font-sans uppercase">
              TRACE<span className="text-blue-500 font-bold text-lg">NET</span>
            </h1>
            <p className="text-[10px] text-blue-400/80 font-mono tracking-tighter">AI MISSING TRACKER</p>
          </div>
        </div>

        {/* Center Nav Link Nodes */}
        <nav className="hidden lg:flex items-center space-x-1" id="nav_links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav_btn_${item.id}`}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium tracking-wide transition-all ${
                  active 
                    ? "bg-blue-600/20 border border-blue-500/40 text-blue-300" 
                    : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label[lang]}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions Toggles & Profiles */}
        <div className="flex items-center space-x-3" id="nav_actions">
          {/* Multi-language Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5" id="lang_selector">
            {(['en', 'hi', 'mr'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 text-xs rounded font-bold uppercase transition ${
                  lang === l ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Sighting Alerts Notification Tooltip Bell */}
          <div className="relative">
            <button
              id="notif_bell_btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-850 hover:bg-slate-850 text-slate-300 hover:text-white transition relative"
            >
              <Bell className="h-4.5 w-4.5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              )}
            </button>

            {/* Notification drop-down */}
            {showNotifications && (
              <div 
                className="absolute right-0 mt-3 w-80 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200"
                id="notif_panel"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                  <h3 className="text-xs font-bold font-mono text-slate-400 tracking-wider">GEO ALERTS DISPATCH</h3>
                  <span className="text-[10px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded font-bold uppercase font-mono">
                    {notifications.length} Alerts
                  </span>
                </div>
                <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div key={n.id} className="text-xs p-2.5 rounded-lg bg-slate-900 border border-slate-850">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] uppercase ${
                          n.type === 'urgent_amber' ? "bg-red-950 text-red-400" : "bg-blue-950 text-blue-400"
                        }`}>
                          {n.type === 'urgent_amber' ? "Amber Alert" : "Match found"}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-300 font-medium font-sans leading-relaxed">{n.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Simulated Persona Switcher: Citizen to Police Officer */}
          <div className="flex items-center space-x-2 border-l border-slate-800 pl-3">
            <button
              id="role_switch_btn"
              onClick={() => {
                const nextRole = userRole === 'citizen' ? 'police' : 'citizen';
                setUserRole(nextRole);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider font-mono uppercase transition flex items-center space-x-1.5 border ${
                userRole === 'police'
                  ? "bg-indigo-600/20 border-indigo-500/30 text-indigo-300"
                  : "bg-slate-900 border-slate-850 text-slate-300 hover:text-white"
              }`}
              title="Click to quickly toggle sandbox roles between Citizen and Police Officer"
            >
              <Shield className="h-3 w-3 text-blue-500" />
              <span>{userRole === 'police' ? "POLICE OFFICER" : "CITIZEN"}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
