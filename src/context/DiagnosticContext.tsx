"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { questions, Question } from "../data/questions";
import { services } from "../data/services";
import { supabase } from "../lib/supabase";

export type StepType = "landing" | "profile" | "wizard" | "results";

export interface CompanyProfile {
  companyName: string;
  leaderName: string;
  email: string;
  phone: string;
  sector: string;
  legalForm: string;
  annualCA: string; // Range e.g. "< 100 000 €"
  employees: number;
  seniority: string;
}

export interface DiagnosticScores {
  global: number;
  pillars: {
    comptabilite: number;
    fiscalite: number;
    tresorerie: number;
    rh: number;
    paie: number;
    facturation: number;
  };
}

export const getActionPriority = (score: number): "Critique" | "Haute" | "Moyenne" | "Faible" => {
  if (score <= 40) return "Critique";
  if (score <= 60) return "Haute";
  if (score <= 79) return "Moyenne";
  return "Faible";
};

interface DiagnosticContextType {
  step: StepType;
  profile: CompanyProfile | null;
  answers: { [questionId: string]: string | number };
  scores: DiagnosticScores;
  recommendedServices: string[];
  diagnosticId: string | null;
  appointment: { requested: boolean; time: string | null };
  setStep: (step: StepType) => void;
  saveProfile: (profile: CompanyProfile) => void;
  saveAnswer: (questionId: string, value: string | number) => void;
  calculateAndFinish: () => void;
  resetDiagnostic: () => void;
  updateAppointment: (day: string, time: string) => Promise<void>;
  getPDFData: () => any;
}

const defaultProfile: CompanyProfile = {
  companyName: "",
  leaderName: "",
  email: "",
  phone: "",
  sector: "",
  legalForm: "",
  annualCA: "",
  employees: 0,
  seniority: ""
};

const DiagnosticContext = createContext<DiagnosticContextType | undefined>(undefined);

// Helper to convert CA range to numerical approximation for calculations
export const getNumericalCA = (caRange: string): number => {
  switch (caRange) {
    case "< 100 000 €":
      return 50000;
    case "100 000 € à 500 000 €":
      return 300000;
    case "500 000 € à 2 M€":
      return 1250000;
    case "2 M€ à 10 M€":
      return 6000000;
    case "> 10 M€":
      return 15000000;
    default:
      return 0;
  }
};

