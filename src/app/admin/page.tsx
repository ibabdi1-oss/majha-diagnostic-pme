"use client";

import React, { useState, useMemo, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { getActionPriority } from "../../context/DiagnosticContext";
import { 
  Briefcase, 
  Users, 
  Coins, 
  Activity, 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Check, 
  Eye, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  X, 
  ChevronDown, 
  Sparkles, 
  Building, 
  BarChart3,
  Info,
  Lock,
  LogOut
} from "lucide-react";

// Mock Data structure for French PME Leads
interface Lead {
  id: string;
  companyName: string;
  leaderName: string;
  email: string;
  phone: string;
  sector: string;
  legalForm: string;
  annualCA: string;
  employees: number;
  seniority: string;
  dateStr: string;
  globalScore: number;
  pillarScores: {
    comptabilite: number;
    fiscalite: number;
    tresorerie: number;
    rh: number;
    paie: number;
    facturation: number;
  };
  answers: { [key: string]: string | number };
  appointmentRequested: boolean;
  appointmentTime?: string;
  status: "Nouveau" | "Contacté" | "RDV Planifié" | "Opportunité active" | "Sans suite";
  internalNotes: string;
}

interface AdminLoginProps {
  onLoginSuccess: (user: any) => void;
}

function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let msg = error.message;
        if (error.message.includes("Invalid login credentials")) {
          msg = "Identifiants de connexion invalides.";
        }
        setError(msg);
      } else if (data.user) {
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setError("Une erreur de communication est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-6 font-sans antialiased">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xl flex flex-col gap-6">
        
        {/* Brand/Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center shadow-md">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">MAJHA Admin</h1>
            <p className="text-slate-500 text-xs font-light mt-1 font-sans">
              Connexion sécurisée pour la gestion des diagnostics PME.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-850 text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <p className="font-sans">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Adresse email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all font-sans"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Mot de passe
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all font-sans"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

      </div>
    </div>
  );
}

const INITIAL_LEADS: Lead[] = [
  {
    id: "lead_1",
    companyName: "SAS Martin & Co",
    leaderName: "Sophie Martin",
    email: "s.martin@martinco.fr",
    phone: "06 12 34 56 78",
    sector: "Technologies & Digital",
    legalForm: "SAS (Société par Actions Simplifiée)",
    annualCA: "2 M€ à 10 M€",
    employees: 24,
    seniority: "3 à 5 ans",
    dateStr: "2026-06-08T14:32:00Z",
    globalScore: 46,
    pillarScores: { comptabilite: 40, fiscalite: 50, tresorerie: 30, rh: 45, paie: 50, facturation: 60 },
    answers: {
      "q1.1": "Saisie en interne sans supervision régulière d'un expert-comptable diplômé",
      "q1.4": "Non, ou nous ne savons pas ce qu'est le FEC (conformité comptable à sécuriser)",
      "q2.1": 20,
      "q2.2": "Non, nous n'avons aucun document de ce type (point de vigilance TVA)",
      "q3.1": 0.8,
      "q3.3": 75,
      "q4.2": "Pas de mutuelle collective en place (situation de non-conformité ANI à régulariser)",
      "q4.4": "Non, aucun document rédigé (obligation de sécurité employeur à couvrir d'urgence)",
      "q5.1": "Saisie libre sur Word, Excel ou sur papier libre",
      "q5.2": "Aucune action menée, nous ne savons pas comment nous préparer à la réforme",
      "q6.1": "Bulletins saisis en interne sur un tableur (Excel) ou outil non spécialisé (fort risque d'erreur)",
      "q6.2": "Retards fréquents ou erreurs de dépôt entraînant des relances ou des pénalités URSSAF"
    },
    appointmentRequested: true,
    appointmentTime: "Mardi 16 Juin à 10h00",
    status: "RDV Planifié",
    internalNotes: "Dirigeante très intéressée par l'offre de DAF externalisé suite aux alertes de BFR et DSO (75 jours)."
  },
  {
    id: "lead_2",
    companyName: "SARL BatiSud",
    leaderName: "Jean Dupuis",
    email: "jean.dupuis@batisud.fr",
    phone: "04 91 55 66 77",
    sector: "Bâtiment & Travaux Publics (BTP)",
    legalForm: "SARL (Société à Responsabilité Limitée)",
    annualCA: "500 000 € à 2 M€",
    employees: 12,
    seniority: "Plus de 5 ans",
    dateStr: "2026-06-07T10:15:00Z",
    globalScore: 73,
    pillarScores: { comptabilite: 85, fiscalite: 70, tresorerie: 65, rh: 60, paie: 75, facturation: 80 },
    answers: {
      "q1.1": "Tenue ou révision régulière confiée à un cabinet inscrit à l'Ordre des Experts-Comptables",
      "q1.4": "Oui, notre outil le génère et sa conformité technique est régulièrement auditée",
      "q2.1": 0,
      "q2.2": "Processus de facturation documenté de manière très simple ou non mis à jour",
      "q3.1": 2.5,
      "q3.3": 45,
      "q4.2": "Mutuelle d'entreprise ANI obligatoire active pour tous et prévoyance cadre / non-cadre conforme",
      "q4.4": "DUERP existant mais obsolète (non mis à jour depuis plus d'un an ou sans plan d'action)",
      "q5.1": "Logiciel de facturation classique générant des fichiers PDF simples",
      "q6.1": "Bulletins de paie entièrement externalisés et supervisés par un prestataire expert (cabinet d'expertise comptable ou spécialiste de la paie)",
      "q6.2": "DSN déposées systématiquement à temps avec contrôle de cohérence intégré avant transmission"
    },
    appointmentRequested: false,
    status: "Nouveau",
    internalNotes: "Le diagnostic indique des points de vigilance sur le DUERP obsolète et la transition vers la facturation électronique 2026."
  },
  {
    id: "lead_3",
    companyName: "EURL BioAlimentaire",
    leaderName: "Marc Ledoux",
    email: "m.ledoux@bioalim.fr",
    phone: "06 88 99 00 11",
    sector: "Commerce & Vente",
    legalForm: "EURL (SARL Unipersonnelle)",
    annualCA: "100 000 € à 500 000 €",
    employees: 4,
    seniority: "1 à 3 ans",
    dateStr: "2026-06-06T16:45:00Z",
    globalScore: 54,
    pillarScores: { comptabilite: 60, fiscalite: 65, tresorerie: 40, rh: 50, paie: 45, facturation: 65 },
    answers: {
      "q1.1": "Saisie en interne sans supervision régulière d'un expert-comptable diplômé",
      "q1.4": "Non, ou nous ne savons pas ce qu'est le FEC (conformité comptable à sécuriser)",
      "q2.1": 0,
      "q2.2": "Non, nous n'avons aucun document de ce type (point de vigilance TVA)",
      "q3.1": 0.5,
      "q3.3": 55,
      "q4.2": "Pas de mutuelle collective en place (situation de non-conformité ANI à régulariser)",
      "q4.4": "Non, aucun document rédigé (obligation de sécurité employeur à couvrir d'urgence)",
      "q5.1": "Logiciel de facturation classique générant des fichiers PDF simples",
      "q6.1": "Bulletins de paie entièrement externalisés et supervisés par un prestataire expert (cabinet d'expertise comptable ou spécialiste de la paie)",
      "q6.2": "DSN déposées systématiquement à temps avec contrôle de cohérence intégré avant transmission"
    },
    appointmentRequested: true,
    appointmentTime: "Jeudi 18 Juin à 14h30",
    status: "RDV Planifié",
    internalNotes: "Trésorerie basse (0.5 mois de CA) et pas de mutuelle ANI. Demande d'accompagnement de tenue comptable complète."
  },
  {
    id: "lead_4",
    companyName: "SASU TechPrint",
    leaderName: "Alice Mercier",
    email: "alice@techprint.fr",
    phone: "07 55 44 33 22",
    sector: "Services aux entreprises",
    legalForm: "SASU (SAS Unipersonnelle)",
    annualCA: "100 000 € à 500 000 €",
    employees: 2,
    seniority: "Moins d'un an (Création récente)",
    dateStr: "2026-06-08T09:12:00Z",
    globalScore: 96,
    pillarScores: { comptabilite: 95, fiscalite: 100, tresorerie: 90, rh: 95, paie: 95, facturation: 100 },
    answers: {
      "q1.1": "Tenue ou révision régulière confiée à un cabinet inscrit à l'Ordre des Experts-Comptables",
      "q1.4": "Oui, notre outil le génère et sa conformité technique est régulièrement auditée",
      "q2.1": 0,
      "q2.2": "Oui, documentation complète et à jour détaillant nos contrôles internes de facturation",
      "q3.1": 4.0,
      "q3.3": 25,
      "q4.2": "Mutuelle d'entreprise ANI obligatoire active pour tous et prévoyance cadre / non-cadre conforme",
      "q4.4": "DUERP rédigé, mis à jour annuellement et communiqué à l'ensemble de nos salariés",
      "q5.1": "Logiciel certifié générant le format réglementaire mixte Factur-X (PDF + XML structuré) ou structuré",
      "q6.1": "Bulletins de paie entièrement externalisés et supervisés par un prestataire expert (cabinet d'expertise comptable ou spécialiste de la paie)",
      "q6.2": "DSN déposées systématiquement à temps avec contrôle de cohérence intégré avant transmission"
    },
    appointmentRequested: false,
    status: "Nouveau",
    internalNotes: "Profil de PME extrêmement structuré et bien géré, client potentiel passif."
  },
  {
    id: "lead_5",
    companyName: "SARL RestoChic",
    leaderName: "Antoine Bocuse",
    email: "a.bocuse@restochic.fr",
    phone: "06 22 44 66 88",
    sector: "Hôtellerie & Restauration",
    legalForm: "SARL (Société à Responsabilité Limitée)",
    annualCA: "500 000 € à 2 M€",
    employees: 18,
    seniority: "Plus de 5 ans",
    dateStr: "2026-06-05T11:22:00Z",
    globalScore: 41,
    pillarScores: { comptabilite: 30, fiscalite: 40, tresorerie: 50, rh: 40, paie: 35, facturation: 50 },
    answers: {
      "q1.1": "Pas de tenue régulière ou saisie très en retard (fort risque d'erreurs)",
      "q1.4": "Non, ou nous ne savons pas ce qu'est le FEC (conformité comptable à sécuriser)",
      "q2.1": 12,
      "q2.2": "Non, nous n'avons aucun document de ce type (point de vigilance TVA)",
      "q3.1": 1.2,
      "q3.3": 50,
      "q4.2": "Pas de mutuelle collective en place (situation de non-conformité ANI à régulariser)",
      "q4.4": "DUERP existant mais obsolète (non mis à jour depuis plus d'un an ou sans plan d'action)",
      "q5.1": "Saisie libre sur Word, Excel ou sur papier libre",
      "q6.1": "Bulletins saisis en interne sur un tableur (Excel) ou outil non spécialisé (fort risque d'erreur)",
      "q6.2": "Retards fréquents ou erreurs de dépôt entraînant des relances ou des pénalités URSSAF"
    },
    appointmentRequested: false,
    status: "Nouveau",
    internalNotes: "Retard comptable important et pas de mutuelle collective ANI. Risques identifiés sur la partie paie (Excel). Proposer un audit de conformité rapide."
  }
];

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"leads" | "opportunities" | "analytics">("opportunities");

  useEffect(() => {
    const checkUser = async () => {
      try {
        setAuthLoading(true);
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Erreur d'authentification :", err);
      } finally {
        setAuthLoading(false);
      }
    };
    checkUser();

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setLeads([]);
      setIsLoading(false);
      return;
    }

    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("diagnostics")
          .select("*")
          .order("created_at", { ascending: false });

        // Affichage du contenu récupéré par le Dashboard pour débogage
        console.log("Dashboard fetch leads data:", data);

        if (error) {
          console.error("Erreur lors de la récupération des diagnostics :", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
        } else if (data) {
          const mappedLeads: Lead[] = data.map((d: any) => ({
            id: d.id,
            companyName: d.company_name,
            leaderName: d.leader_name,
            email: d.email,
            phone: d.phone,
            sector: d.sector,
            legalForm: d.legal_form,
            annualCA: d.annual_ca,
            employees: d.employees,
            seniority: d.seniority,
            dateStr: d.created_at,
            globalScore: d.global_score,
            pillarScores: {
              comptabilite: d.pillar_scores?.comptabilite ?? d.pillar_scores?.compta ?? 0,
              fiscalite: d.pillar_scores?.fiscalite ?? 0,
              tresorerie: d.pillar_scores?.tresorerie ?? 0,
              rh: d.pillar_scores?.rh ?? 0,
              paie: d.pillar_scores?.paie ?? 0,
              facturation: d.pillar_scores?.facturation ?? 0
            },
            answers: d.answers ?? {},
            appointmentRequested: d.appointment_requested ?? false,
            appointmentTime: d.appointment_time ?? undefined,
            status: d.status ?? "Nouveau",
            internalNotes: d.internal_notes ?? ""
          }));
          setLeads(mappedLeads);
        }
      } catch (err) {
        console.error("Erreur critique lors du chargement des diagnostics :", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setLeads([]);
      showToast("Déconnexion réussie");
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  };
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedScoreRange, setSelectedScoreRange] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  // Modal Detail state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notesInput, setNotesInput] = useState("");

  // Toast notifications simulated state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 1. Calculate Priority level of a lead dynamically
  const getPriority = (lead: Lead) => {
    let points = 0;
    if (lead.globalScore < 50) points += 4;
    else if (lead.globalScore < 70) points += 2;

    if (lead.appointmentRequested) points += 3;
    if (lead.employees >= 10) points += 2;
    if (lead.annualCA.includes("M€")) points += 2;

    // Count recommended services
    const servicesCount = getRecommendedServices(lead).length;
    if (servicesCount >= 4) points += 2;
    else if (servicesCount >= 2) points += 1;

    if (points >= 8) return { label: "🔥 Très prioritaire", color: "text-rose-700 bg-rose-50 border-rose-200" };
    if (points >= 4) return { label: "🟠 Prioritaire", color: "text-amber-700 bg-amber-50 border-amber-200" };
    return { label: "🟢 À suivre", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  };

  // 2. Determine recommended services based on mock answers
  const getRecommendedServices = (lead: Lead) => {
    const list: string[] = [];
    
    // Expertise comptable
    if (lead.pillarScores.comptabilite < 70 || lead.answers["q1.1"]?.toString().includes("en interne sans supervision") || lead.answers["q1.1"]?.toString().includes("Pas de tenue régulière")) {
      list.push("Expertise comptable");
    }
    // DAF
    if (lead.pillarScores.tresorerie < 70 || Number(lead.answers["q3.1"] || 0) < 1.5 || Number(lead.answers["q3.3"] || 0) > 45) {
      list.push("Conseil financier & DAF externalisé");
    }
    // Paie & Obligations Sociales
    if (lead.pillarScores.paie < 70 || (lead.answers["q6.1"] && !lead.answers["q6.1"]?.toString().includes("externalisés"))) {
      list.push("Gestion de la paie & accompagnement social");
    }
    // RH
    if (lead.pillarScores.rh < 70 || lead.answers["q4.2"]?.toString().includes("Pas de mutuelle") || lead.answers["q4.4"]?.toString().includes("Non, aucun document")) {
      list.push("RH & audit social");
    }
    // Facturation
    if (lead.pillarScores.facturation < 70 || lead.answers["q5.1"]?.toString().includes("Saisie libre")) {
      list.push("Accompagnement facturation électronique 2026");
    }

    return list;
  };

  // 3. Estimate annual value for each recommended service (non-contractual)
  const estimateServiceValue = (service: string, lead: Lead): number => {
    switch (service) {
      case "Expertise comptable":
        if (lead.employees > 20) return 6000;
        if (lead.employees > 5) return 4200;
        return 2400;
      case "Conseil financier & DAF externalisé":
        if (lead.annualCA.includes("2 M€ à 10 M€") || lead.annualCA.includes("> 10 M€")) return 24000;
        if (lead.annualCA.includes("500 000 €")) return 12000;
        return 6000;
      case "Gestion de la paie & accompagnement social":
        // 120€ per year per employee, min 600, max 2400
        return Math.min(2400, Math.max(600, lead.employees * 120));
      case "RH & audit social":
        if (lead.employees > 20) return 5000;
        if (lead.employees > 5) return 3000;
        return 1500;
      case "Accompagnement facturation électronique 2026":
        if (lead.employees > 15) return 3000;
        if (lead.employees > 5) return 1800;
        return 800;
      default:
        return 1000;
    }
  };

  // Calculate total estimated potential value for a single lead
  const getLeadPotentialValue = (lead: Lead): number => {
    const services = getRecommendedServices(lead);
    return services.reduce((sum, srv) => sum + estimateServiceValue(srv, lead), 0);
  };

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search term match
      const searchMatch = 
        lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.leaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Sector match
      const sectorMatch = !selectedSector || lead.sector === selectedSector;

      // Size match
      let sizeMatch = true;
      if (selectedSize === "TPE (<10 sal)") {
        sizeMatch = lead.employees < 10;
      } else if (selectedSize === "PME (10-49 sal)") {
        sizeMatch = lead.employees >= 10 && lead.employees < 50;
      } else if (selectedSize === "ETI (50+ sal)") {
        sizeMatch = lead.employees >= 50;
      }

      // Score match
      let scoreMatch = true;
      if (selectedScoreRange === "Risque élevé (<50)") {
        scoreMatch = lead.globalScore < 50;
      } else if (selectedScoreRange === "Risque modéré (50-69)") {
        scoreMatch = lead.globalScore >= 50 && lead.globalScore < 70;
      } else if (selectedScoreRange === "Conforme (70+)") {
        scoreMatch = lead.globalScore >= 70;
      }

      // Priority match
      let priorityMatch = true;
      if (selectedPriority) {
        const pLevel = getPriority(lead).label;
        priorityMatch = pLevel.includes(selectedPriority);
      }

      return searchMatch && sectorMatch && sizeMatch && scoreMatch && priorityMatch;
    });
  }, [leads, searchTerm, selectedSector, selectedSize, selectedScoreRange, selectedPriority]);

  // Overall metrics for KPIs
  const metrics = useMemo(() => {
    const totalCount = leads.length;
    const completionRate = 100; // Mocked completion rate
    const averageScore = totalCount > 0 ? Math.round(leads.reduce((sum, l) => sum + l.globalScore, 0) / totalCount) : 0;
    
    // Opportunities strategic KPIs
    const totalOpportunities = leads.reduce((sum, l) => sum + getRecommendedServices(l).length, 0);
    const veryPrioritariesCount = leads.filter(l => getPriority(l).label.includes("Très prioritaire")).length;
    const rdvCount = leads.filter(l => l.appointmentRequested).length;
    
    // Estimated potential value total
    const totalValueEstim = leads.reduce((sum, l) => sum + getLeadPotentialValue(l), 0);

    return {
      totalCount,
      completionRate,
      averageScore,
      totalOpportunities,
      veryPrioritariesCount,
      rdvCount,
      totalValueEstim
    };
  }, [leads]);

  // Répartition par offre MAJHA data
  const servicesMetrics = useMemo(() => {
    const offerNames = [
      "Expertise comptable",
      "Conseil financier & DAF externalisé",
      "Gestion de la paie & accompagnement social",
      "RH & audit social",
      "Accompagnement facturation électronique 2026"
    ];

    return offerNames.map((srv) => {
      const targetLeads = leads.filter(l => getRecommendedServices(l).includes(srv));
      const count = targetLeads.length;
      
      const avgScore = count > 0 
        ? Math.round(targetLeads.reduce((sum, l) => sum + l.globalScore, 0) / count)
        : 100;

      const totalVal = targetLeads.reduce((sum, l) => sum + estimateServiceValue(srv, l), 0);

      // Priority calculation based on average score
      let priority = "🟢 Faible";
      let priorityColor = "text-emerald-700 bg-emerald-50";
      if (avgScore < 50) {
        priority = "🔥 Urgent";
        priorityColor = "text-rose-700 bg-rose-50";
      } else if (avgScore < 70) {
        priority = "🟠 Modéré";
        priorityColor = "text-amber-700 bg-amber-50";
      }

      return {
        name: srv,
        count,
        prospectsCount: count,
        avgScore,
        priority,
        priorityColor,
        estimatedValue: totalVal
      };
    });
  }, [leads]);

  // Actions handlers
  const handleStatusChange = async (leadId: string, newStatus: Lead["status"]) => {
    // Mise à jour de l'état local immédiatement
    setLeads(prev => prev.map(l => l.id === leadId ? { ...srvUpdate(l, newStatus), status: newStatus } : l));
    setSelectedLead(prev => {
      if (prev && prev.id === leadId) {
        return { ...srvUpdate(prev, newStatus), status: newStatus };
      }
      return prev;
    });

    try {
      const updateData: any = { status: newStatus };
      if (newStatus === "RDV Planifié") {
        updateData.appointment_requested = true;
        updateData.appointment_time = "À planifier avec le prospect";
      }

      const { error } = await supabase
        .from("diagnostics")
        .update(updateData)
        .eq("id", leadId);

      if (error) {
        console.error("Erreur lors de la mise à jour du statut dans Supabase :", error);
      } else {
        showToast(`Statut mis à jour : ${newStatus}`);
      }
    } catch (err) {
      console.error("Erreur critique lors de la mise à jour du statut :", err);
    }
  };

  const srvUpdate = (l: Lead, status: Lead["status"]): Lead => {
    if (status === "RDV Planifié" && !l.appointmentRequested) {
      return {
        ...l,
        appointmentRequested: true,
        appointmentTime: "À planifier avec le prospect"
      };
    }
    return l;
  };

  const openDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setNotesInput(lead.internalNotes);
  };

  const saveNotes = async () => {
    if (selectedLead) {
      const currentId = selectedLead.id;
      // Mise à jour locale
      setLeads(prev => prev.map(l => l.id === currentId ? { ...l, internalNotes: notesInput } : l));
      setSelectedLead(prev => prev ? { ...prev, internalNotes: notesInput } : null);

      try {
        const { error } = await supabase
          .from("diagnostics")
          .update({ internal_notes: notesInput })
          .eq("id", currentId);

        if (error) {
          console.error("Erreur lors de l'enregistrement des notes dans Supabase :", error);
        } else {
          showToast("Notes internes enregistrées.");
        }
      } catch (err) {
        console.error("Erreur critique lors de la sauvegarde des notes :", err);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 font-sans">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 font-light font-sans">Vérification de l'authentification...</p>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-bold px-4.5 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50 animate-bounce">
          <CheckCircle className="w-4 h-4 text-teal-400" />
          {toastMessage}
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-md shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-base leading-tight block">MAJHA</span>
              <span className="text-[10px] text-teal-600 font-bold tracking-wider uppercase block -mt-1">Espace Admin</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("leads")}
              className={`w-full px-4 py-3 rounded-xl text-left text-sm font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === "leads"
                  ? "bg-teal-50 text-teal-900 font-bold shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Users className="w-4.5 h-4.5" />
              Vue d'ensemble
            </button>
            
            <button
              onClick={() => setActiveTab("opportunities")}
              className={`w-full px-4 py-3 rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "opportunities"
                  ? "bg-teal-50 text-teal-900 font-bold shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-3">
                <TrendingUp className="w-4.5 h-4.5" />
                Opportunités MAJHA
              </span>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-full">
                🔥 active
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full px-4 py-3 rounded-xl text-left text-sm font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-teal-50 text-teal-900 font-bold shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <BarChart3 className="w-4.5 h-4.5" />
              Analyses & Graphiques
            </button>
          </nav>
        </div>

        {/* User Account / Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm uppercase">
              {user?.email?.[0] || "A"}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-slate-800 block truncate">Espace Collaborateur</span>
              <span className="text-[10px] text-slate-400 block font-light truncate">{user?.email}</span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:border-rose-250 hover:bg-rose-50 text-slate-500 hover:text-rose-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>Admin</span>
            <span>/</span>
            <span className="text-slate-800">
              {activeTab === "leads" && "Vue d'ensemble"}
              {activeTab === "opportunities" && "Opportunités MAJHA"}
              {activeTab === "analytics" && "Analyses & Graphiques"}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 text-xs w-48 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 bg-slate-50/50"
              />
            </div>
          </div>
        </header>

        {/* Main scrollable body */}
        <div className="p-8 max-w-7xl w-full mx-auto flex-grow">
          {isLoading && (
            <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></span>
              Synchronisation avec Supabase en cours...
            </div>
          )}
          
          {/* TAB 1: OVERVIEW LEADS LIST */}
          {activeTab === "leads" && (
            <div className="flex flex-col gap-6">
              
              {/* KPIs Header Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Prospects Qualifiés</span>
                    <span className="text-2xl font-extrabold text-slate-900">{metrics.totalCount}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Taux de Complétion</span>
                    <span className="text-2xl font-extrabold text-slate-900">{metrics.completionRate}%</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Score de Maturité Moyen</span>
                    <span className="text-2xl font-extrabold text-slate-900">{metrics.averageScore} / 100</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Entretiens Demandés</span>
                    <span className="text-2xl font-extrabold text-slate-900">{metrics.rdvCount}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Filters Panel */}
              <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <Filter className="w-4.5 h-4.5 text-slate-400" />
                  Filtrer :
                </div>

                <div className="flex flex-wrap gap-3.5 items-center flex-grow md:flex-grow-0">
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="">Tous les Secteurs</option>
                    <option value="Technologies & Digital">Technologies</option>
                    <option value="Bâtiment & Travaux Publics (BTP)">BTP</option>
                    <option value="Commerce & Vente">Commerce</option>
                    <option value="Hôtellerie & Restauration">Hôtellerie & Restauration</option>
                  </select>

                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="">Toutes les Tailles</option>
                    <option value="TPE (<10 sal)">TPE ({"<"} 10 sal)</option>
                    <option value="PME (10-49 sal)">PME (10-49 sal)</option>
                    <option value="ETI (50+ sal)">ETI (50+ sal)</option>
                  </select>

                  <select
                    value={selectedScoreRange}
                    onChange={(e) => setSelectedScoreRange(e.target.value)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="">Tous les Scores</option>
                    <option value="Risque élevé (<50)">Risque élevé ({"<"} 50)</option>
                    <option value="Risque modéré (50-69)">Risque modéré (50-69)</option>
                    <option value="Conforme (70+)">Conforme (70+)</option>
                  </select>
                </div>

                {(selectedSector || selectedSize || selectedScoreRange || searchTerm) && (
                  <button
                    onClick={() => {
                      setSelectedSector("");
                      setSelectedSize("");
                      setSelectedScoreRange("");
                      setSearchTerm("");
                    }}
                    className="text-xs font-bold text-teal-600 hover:text-teal-800 transition-colors cursor-pointer"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>

              {/* Table of Leads */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <th className="p-4 pl-6">Date</th>
                        <th className="p-4">Entreprise & Dirigeant</th>
                        <th className="p-4">Secteur / CA</th>
                        <th className="p-4 text-center">Salariés</th>
                        <th className="p-4 text-center">Score Global</th>
                        <th className="p-4">Statut</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 pl-6 text-xs text-slate-500 font-light">
                            {new Date(lead.dateStr).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="p-4">
                            <div>
                              <span className="font-extrabold text-slate-900 block">{lead.companyName}</span>
                              <span className="text-xs text-slate-500 font-light flex items-center gap-1">
                                <User className="w-3 h-3 text-slate-400" />
                                {lead.leaderName}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <span className="text-xs font-semibold text-slate-700 block">{lead.sector}</span>
                              <span className="text-[11px] text-slate-500 font-light">{lead.annualCA}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center font-bold text-slate-800">{lead.employees}</td>
                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                lead.globalScore < 50 
                                  ? "bg-rose-50 text-rose-700 border border-rose-200" 
                                  : lead.globalScore < 70 
                                  ? "bg-amber-50 text-amber-700 border border-amber-200" 
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}>
                                {lead.globalScore} / 100
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                                {lead.globalScore < 50 ? "🔴" : lead.globalScore < 70 ? "🟠" : "🟢"} {getActionPriority(lead.globalScore)}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              lead.status === "RDV Planifié" 
                                ? "bg-rose-100 text-rose-800" 
                                : lead.status === "Opportunité active" 
                                ? "bg-teal-100 text-teal-800" 
                                : lead.status === "Contacté" 
                                ? "bg-indigo-100 text-indigo-800" 
                                : lead.status === "Sans suite" 
                                ? "bg-slate-200 text-slate-700" 
                                : "bg-slate-100 text-slate-600"
                            }`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <button
                              onClick={() => openDetails(lead)}
                              className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 flex items-center gap-1.5 ml-auto cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Détails
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredLeads.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400 font-light italic">
                            Aucun prospect ne correspond à ces critères.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: STRATEGIC OPPORTUNITIES TAB */}
          {activeTab === "opportunities" && (
            <div className="flex flex-col gap-6">
              
              {/* Opportunities Header KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Missions Détectées</span>
                    <span className="text-xl font-extrabold text-slate-900">{metrics.totalOpportunities}</span>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Briefcase className="w-4.5 h-4.5" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Prospects Qualifiés</span>
                    <span className="text-xl font-extrabold text-slate-900">{metrics.totalCount}</span>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Très Prioritaires</span>
                    <span className="text-xl font-extrabold text-rose-700">{metrics.veryPrioritariesCount}</span>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <AlertTriangle className="w-4.5 h-4.5 animate-pulse" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">RDV Restitution</span>
                    <span className="text-xl font-extrabold text-indigo-700">{metrics.rdvCount}</span>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                </div>

                <div className="bg-white border border-teal-200 bg-teal-50/20 p-4 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block mb-1">Valeur Potentielle</span>
                    <span className="text-xl font-extrabold text-teal-700">
                      {metrics.totalValueEstim.toLocaleString("fr-FR")} € <span className="text-[10px] font-light text-slate-400 font-sans block">/ an estimés</span>
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                    <Coins className="w-4.5 h-4.5" />
                  </div>
                </div>
              </div>

              {/* Disclaimer Alert */}
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-250 flex items-center gap-3 text-slate-600 text-xs">
                <Info className="w-4.5 h-4.5 text-slate-500 shrink-0" />
                <span className="font-light italic">
                  <strong>Mention d'usage interne :</strong> Estimation indicative destinée au pilotage de l'activité commerciale interne de MAJHA. Les tarifs sont simulés à partir du barème d'honoraires français habituel.
                </span>
              </div>

              {/* Section 2: Répartition par offre MAJHA */}
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4.5 h-4.5 text-teal-600" />
                  Opportunités par service MAJHA
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {servicesMetrics.map((srv, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between gap-3 relative overflow-hidden">
                      {/* Top banner priority */}
                      <div className="flex justify-between items-center">
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${srv.priorityColor}`}>
                          {srv.priority}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {srv.count} prospect(s)
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-800 leading-snug line-clamp-2 h-8">
                          {srv.name}
                        </h4>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-base font-black text-slate-900">
                            {srv.estimatedValue.toLocaleString("fr-FR")} €
                          </span>
                          <span className="text-[9px] text-slate-400 font-light">/ an</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 font-light border-t border-slate-100 pt-2 flex justify-between">
                        <span>Score moyen :</span>
                        <span className="font-bold">{srv.avgScore} / 100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filters for Opportunities */}
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <Filter className="w-4.5 h-4.5 text-slate-400" />
                  Filtrer les opportunités :
                </div>

                <div className="flex flex-wrap gap-3.5 items-center flex-grow md:flex-grow-0">
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="">Toutes les Priorités</option>
                    <option value="Très prioritaire">🔥 Très prioritaire</option>
                    <option value="Prioritaire">🟠 Prioritaire</option>
                    <option value="À suivre">🟢 À suivre</option>
                  </select>

                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="">Tous les Secteurs</option>
                    <option value="Technologies & Digital">Technologies</option>
                    <option value="Bâtiment & Travaux Publics (BTP)">BTP</option>
                    <option value="Commerce & Vente">Commerce</option>
                    <option value="Hôtellerie & Restauration">Hôtellerie & Restauration</option>
                  </select>
                </div>
              </div>

              {/* Table of Opportunities */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <th className="p-4 pl-6">Entreprise</th>
                        <th className="p-4">Profil PME</th>
                        <th className="p-4 text-center">Score</th>
                        <th className="p-4">Priorité commerciale</th>
                        <th className="p-4">Valeur Annuelle Estimée</th>
                        <th className="p-4">Services recommandés</th>
                        <th className="p-4 pr-6 text-right">Actions rapides</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {filteredLeads.map((lead) => {
                        const pLevel = getPriority(lead);
                        const services = getRecommendedServices(lead);
                        const valueEstim = getLeadPotentialValue(lead);
                        
                        return (
                          <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 pl-6">
                              <div>
                                <span className="font-extrabold text-slate-900 block">{lead.companyName}</span>
                                <span className="text-xs text-slate-500 font-light">{lead.leaderName}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-xs text-slate-700 block font-semibold">{lead.sector}</span>
                              <span className="text-[11px] text-slate-400 font-light">
                                {lead.employees} sal • {lead.annualCA}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <span className="font-bold text-slate-800">{lead.globalScore}</span>
                            </td>
                            <td className="p-4">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${pLevel.color}`}>
                                {pLevel.label}
                              </span>
                            </td>
                            <td className="p-4 font-black text-slate-900 text-base">
                              {valueEstim.toLocaleString("fr-FR")} €
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {services.map((srv, i) => (
                                  <span key={i} className="text-[9px] font-medium bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md line-clamp-1 truncate">
                                    {srv}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => openDetails(lead)}
                                  title="Voir la fiche complète"
                                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                
                                {lead.status === "Nouveau" && (
                                  <button
                                    onClick={() => handleStatusChange(lead.id, "Contacté")}
                                    className="px-2 py-1 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg cursor-pointer"
                                  >
                                    Contacter
                                  </button>
                                )}

                                {lead.status !== "Opportunité active" && (
                                  <button
                                    onClick={() => handleStatusChange(lead.id, "Opportunité active")}
                                    className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                                  >
                                    Valider
                                  </button>
                                )}

                                {lead.status === "Opportunité active" && (
                                  <span className="text-[10px] font-bold text-teal-600 flex items-center gap-0.5">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                    Active
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SIMPLE ANALYTICS VIZ */}
          {activeTab === "analytics" && (
            <div className="flex flex-col gap-8">
              
              {/* Top row stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Donut of Score Ranges */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Répartition de la Maturité</h4>
                    <div className="flex justify-center my-6">
                      {/* Simple SVG Circular Chart */}
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="72" cy="72" r="50" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                          <circle cx="72" cy="72" r="50" stroke="#0d9488" strokeWidth="10" fill="transparent"
                                  strokeDasharray="314" strokeDashoffset={314 - (314 * metrics.averageScore) / 100}
                                  strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-2xl font-black text-slate-800">{metrics.averageScore}</span>
                          <span className="text-[9px] text-slate-400 block font-light">Score moyen</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 text-xs font-medium border-t border-slate-150 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-rose-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                        Risque élevé (&lt;50)
                      </span>
                      <span className="font-bold text-slate-800">40%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-amber-500">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                        Maturité fragile (50-69)
                      </span>
                      <span className="font-bold text-slate-800">40%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-emerald-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                        Structure maîtrisée (70+)
                      </span>
                      <span className="font-bold text-slate-800">20%</span>
                    </div>
                  </div>
                </div>

                {/* Histogram of Services Recommended */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm md:col-span-2 flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Opportunités par Offres</h4>
                  
                  <div className="flex flex-col gap-4.5 my-4">
                    {servicesMetrics.map((srv, idx) => {
                      const maxCount = Math.max(...servicesMetrics.map(s => s.count), 1);
                      const widthPercent = (srv.count / maxCount) * 100;
                      
                      return (
                        <div key={idx} className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-800 truncate max-w-[250px]">{srv.name}</span>
                            <span className="text-slate-500 font-bold">{srv.count} recommandation(s)</span>
                          </div>
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-teal-600 rounded-full transition-all duration-500" 
                              style={{ width: `${widthPercent}%` }} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-[10px] text-slate-400 font-light border-t border-slate-150 pt-3 italic">
                    Les opportunités de Facturation électronique et DAF externalisé représentent actuellement les plus fortes demandes.
                  </div>
                </div>

              </div>

              {/* Value potential Chart */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Valeur Potentielle Annuelle cumulée par Service</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end min-h-[200px] pt-6">
                  {servicesMetrics.map((srv, idx) => {
                    const maxValue = Math.max(...servicesMetrics.map(s => s.estimatedValue), 1);
                    const heightPercent = (srv.estimatedValue / maxValue) * 150; // Max height 150px
                    
                    return (
                      <div key={idx} className="flex flex-col items-center gap-3">
                        <div className="text-xs font-extrabold text-slate-850 text-center">
                          {srv.estimatedValue.toLocaleString("fr-FR")} €
                        </div>
                        {/* Bar */}
                        <div 
                          className="w-12 bg-teal-600 rounded-t-lg transition-all duration-500 hover:bg-teal-700 relative group"
                          style={{ height: `${heightPercent}px` }}
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {srv.count} contrats
                          </div>
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 text-center h-8 line-clamp-2 leading-tight max-w-[100px] truncate">
                          {srv.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* LEAD DETAIL MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-6 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start shrink-0">
              <div>
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest block mb-1">Détails du Lead Qualifié</span>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  {selectedLead.companyName}
                  <span className="text-xs font-semibold text-slate-500 px-2 py-0.5 bg-slate-200/60 rounded-md">
                    {selectedLead.legalForm}
                  </span>
                </h2>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6">
              
              {/* Profile Contact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50/50 border border-slate-150 p-4.5 rounded-xl">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Dirigeant</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-teal-600" />
                    {selectedLead.leaderName}
                  </span>
                  <span className="text-xs text-slate-600 font-light flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {selectedLead.email}
                  </span>
                  <span className="text-xs text-slate-600 font-light flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {selectedLead.phone}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Caractéristiques PME</span>
                  <span className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-teal-600" />
                    {selectedLead.sector}
                  </span>
                  <span className="text-xs text-slate-600 font-light">CA : {selectedLead.annualCA}</span>
                  <span className="text-xs text-slate-600 font-light">Effectif : {selectedLead.employees} salariés</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Statut et RDV</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-600" />
                    {selectedLead.status}
                  </span>
                  {selectedLead.appointmentRequested ? (
                    <span className="text-xs text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md font-semibold mt-1">
                      🗓️ RDV : {selectedLead.appointmentTime}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-light mt-1">Aucune demande de rendez-vous</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Maturité & Priorité</span>
                  <span className="text-xs font-bold text-slate-800">
                    Score Global : <span className="font-extrabold text-teal-700">{selectedLead.globalScore} / 100</span>
                  </span>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold mt-1 w-max ${
                    selectedLead.globalScore < 50 ? "bg-rose-50 border border-rose-150 text-rose-700" :
                    selectedLead.globalScore < 70 ? "bg-amber-50 border border-amber-150 text-amber-700" :
                    "bg-emerald-50 border border-emerald-150 text-emerald-700"
                  }`}>
                    {selectedLead.globalScore < 50 ? "🔴 Risque élevé" : selectedLead.globalScore < 70 ? "🟠 Risque modéré" : "🟢 Conforme"}
                  </span>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold mt-1 w-max ${
                    selectedLead.globalScore <= 40 ? "bg-rose-100 border border-rose-200 text-rose-800 animate-pulse" :
                    selectedLead.globalScore <= 60 ? "bg-amber-100 border border-amber-200 text-amber-800" :
                    selectedLead.globalScore <= 79 ? "bg-blue-50 border border-blue-200 text-blue-800" :
                    "bg-emerald-50 border border-emerald-250 text-emerald-800"
                  }`}>
                    Priorité : {getActionPriority(selectedLead.globalScore)}
                  </span>
                </div>
              </div>

              {/* Pillar Scores Table */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Détail des scores par pilier</h3>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="p-3 pl-4">Pilier</th>
                        <th className="p-3 text-center">Score</th>
                        <th className="p-3">Niveau de risque</th>
                        <th className="p-3 pr-4">Priorité d'action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {[
                        { name: "Comptabilité", score: selectedLead.pillarScores.comptabilite },
                        { name: "Fiscalité", score: selectedLead.pillarScores.fiscalite },
                        { name: "Trésorerie", score: selectedLead.pillarScores.tresorerie },
                        { name: "Ressources Humaines", score: selectedLead.pillarScores.rh },
                        { name: "Paie & Obligations Sociales", score: selectedLead.pillarScores.paie },
                        { name: "Facturation Électronique", score: selectedLead.pillarScores.facturation }
                      ].map((pillar, idx) => {
                        let riskLabel = "";
                        let riskBadgeClass = "";
                        if (pillar.score < 50) {
                          riskLabel = "🔴 Risque élevé";
                          riskBadgeClass = "text-rose-700 bg-rose-50 border-rose-100";
                        } else if (pillar.score < 70) {
                          riskLabel = "🟠 Risque modéré";
                          riskBadgeClass = "text-amber-700 bg-amber-50 border-amber-100";
                        } else {
                          riskLabel = "🟢 Conforme";
                          riskBadgeClass = "text-emerald-700 bg-emerald-50 border-emerald-100";
                        }
                        
                        const prio = getActionPriority(pillar.score);
                        let prioBadgeClass = "";
                        if (prio === "Critique") prioBadgeClass = "text-rose-800 bg-rose-100 border-rose-200";
                        else if (prio === "Haute") prioBadgeClass = "text-amber-800 bg-amber-100 border-amber-200";
                        else if (prio === "Moyenne") prioBadgeClass = "text-blue-800 bg-blue-50 border-blue-100";
                        else prioBadgeClass = "text-emerald-800 bg-emerald-50 border-emerald-100";

                        return (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors font-medium">
                            <td className="p-3 pl-4 text-slate-900 font-bold">{pillar.name}</td>
                            <td className="p-3 text-center text-slate-800 font-extrabold">{pillar.score} %</td>
                            <td className="p-3">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${riskBadgeClass}`}>
                                {riskLabel}
                              </span>
                            </td>
                            <td className="p-3 pr-4">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${prioBadgeClass}`}>
                                {prio}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recommended Services & Estimated Values */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Opportunités d'offres MAJHA</h3>
                <div className="flex flex-col gap-2">
                  {getRecommendedServices(selectedLead).map((srv, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-xl">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-teal-600" />
                        {srv}
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        {estimateServiceValue(srv, selectedLead).toLocaleString("fr-FR")} € / an estimés
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Notes & Follow up */}
              <div className="flex flex-col gap-2">
                <label htmlFor="internal-notes-input" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Notes de suivi et compte-rendu d'appel :
                </label>
                <textarea
                  id="internal-notes-input"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Écrivez le compte-rendu des échanges, les services souhaités par le client..."
                  className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 bg-slate-50/50 min-h-[100px]"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <div className="flex gap-2">
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as Lead["status"])}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-teal-500 font-bold"
                >
                  <option value="Nouveau">Nouveau</option>
                  <option value="Contacté">Contacté</option>
                  <option value="RDV Planifié">RDV Planifié</option>
                  <option value="Opportunité active">Opportunité active</option>
                  <option value="Sans suite">Sans suite</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-500 cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  onClick={saveNotes}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Enregistrer les notes
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
