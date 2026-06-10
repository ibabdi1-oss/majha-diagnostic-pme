"use client";

import React, { useState } from "react";
import { useDiagnostic } from "../context/DiagnosticContext";
import { questions } from "../data/questions";
import { services } from "../data/services";
import { generatePremiumPdf } from "../lib/pdf-generator";
import PremiumDiagnosticPdf from "./pdf/PremiumDiagnosticPdf";
import { 
  RotateCcw, 
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Briefcase,
  AlertTriangle,
  Download,
  Calendar,
  Sparkles,
  CheckCircle2,
  Info,
  Clock,
  ChevronRight
} from "lucide-react";

interface ActionableRec {
  title: string;
  pillarName: string;
  problem: string;
  risk: string;
  consequence: string; // New: financial, social or fiscal consequence
  benefit: string;     // New: expected benefit after correction
  associatedService: string;
  urgency: "urgent" | "important" | "conseille";
}

export default function ResultsDashboard() {
  const { profile, answers, scores, recommendedServices, resetDiagnostic, updateAppointment, getPDFData } = useDiagnostic();
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  
  // Booking flow state (Simulated Calendly)
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const getPillarName = (id: number) => {
    switch (id) {
      case 0: return "Comptabilité";
      case 1: return "Fiscalité";
      case 2: return "Trésorerie";
      case 3: return "Ressources Humaines";
      case 4: return "Paie & Obligations Sociales";
      case 5: return "Facturation Électronique";
      default: return "";
    }
  };

  const getGlobalMaturity = (score: number) => {
    if (score < 50) {
      return { 
        text: "🔴 Risque élevé", 
        color: "text-rose-750 text-rose-700 border-rose-200 bg-rose-50",
        desc: "Plusieurs vulnérabilités critiques (comptables, sociales ou fiscales) menacent la stabilité juridique et financière de votre entreprise." 
      };
    }
    if (score < 70) {
      return { 
        text: "🟠 Risque modéré", 
        color: "text-amber-700 border-amber-200 bg-amber-50",
        desc: "Les bases de gestion sont présentes, mais l'absence de formalisation et la réforme de facturation 2026 menacent votre conformité à court terme." 
      };
    }
    return { 
      text: "🟢 Conforme", 
      color: "text-emerald-700 border-emerald-200 bg-emerald-50",
      desc: "Excellent niveau de maturité administrative et financière. Vous êtes parfaitement armés face aux contrôles et à la réforme de 2026." 
    };
  };

  const globalInfo = getGlobalMaturity(scores.global);

  // Pillar metadata
  const getPillarMetadata = (key: string, score: number) => {
    let riskText = "";
    let riskColor = "";
    let explanation = "";

    if (score < 50) {
      riskText = "🔴 Risque élevé";
      riskColor = "text-rose-700 bg-rose-50 border-rose-200";
    } else if (score < 70) {
      riskText = "🟠 Risque modéré";
      riskColor = "text-amber-700 bg-amber-50 border-amber-200";
    } else {
      riskText = "🟢 Conforme";
      riskColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
    }

    switch (key) {
      case "comptabilite":
        explanation = "Garantit la fiabilité de vos données financières et sous-tend toutes vos décisions stratégiques.";
        break;
      case "fiscalite":
        explanation = "Permet de sécuriser votre entreprise face aux contrôles de la DGFIP et d'optimiser vos taux d'IS.";
        break;
      case "tresorerie":
        explanation = "Assure la liquidité immédiate nécessaire au paiement de vos charges et à l'autofinancement du BFR.";
        break;
      case "rh":
        explanation = "Sécurise vos obligations d'employeur face aux risques d'inspection du travail ou de prud'hommes.";
        break;
      case "paie":
        explanation = "Garantit la conformité de vos bulletins de paie et de vos déclarations DSN face à l'URSSAF.";
        break;
      case "facturation":
        explanation = "Détermine votre conformité réglementaire face à l'obligation légale e-invoicing 2026.";
        break;
    }

    return { riskText, riskColor, explanation };
  };

  // 3. Extract actionable weaknesses with Risk, Consequence, Benefit and MAJHA service
  const getActionableWeaknesses = (): ActionableRec[] => {
    const list: ActionableRec[] = [];

    const addRec = (
      qId: string, 
      title: string, 
      riskStr: string, 
      consequenceStr: string,
      benefitStr: string,
      serviceName: string, 
      urgency: "urgent" | "important"
    ) => {
      const q = questions.find((item) => item.id === qId);
      if (q) {
        list.push({
          title,
          pillarName: getPillarName(q.pillarId),
          problem: q.text,
          risk: riskStr,
          consequence: consequenceStr,
          benefit: benefitStr,
          associatedService: serviceName,
          urgency
        });
      }
    };

    // Comptabilité Warnings
    if (answers["q1.1"] === "Pas de tenue régulière ou saisie très en retard (fort risque d'erreurs)") {
      addRec(
        "q1.1", 
        "Tenue comptable en retard", 
        "Absence de visibilité sur vos marges réelles et détection tardive des impasses de trésorerie.", 
        "Risque de pénalités de retard de liasse fiscale et risque pénal lié à l'exercice illégal de la comptabilité.",
        "Obtention d'un tableau de bord de gestion mensuel fiable pour anticiper vos décisions stratégiques.",
        "Expertise Comptable", 
        "urgent"
      );
    }
    if (answers["q1.5"] === "Non, ou nous ne savons pas ce qu'est le FEC (conformité comptable à sécuriser)") {
      addRec(
        "q1.5", 
        "Non-conformité du FEC", 
        "Incapacité à présenter le Fichier des Écritures Comptables lors d'une vérification.", 
        "Point de vigilance : Risque de rejet de conformité technique de votre comptabilité et d'anomalies fiscales.",
        "Sérénité réglementaire face à l'administration et validation automatique de vos écritures.",
        "Expertise Comptable", 
        "urgent"
      );
    }

    // Fiscalité Warnings
    const tvaDelay = Number(answers["q2.1"] || 0);
    if (tvaDelay > 15) {
      addRec(
        "q2.1", 
        "Retards de déclarations de TVA", 
        "Décalages répétés de transmission du formulaire CA3 à l'administration fiscale.", 
        "Application d'une majoration forfaitaire automatique de 10% des sommes dues et intérêts de retard mensuels.",
        "Préservation de votre trésorerie opérationnelle et maintien de relations de confiance avec la DGFIP.",
        "Expertise Comptable", 
        "urgent"
      );
    }
    if (answers["q2.5"] === "Non, nous n'avons aucun document de ce type (point de vigilance TVA)") {
      addRec(
        "q2.5", 
        "Absence de Piste d'Audit Fiable (PAF)", 
        "Défaut de formalisation écrite des contrôles internes justifiant la validité de vos factures.", 
        "Point de vigilance : Risque de contestation de la déduction de TVA sur vos factures fournisseurs.",
        "Sécurisation du droit à déduction de votre TVA et conformité stricte aux exigences de l'administration.",
        "Expertise Comptable", 
        "urgent"
      );
    }

    // Trésorerie Warnings
    const dsoValue = Number(answers["q3.4"] || 0);
    if (dsoValue > 60) {
      addRec(
        "q3.4", 
        "Délai de paiement clients excessif (DSO)", 
        "Blocage d'une part importante de votre chiffre d'affaires sous forme de créances clients non recouvrées.", 
        "Conformité à renforcer : Non-respect des règles LME de délais de paiement et impact sur votre trésorerie opérationnelle.",
        "Libération de liquidités pour autofinancer votre cycle d'exploitation et votre croissance.",
        "Conseil financier & DAF externalisé", 
        "urgent"
      );
    }
    if (answers["q3.2"] === "Pas de prévisions, nous pilotons à vue en regardant le solde bancaire") {
      addRec(
        "q3.2", 
        "Absence de budget prévisionnel", 
        "Navigation à vue sans visibilité à court/moyen terme sur l'évolution de la trésorerie.", 
        "Risque à anticiper : Risque de tensions de trésorerie imprévues et de difficultés d'accès aux financements de court terme.",
        "Anticipation des besoins de financement à 6 mois et négociation de découverts ou crédits en amont.",
        "Conseil financier & DAF externalisé", 
        "important"
      );
    }

    // RH Warnings
    if (answers["q4.3"] === "Pas de mutuelle collective en place (situation de non-conformité ANI à régulariser)") {
      addRec(
        "q4.3", 
        "Défaut de mutuelle ANI obligatoire", 
        "Non-respect de l'obligation de proposer une complémentaire santé collective financée à 50% minimum.", 
        "Conformité à renforcer : Risque de contentieux social et d'obligation de régularisation rétroactive.",
        "Mise en conformité réglementaire immédiate et amélioration de la marque employeur pour fidéliser vos talents.",
        "RH & audit social", 
        "urgent"
      );
    }
    if (answers["q4.7"] === "Non, aucun document rédigé (obligation de sécurité employeur à couvrir d'urgence)") {
      addRec(
        "q4.7", 
        "Absence de DUERP rédigé", 
        "Absence de recensement écrit des risques professionnels pour la santé et la sécurité des travailleurs.", 
        "Risque à anticiper : Risque pour la sécurité des équipes et absence de couverture légale pour la responsabilité de la direction.",
        "Sécurisation de la responsabilité de la direction et structuration d'un plan de prévention des risques au travail.",
        "RH & audit social", 
        "urgent"
      );
    }

    // Paie & Obligations Sociales Warnings
    if (answers["q6.1"] === "Bulletins saisis en interne sur un tableur (Excel) ou outil non spécialisé (fort risque d'erreur)") {
      addRec(
        "q6.1", 
        "Bulletins non sécurisés", 
        "Calcul manuel des bulletins de paie sur Excel ou logiciel inadapté.", 
        "Fort risque d'erreurs de taux de cotisations, d'absences non décomptées et de rappels de salaire.",
        "Sécurisation juridique des bulletins et automatisation complète des calculs complexes.",
        "Gestion de la paie & accompagnement social", 
        "urgent"
      );
    }
    if (answers["q6.2"] === "Retards fréquents ou erreurs de dépôt entraînant des relances ou des pénalités URSSAF") {
      addRec(
        "q6.2", 
        "DSN en retard", 
        "Déclarations sociales mensuelles déposées en retard ou comportant des anomalies de calcul.", 
        "Application de pénalités de retard automatiques par l'URSSAF et les caisses de retraite, et surcoûts administratifs.",
        "Zéro pénalité de retard, déclarations conformes dès la première transmission et sérénité administrative.",
        "Gestion de la paie & accompagnement social", 
        "urgent"
      );
    }
    if (answers["q6.3"] === "Aucune veille formalisée, nous appliquons des règles historiques sans mise à jour des grilles de salaire") {
      addRec(
        "q6.3", 
        "Absence de veille conventionnelle", 
        "Défaut d'application des grilles de salaire et des avenants de votre Convention Collective Nationale.", 
        "Risque de contentieux prud'homal individuel ou collectif pour non-respect des minima salariaux conventionnels.",
        "Ajustement automatique des salaires aux minima conventionnels et conformité sociale totale.",
        "Gestion de la paie & accompagnement social", 
        "urgent"
      );
    }
    if (answers["q6.4"] === "Suivi informel sur des calendriers papier ou par emails (risque d'erreurs ou de contestation)") {
      addRec(
        "q6.4", 
        "Gestion des absences imprécise", 
        "Suivi des congés payés, RTT et arrêts maladies géré manuellement ou de façon éparpillée.", 
        "Erreurs de calcul du solde lors des départs de salariés, contestations prud'homales et désorganisation interne.",
        "Suivi transparent en temps réel via un espace collaborateur et planification opérationnelle simplifiée.",
        "Gestion de la paie & accompagnement social", 
        "important"
      );
    }
    if (answers["q6.6"] === "Contrôle URSSAF récent ayant donné lieu à un redressement ou jamais audité (risque de conformité latent)") {
      addRec(
        "q6.6", 
        "Risque URSSAF", 
        "Absence d'audit social préventif ou contrôle récent ayant relevé des anomalies.", 
        "Risque élevé de redressement financier sur les cotisations sociales lors du prochain contrôle URSSAF.",
        "Conformité validée par des experts, réduction du risque financier et préparation sereine aux contrôles officiels.",
        "Gestion de la paie & accompagnement social", 
        "important"
      );
    }
    if (answers["q6.7"] === "Contrats éparpillés, modèles obsolètes ou avenants non signés lors des changements de poste/salaire") {
      addRec(
        "q6.7", 
        "Contrats et avenants non centralisés", 
        "Contrats de travail éparpillés, modèles obsolètes ou avenants non signés lors des changements de poste/salaire.", 
        "Risque de requalification juridique en CDI de plein droit, de litiges prud'homaux et de défaut de suivi des clauses sensibles.",
        "Centralisation sécurisée dans un espace RH dédié, mise en conformité des modèles et sécurisation juridique complète.",
        "Gestion de la paie & accompagnement social", 
        "important"
      );
    }

    // Facturation Electronique Warnings
    if (answers["q5.1"] === "Saisie libre sur Word, Excel ou sur papier libre") {
      addRec(
        "q5.1", 
        "Facturation non certifiée", 
        "Utilisation de modèles modifiables interdits par la loi anti-fraude à la TVA.", 
        "Action préventive recommandée : Risque de non-conformité aux exigences de facturation et de retards de règlements.",
        "Raccordement direct aux futurs flux de facturation obligatoire e-invoicing et automatisation de la facturation.",
        "Accompagnement facturation électronique 2026", 
        "important"
      );
    }

    // Fallbacks if no warning is triggered
    if (list.length === 0) {
      list.push({
        title: "Intégration bancaire manuelle",
        pillarName: "Comptabilité",
        problem: "Absence de flux automatisé",
        risk: "Perte de temps sur le rapprochement bancaire et retards de saisie.",
        consequence: "Erreurs potentielles d'affectation et manque de réactivité financière.",
        benefit: "Automatisation de 90% des écritures et rapprochement quotidien.",
        associatedService: "Expertise Comptable",
        urgency: "important"
      });
      list.push({
        title: "Absence d'examen ECF",
        pillarName: "Fiscalité",
        problem: "Vulnérabilité préventive",
        risk: "Absence de validation officielle de votre liasse fiscale sur les points chauds.",
        consequence: "Risque de contrôle fiscal sur pièces de la part de l'administration fiscale.",
        benefit: "Garantie de non-redressement et dispense d'intérêts de retard sur les points audités.",
        associatedService: "Expertise Comptable",
        urgency: "important"
      });
      list.push({
        title: "Raccordement e-invoicing 2026",
        pillarName: "Facturation Électronique",
        problem: "Choix de plateforme non validé",
        risk: "Retard de transition vers les formats de données mixtes Factur-X.",
        consequence: "Perturbation potentielle des règlements de vos clients grands comptes.",
        benefit: "Conformité dès le premier jour et accélération du traitement de vos factures fournisseurs.",
        associatedService: "Accompagnement facturation électronique 2026",
        urgency: "important"
      });
    }

    const urgencyWeight = { urgent: 3, important: 2, conseille: 1 };
    return list
      .sort((a, b) => urgencyWeight[b.urgency] - urgencyWeight[a.urgency])
      .slice(0, 3);
  };

  const actionableWeaknesses = getActionableWeaknesses();

  // 4. Personalized action plan with Priority, Service and Gains
  const getActionPlanGains = (rec: ActionableRec) => {
    switch (rec.associatedService) {
      case "Expertise Comptable":
        return "Sécurisation de la conformité comptable et gain de temps administratif estimé à 4 heures par semaine.";
      case "Conseil financier & DAF externalisé":
        return "Libération de trésorerie équivalente à 15-30 jours de chiffre d'affaires et amélioration directe du BFR.";
      case "Gestion de la paie & accompagnement social":
        return "Sécurisation des DSN, conformité URSSAF, réduction des risques sociaux et prud'homaux, et gain de temps administratif.";
      case "RH & audit social":
        return "Sécurisation de la responsabilité civile de la direction (DUERP) et réduction du risque de litige social.";
      case "Accompagnement facturation électronique 2026":
        return "Conformité réglementaire 2026 assurée et réduction de 50% des coûts de traitement de vos factures.";
      default:
        return "Mise en conformité réglementaire et optimisation opérationnelle.";
    }
  };

  // Simulated Booking Calendar Data
  const days = ["Lundi 15 Juin", "Mardi 16 Juin", "Mercredi 17 Juin", "Jeudi 18 Juin", "Vendredi 19 Juin"];
  const times = ["09:00", "10:30", "14:00", "15:30", "17:00"];

  const handleDownloadPdf = async () => {
    setPdfDownloaded(true);
    try {
      const pdfData = getPDFData();
      if (pdfData) {
        await generatePremiumPdf("premium-pdf-container", `Diagnostic_MAJHA_${profile?.companyName?.replace(/\s+/g, "_") || "PME"}.pdf`);
      }
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
    } finally {
      setTimeout(() => setPdfDownloaded(false), 5000);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDay && selectedTime) {
      setBookingConfirmed(true);
      updateAppointment(selectedDay, selectedTime);
    }
  };

  return (
    <div data-testid="results-dashboard" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between py-8 px-6">
      
      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
        <button 
          onClick={resetDiagnostic}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group"
        >
          <RotateCcw className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          Recommencer
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-sm tracking-wide text-slate-950">MAJHA</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full flex-grow flex flex-col justify-center gap-10">
        
        {/* Top Summary Card */}
        <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Diagnostic PME de Maturité</span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Rapport de synthèse</h1>
            <p className="text-sm text-slate-500 font-light mt-1">
              Structure : <span className="text-slate-900 font-semibold">{profile?.companyName}</span> • Effectif : {profile?.employees} salarié(s)
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-slate-900">{scores.global}<span className="text-lg text-slate-400 font-bold">/100</span></span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Score Global</span>
            </div>
            <div className="h-12 w-[1px] bg-slate-200" />
            <div className="flex flex-col gap-1 items-start">
              <div className={`px-3 py-1 rounded-lg border text-xs font-bold uppercase tracking-wider ${globalInfo.color}`}>
                {globalInfo.text}
              </div>
              <span className="text-[9px] text-slate-400 font-light italic mt-0.5">Évaluation indicative</span>
            </div>
          </div>
        </div>

        {/* Global score explanation banner */}
        <div className="p-5 rounded-xl bg-teal-50/50 border border-teal-100 text-sm leading-relaxed text-teal-900">
          <p className="font-light">
            <strong className="text-slate-900 font-semibold">Analyse globale :</strong> {globalInfo.desc}
          </p>
        </div>

        {/* SECTION 3: IMPACT POTENTIEL SUR VOTRE ENTREPRISE */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            Impact potentiel des vulnérabilités sur votre entreprise
          </h2>
          <p className="text-sm text-slate-500 font-light -mt-2">
            Notre analyse a détecté {actionableWeaknesses.length} point(s) d'attention critique. Voici l'évaluation des risques opérationnels et les gains attendus après correction.
          </p>
          
          <div className="flex flex-col gap-5">
            {actionableWeaknesses.map((rec, index) => (
              <div 
                key={index} 
                className="p-6 rounded-xl bg-white border border-slate-200 flex flex-col gap-4 shadow-sm"
              >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-rose-50 border border-rose-250 text-rose-700 text-[10px] font-bold rounded uppercase tracking-wider">
                      {rec.pillarName}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">{rec.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium italic">Vigilance {rec.urgency}</span>
                </div>

                {/* Risk and Consequences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-light text-slate-655 text-slate-500">
                  <div className="flex flex-col gap-1.5 border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0 md:pr-4">
                    <span className="font-bold text-slate-700 uppercase text-[9px] tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      Risque identifié & Conséquence
                    </span>
                    <p className="text-slate-600">
                      <span className="font-medium text-slate-800">{rec.risk}</span> {rec.consequence}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-teal-700 uppercase text-[9px] tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      Bénéfice après correction
                    </span>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      {rec.benefit}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: VOTRE PLAN D'ACTION PERSONNALISÉ MAJHA */}
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-extrabold text-slate-950 uppercase tracking-wider">Votre plan d'action personnalisé MAJHA</h2>
          </div>
          <p className="text-xs text-slate-550 text-slate-500 font-light -mt-4 leading-relaxed">
            Pour corriger ces vulnérabilités et optimiser votre organisation, nous préconisons la mise en œuvre des priorités suivantes, adossées aux expertises MAJHA.
          </p>

          <div className="flex flex-col gap-4">
            {actionableWeaknesses.map((rec, index) => (
              <div 
                key={index} 
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="flex gap-3 items-start max-w-2xl">
                  <div className="w-6 h-6 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-900">Priorité : {rec.title}</span>
                    <span className="text-slate-500 font-light">Service concerné : <strong className="text-teal-700">{rec.associatedService}</strong></span>
                    <p className="text-slate-600 font-light mt-0.5">
                      <strong className="text-emerald-700 font-semibold">Gain potentiel : </strong> 
                      {getActionPlanGains(rec)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5 & 6: BLOC DE CONVERSION PREMIUM (INTEGRATION CALENDLY READY) */}
        <div className="rounded-3xl bg-white border-2 border-teal-600/40 p-8 md:p-12 shadow-md relative overflow-hidden flex flex-col gap-8 items-center" id="booking-section">
          
          <div className="text-center flex flex-col gap-3 max-w-2xl">
            <div className="inline-flex self-center items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-250 border-teal-200 text-xs font-bold text-teal-700 tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              Rendez-vous de restitution 100% offert
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Échangez avec un expert MAJHA
            </h2>
            <p className="text-slate-600 text-xs md:text-sm font-light leading-relaxed">
              Nos équipes peuvent analyser gratuitement vos résultats et vous présenter des solutions de correction adaptées aux spécificités de votre PME.
            </p>
          </div>

          {/* CALENDLY READY INTERACTIVE WIDGET PLACEHOLDER */}
          <div className="w-full max-w-xl border border-slate-200 rounded-2xl bg-slate-50/50 p-6 flex flex-col gap-4">
            
            {/* 
              INTEGRATION CALENDLY : 
              Pour intégrer Calendly, remplacez le bloc formulaire ci-dessous par l'iframe d'intégration Calendly :
              
              <iframe 
                src="https://calendly.com/VOTRE_LIEN_CALENDLY/30min?hide_event_type_details=1&hide_gdpr=1"
                width="100%"
                height="600"
                frameborder="0"
              ></iframe>
            */}

            {bookingConfirmed ? (
              <div className="py-8 text-center flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Entretien réservé avec succès !</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Un conseiller MAJHA prendra contact avec vous le <strong className="text-slate-800">{selectedDay}</strong> à <strong className="text-slate-800">{selectedTime}</strong>.
                  </p>
                  <p className="text-[10px] text-slate-400 font-light mt-0.5">Un email de confirmation contenant le lien d'accès vous a été envoyé.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5">
                
                {/* Calendar Day Picker */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    1. Choisissez une date
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {days.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          setSelectedDay(day);
                          setSelectedTime(null);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          selectedDay === day 
                            ? "bg-teal-600 text-white border-teal-600"
                            : "bg-white border-slate-200 text-slate-655 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calendar Time Picker */}
                {selectedDay && (
                  <div className="flex flex-col gap-2 border-t border-slate-200/60 pt-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      2. Choisissez un créneau horaire
                    </span>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {times.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            selectedTime === time
                              ? "bg-teal-600 text-white border-teal-600"
                              : "bg-white border-slate-200 text-slate-655 text-slate-600 hover:border-slate-350"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form submit button */}
                <button
                  type="submit"
                  disabled={!selectedDay || !selectedTime}
                  className="w-full mt-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  Réserver mon entretien offert
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Pillars breakdown */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            Maturité réglementaire par pilier
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["comptabilite", "fiscalite", "tresorerie", "rh", "paie", "facturation"].map((key, index) => {
              const percent = scores.pillars[key as keyof typeof scores.pillars] ?? 0;
              const pId = index;
              return (
                <div key={key} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col gap-2.5 justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pilier {index + 1}</span>
                    <span className="text-xs font-semibold text-slate-900 leading-tight mt-0.5 min-h-[2.5rem] flex items-center">{getPillarName(pId)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-baseline justify-between gap-1">
                      <span className={`text-2xl font-black ${
                        percent < 50 ? "text-rose-600" : percent < 70 ? "text-amber-500" : "text-emerald-600"
                      }`}>
                        {percent}%
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500">
                      {percent < 50 ? "🔴 Risque élevé" : percent < 70 ? "🟠 Risque modéré" : "🟢 Conforme"}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent < 50 ? "bg-rose-500" : percent < 70 ? "bg-amber-500" : "bg-emerald-600"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Free PDF secondary card */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="text-sm font-bold text-slate-900">Rapport de diagnostic PDF gratuit</h4>
              <p className="text-xs text-slate-500 font-light leading-relaxed">Téléchargez la synthèse de vos 40 indicateurs clés au format PDF imprimable.</p>
            </div>
          </div>
          <button
            onClick={handleDownloadPdf}
            className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold tracking-wide transition-all shrink-0 cursor-pointer"
          >
            {pdfDownloaded ? "Téléchargement lancé..." : "Télécharger mon PDF gratuit"}
          </button>
        </div>

        {/* Section Legal Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-200/40 border border-slate-200 flex gap-3 text-slate-400 text-[10px] leading-relaxed">
          <Info className="w-4.5 h-4.5 shrink-0 text-slate-500 mt-0.5" />
          <p className="font-light">
            <span className="font-bold text-slate-550 text-slate-500">Notice légale :</span> Ce document est issu d'une auto-évaluation déclarative et est communiqué à titre d'information de maturité de gestion. Il ne constitue pas un audit légal, un avis fiscal formel ou un audit social obligatoire, et ne saurait engager la responsabilité civile du cabinet MAJHA en l'absence de vérification formelle sur pièces de vos documents comptables et juridiques.
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center pt-8 border-t border-slate-200 text-slate-400 text-xs mt-12">
        © {new Date().getFullYear()} MAJHA. Tous droits réservés.
      </footer>
      {profile && <PremiumDiagnosticPdf data={{ ...getPDFData(), answers }} id="premium-pdf-container" />}
    </div>
  );
}