const generateUUID = (): string => {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  // Fallback simple et sécurisé pour les environnements de test / anciens navigateurs
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const DiagnosticProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStepState] = useState<StepType>("landing");
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [answers, setAnswers] = useState<{ [questionId: string]: string | number }>({});
  const [scores, setScores] = useState<DiagnosticScores>({
    global: 0,
    pillars: {
      comptabilite: 0,
      fiscalite: 0,
      tresorerie: 0,
      rh: 0,
      paie: 0,
      facturation: 0
    }
  });
  const [recommendedServices, setRecommendedServices] = useState<string[]>([]);
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<{ requested: boolean; time: string | null }>({ requested: false, time: null });

  const setStep = (nextStep: StepType) => {
    setStepState(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveProfile = (newProfile: CompanyProfile) => {
    setProfile(newProfile);
    // Auto navigation to the wizard after profile is validated and saved
    setStep("wizard");
  };

  const saveAnswer = (questionId: string, value: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateAndFinish = async () => {
    if (!profile) return;

    const numericalCA = getNumericalCA(profile.annualCA);
    const employeesCount = profile.employees;

    // Calculate score for each pillar
    const pillarTotals: { [pillarId: number]: { max: number; current: number } } = {
      0: { max: 16, current: 0 },
      1: { max: 16, current: 0 },
      2: { max: 16, current: 0 },
      3: { max: 16, current: 0 },
      4: { max: 16, current: 0 },
      5: { max: 16, current: 0 }
    };

    questions.forEach((q) => {
      const value = answers[q.id];
      if (q.type === "choice") {
        // Find selected option score
        const option = q.options?.find((o) => o.label === value || o.score === value);
        if (option) {
          pillarTotals[q.pillarId].current += option.score;
        }
      } else if (q.type === "numeric" && q.calculateScore) {
        const numValue = Number(value || 0);
        const score = q.calculateScore(numValue, { annualCA: numericalCA, employees: employeesCount });
        pillarTotals[q.pillarId].current += score;
      }
    });

    // Compute percentage for each pillar
    const calculatedPillars = {
      comptabilite: Math.round((pillarTotals[0].current / pillarTotals[0].max) * 100),
      fiscalite: Math.round((pillarTotals[1].current / pillarTotals[1].max) * 100),
      tresorerie: Math.round((pillarTotals[2].current / pillarTotals[2].max) * 100),
      rh: Math.round((pillarTotals[3].current / pillarTotals[3].max) * 100),
      paie: Math.round((pillarTotals[4].current / pillarTotals[4].max) * 100),
      facturation: Math.round((pillarTotals[5].current / pillarTotals[5].max) * 100)
    };

    let globalSum = calculatedPillars.comptabilite +
                    calculatedPillars.fiscalite +
                    calculatedPillars.tresorerie +
                    calculatedPillars.rh +
                    calculatedPillars.paie +
                    calculatedPillars.facturation;

    const globalScore = Math.round(globalSum / 6);

    // Compute recommended services based on rules
    const calculatedServices = services
      .filter((srv) => srv.shouldRecommend(calculatedPillars, answers))
      .map((srv) => srv.id);

    setScores({
      global: globalScore,
      pillars: calculatedPillars
    });
    setRecommendedServices(calculatedServices);

    // 1. Enregistrer automatiquement un nouvel enregistrement dans Supabase
    try {
      const generatedId = generateUUID();
      const payload = {
        id: generatedId, // Génération de l'UUID côté client pour contourner la restriction de SELECT RLS
        company_name: profile.companyName,
        leader_name: profile.leaderName,
        email: profile.email,
        phone: profile.phone,
        sector: profile.sector,
        legal_form: profile.legalForm,
        annual_ca: profile.annualCA,
        employees: profile.employees,
        seniority: profile.seniority,
        global_score: globalScore,
        pillar_scores: {
          comptabilite: calculatedPillars.comptabilite,
          fiscalite: calculatedPillars.fiscalite,
          tresorerie: calculatedPillars.tresorerie,
          rh: calculatedPillars.rh,
          paie: calculatedPillars.paie,
          facturation: calculatedPillars.facturation
        },
        answers: answers,
        recommended_services: calculatedServices,
        appointment_requested: false,
        appointment_time: null,
        status: "Nouveau",
        internal_notes: ""
      };

      // 5. Console.log du payload envoyé avant insertion
      console.log("Supabase Insert Payload (with client-side UUID):", payload);

      const { error } = await supabase
        .from("diagnostics")
        .insert([payload]);

      if (error) {
        // Logging d'erreur Supabase amélioré
        console.error("Erreur lors de l'enregistrement du diagnostic dans Supabase :", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
      } else {
        // Mémorisation de l'ID généré par le client pour la mise à jour ultérieure
        setDiagnosticId(generatedId);
        console.log("Diagnostic enregistré avec succès. ID local configuré :", generatedId);
      }
    } catch (err) {
      console.error("Erreur critique de communication avec Supabase :", err);
    }

    // 2. Toujours afficher le rapport final (ne jamais bloquer l'utilisateur)
    setStep("results");
  };

  const updateAppointment = async (day: string, time: string) => {
    if (!diagnosticId) {
      console.warn("Impossible de mettre à jour le RDV : ID du diagnostic introuvable.");
      return;
    }

    try {
      console.log(`Tentative de mise à jour du RDV pour diagnosticId: ${diagnosticId} (${day} à ${time})`);

      const { error, status, statusText } = await supabase
        .from("diagnostics")
        .update({
          appointment_requested: true,
          appointment_time: `${day} à ${time}`,
          status: "RDV Planifié"
        })
        .eq("id", diagnosticId);

      // 4. Ajouter un console.log du résultat de l'UPDATE (Statut de retour HTTP)
      console.log("Résultat de l'UPDATE Supabase (Statut HTTP) :", status, statusText);

      if (error) {
        console.error("Erreur lors de la mise à jour du rendez-vous dans Supabase :", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
      } else {
        setAppointment({ requested: true, time: `${day} à ${time}` });
        console.log("Rendez-vous mis à jour avec succès dans Supabase.");
      }
    } catch (err) {
      console.error("Erreur inattendue lors de la mise à jour du rendez-vous :", err);
    }
  };

  const resetDiagnostic = () => {
    setProfile(null);
    setAnswers({});
    setScores({
      global: 0,
      pillars: {
        comptabilite: 0,
        fiscalite: 0,
        tresorerie: 0,
        rh: 0,
        paie: 0,
        facturation: 0
      }
    });
    setRecommendedServices([]);
    setDiagnosticId(null);
    setAppointment({ requested: false, time: null });
    setStep("landing");
  };

  const getPDFData = () => {
    if (!profile) return null;

    const globalRisk = scores.global < 50 ? "Risque élevé" : scores.global < 70 ? "Risque modéré" : "Conforme";
    const actionPriority = getActionPriority(scores.global);

    const opps: string[] = [];
    if (scores.pillars.comptabilite < 70) opps.push("Expertise Comptable");
    if (scores.pillars.fiscalite < 70) opps.push("Fiscalité & Optimisation");
    if (scores.pillars.tresorerie < 70) opps.push("Pilotage Financier");
    if (scores.pillars.rh < 70) opps.push("Conseil RH");
    if (scores.pillars.paie < 70) opps.push("Gestion de la Paie & Accompagnement Social");
    if (scores.pillars.facturation < 70) opps.push("Accompagnement Facturation Électronique");

    return {
      contact: {
        companyName: profile.companyName,
        leaderName: profile.leaderName,
        email: profile.email,
        phone: profile.phone
      },
      globalScore: scores.global,
      globalRisk,
      actionPriority,
      benchmark: {
        comptabilite: 75,
        fiscalite: 70,
        tresorerie: 65,
        rh: 70,
        paie: 75,
        facturation: 60
      },
      improvementPotential: {
        maturityGain: 100 - scores.global,
        summary: `+${100 - scores.global} points de maturité`,
        benefits: [
          "réduction des risques administratifs",
          "amélioration de la conformité",
          "gain de temps opérationnel",
          "meilleure visibilité financière"
        ]
      },
      pillarScores: scores.pillars,
      recommendations: recommendedServices,
      opportunities: opps,
      appointment: {
        requested: appointment.requested,
        time: appointment.time
      },
      generatedAt: new Date().toISOString()
    };
  };

  return (
    <DiagnosticContext.Provider
      value={{
        step,
        profile,
        answers,
        scores,
        recommendedServices,
        diagnosticId,
        appointment,
        setStep,
        saveProfile,
        saveAnswer,
        calculateAndFinish,
        resetDiagnostic,
        updateAppointment,
        getPDFData
      }}
    >
      {children}
    </DiagnosticContext.Provider>
  );
};

export const useDiagnostic = () => {
  const context = useContext(DiagnosticContext);
  if (context === undefined) {
    throw new Error("useDiagnostic must be used within a DiagnosticProvider");
  }
  return context;
};
