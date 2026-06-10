"use client";

import React from "react";
import { getActionPriority } from "../../context/DiagnosticContext";
import { PILLARS } from "../../data/questions";

interface PremiumDiagnosticPdfProps {
  data: any; // payload from getPDFData() plus answers
  id?: string;
}

export default function PremiumDiagnosticPdf({ data, id = "premium-pdf-container" }: PremiumDiagnosticPdfProps) {
  if (!data) return null;

  const {
    contact = {},
    globalScore = 0,
    globalRisk = "Risque modéré",
    actionPriority = "Moyenne",
    pillarScores = {},
    recommendations = [],
    opportunities = [],
    appointment = {},
    benchmark = {
      comptabilite: 75,
      fiscalite: 70,
      tresorerie: 65,
      rh: 70,
      paie: 75,
      facturation: 60
    },
    improvementPotential = {
      maturityGain: 35,
      summary: "+35 points de maturité",
      benefits: [
        "réduction des risques administratifs",
        "amélioration de la conformité",
        "gain de temps opérationnel",
        "meilleure visibilité financière"
      ]
    },
    answers = {}
  } = data;

  // Helper function to resolve pillar names
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

  // Helper to extract all actionable vulnerabilities (Risque, Conséquence, Bénéfice)
  const getVulnerabilities = () => {
    const list: any[] = [];

    const addVuln = (qId: string, title: string, pillarId: number, risk: string, consequence: string, benefit: string) => {
      if (answers[qId]) {
        list.push({
          title,
          pillarName: getPillarName(pillarId),
          risk,
          consequence,
          benefit
        });
      }
    };

    // Comptabilité
    if (answers["q1.1"] === "Pas de tenue régulière ou saisie très en retard (fort risque d'erreurs)") {
      addVuln(
        "q1.1",
        "Tenue comptable en retard",
        0,
        "Absence de visibilité sur vos marges réelles et détection tardive des impasses de trésorerie.",
        "Risque de pénalités de retard de liasse fiscale et risque pénal lié à l'exercice illégal de la comptabilité.",
        "Obtention d'un tableau de bord de gestion mensuel fiable pour anticiper vos décisions stratégiques."
      );
    }
    if (answers["q1.5"] === "Non, ou nous ne savons pas ce qu'est le FEC (conformité comptable à sécuriser)") {
      addVuln(
        "q1.5",
        "Non-conformité du FEC",
        0,
        "Incapacité à présenter le Fichier des Écritures Comptables lors d'une vérification.",
        "Risque de rejet de conformité technique de votre comptabilité et d'anomalies fiscales.",
        "Sérénité réglementaire face à l'administration et validation automatique de vos écritures."
      );
    }

    // Fiscalité
    if (Number(answers["q2.1"] || 0) > 15) {
      addVuln(
        "q2.1",
        "Retards de déclarations de TVA",
        1,
        "Décalages répétés de transmission du formulaire CA3 à l'administration fiscale.",
        "Application d'une majoration forfaitaire automatique de 10% des sommes dues et intérêts de retard mensuels.",
        "Préservation de votre trésorerie opérationnelle et maintien de relations de confiance avec la DGFIP."
      );
    }
    if (answers["q2.5"] === "Non, nous n'avons aucun document de ce type (point de vigilance TVA)") {
      addVuln(
        "q2.5",
        "Absence de Piste d'Audit Fiable (PAF)",
        1,
        "Défaut de formalisation écrite des contrôles internes justifiant la validité de vos factures.",
        "Risque de contestation de la déduction de TVA sur vos factures fournisseurs.",
        "Sécurisation du droit à déduction de votre TVA et conformité stricte aux exigences de l'administration."
      );
    }

    // Trésorerie
    if (Number(answers["q3.4"] || 0) > 60) {
      addVuln(
        "q3.4",
        "Délai de paiement clients excessif (DSO)",
        2,
        "Blocage d'une part importante de votre chiffre d'affaires sous forme de créances clients non recouvrées.",
        "Non-respect des règles LME de délais de paiement et impact sur votre trésorerie opérationnelle.",
        "Libération de liquidités pour autofinancer votre cycle d'exploitation et votre croissance."
      );
    }
    if (answers["q3.2"] === "Pas de prévisions, nous pilotons à vue en regardant le solde bancaire") {
      addVuln(
        "q3.2",
        "Absence de budget prévisionnel",
        2,
        "Navigation à vue sans visibilité à court/moyen terme sur l'évolution de la trésorerie.",
        "Risque de tensions de trésorerie imprévues et de difficultés d'accès aux financements de court terme.",
        "Anticipation des besoins de financement à 6 mois et négociation de découverts ou crédits en amont."
      );
    }

    // Ressources Humaines
    if (answers["q4.3"] === "Pas de mutuelle collective en place (situation de non-conformité ANI à régulariser)") {
      addVuln(
        "q4.3",
        "Défaut de mutuelle ANI obligatoire",
        3,
        "Non-respect de l'obligation de proposer une complémentaire santé collective financée à 50% minimum.",
        "Risque de contentieux social et d'obligation de régularisation rétroactive.",
        "Mise en conformité réglementaire immédiate et amélioration de la marque employeur pour fidéliser vos talents."
      );
    }
    if (answers["q4.7"] === "Non, aucun document rédigé (obligation de sécurité employeur à couvrir d'urgence)") {
      addVuln(
        "q4.7",
        "Absence de DUERP rédigé",
        3,
        "Absence de recensement écrit des risques professionnels pour la sécurité des travailleurs.",
        "Risque pour la sécurité des équipes et absence de couverture légale pour la responsabilité de la direction.",
        "Sécurisation de la responsabilité de la direction et structuration d'un plan de prévention des risques au travail."
      );
    }

    // Paie & Obligations Sociales
    if (answers["q6.1"] === "Bulletins saisis en interne sur un tableur (Excel) ou outil non spécialisé (fort risque d'erreur)") {
      addVuln(
        "q6.1",
        "Bulletins non sécurisés",
        4,
        "Calcul manuel des bulletins de paie sur Excel ou logiciel inadapté.",
        "Fort risque d'erreurs de taux de cotisations, d'absences non décomptées et de rappels de salaire.",
        "Sécurisation juridique des bulletins et automatisation complète des calculs complexes."
      );
    }
    if (answers["q6.2"] === "Retards fréquents ou erreurs de dépôt entraînant des relances ou des pénalités URSSAF") {
      addVuln(
        "q6.2",
        "DSN en retard",
        4,
        "Déclarations sociales mensuelles déposées en retard ou comportant des anomalies de calcul.",
        "Application de pénalités de retard automatiques par l'URSSAF et les caisses de retraite, et surcoûts administratifs.",
        "Zéro pénalité de retard, déclarations conformes dès la première transmission et sérénité administrative."
      );
    }
    if (answers["q6.3"] === "Aucune veille formalisée, nous appliquons des règles historiques sans mise à jour des grilles de salaire") {
      addVuln(
        "q6.3",
        "Absence de veille conventionnelle",
        4,
        "Défaut d'application des grilles de salaire et des avenants de votre Convention Collective Nationale.",
        "Risque de contentieux prud'homal individuel ou collectif pour non-respect des minima salariaux conventionnels.",
        "Ajustement automatique des salaires aux minima conventionnels et conformité sociale totale."
      );
    }
    if (answers["q6.4"] === "Suivi informel sur des calendriers papier ou par emails (risque d'erreurs ou de contestation)") {
      addVuln(
        "q6.4",
        "Gestion des absences imprécise",
        4,
        "Suivi des congés payés, RTT et arrêts maladies géré manuellement ou de façon éparpillée.",
        "Erreurs de calcul du solde lors des départs de salariés, contestations prud'homales et désorganisation interne.",
        "Suivi transparent en temps réel via un espace collaborateur et planification opérationnelle simplifiée."
      );
    }
    if (answers["q6.6"] === "Contrôle URSSAF récent ayant donné lieu à un redressement ou jamais audité (risque de conformité latent)") {
      addVuln(
        "q6.6",
        "Risque URSSAF",
        4,
        "Absence d'audit social préventif ou contrôle récent ayant relevé des anomalies.",
        "Risque élevé de redressement financier sur les cotisations sociales lors du prochain contrôle URSSAF.",
        "Conformité validée par des experts, réduction du risque financier et préparation sereine aux contrôles officiels."
      );
    }
    if (answers["q6.7"] === "Contrats éparpillés, modèles obsolètes ou avenants non signés lors des changements de poste/salaire") {
      addVuln(
        "q6.7",
        "Contrats et avenants non centralisés",
        4,
        "Contrats de travail éparpillés, modèles obsolètes ou avenants non signés lors des changements de poste/salaire.",
        "Risque de requalification juridique en CDI de plein droit, de litiges prud'homaux et de défaut de suivi des clauses sensibles.",
        "Centralisation sécurisée dans un espace RH dédié, mise en conformité des modèles et sécurisation juridique complète."
      );
    }

    // Facturation Électronique
    if (answers["q5.1"] === "Saisie libre sur Word, Excel ou sur papier libre") {
      addVuln(
        "q5.1",
        "Facturation non certifiée",
        5,
        "Utilisation de modèles modifiables interdits par la loi anti-fraude à la TVA.",
        "Risque de non-conformité aux exigences de facturation et de retards de règlements.",
        "Raccordement direct aux futurs flux de facturation obligatoire e-invoicing et automatisation de la facturation."
      );
    }

    // Fallback standard
    if (list.length === 0) {
      list.push({
        title: "Intégration bancaire manuelle",
        pillarName: "Comptabilité",
        risk: "Perte de temps sur le rapprochement bancaire et retards de saisie.",
        consequence: "Erreurs potentielles d'affectation et manque de réactivité financière.",
        benefit: "Automatisation de 90% des écritures et rapprochement quotidien."
      });
      list.push({
        title: "Absence d'examen ECF",
        pillarName: "Fiscalité",
        risk: "Absence de validation officielle de votre liasse fiscale sur les points chauds.",
        consequence: "Risque de contrôle fiscal sur pièces de la part de l'administration fiscale.",
        benefit: "Garantie de non-redressement et dispense d'intérêts de retard sur les points audités."
      });
    }

    return list;
  };

  const activeVulnerabilities = getVulnerabilities();

  // Color code mappings
  const getRiskBadgeLabel = (score: number) => {
    if (score < 50) return "🔴 Risque élevé";
    if (score < 70) return "🟠 Risque modéré";
    return "🟢 Conforme";
  };

  const getRiskBadgeStyles = (score: number) => {
    if (score < 50) return { color: "#e11d48", backgroundColor: "#fff1f2", borderColor: "#ffe4e6" };
    if (score < 70) return { color: "#d97706", backgroundColor: "#fffbeb", borderColor: "#fef3c7" };
    return { color: "#0d9488", backgroundColor: "#f0fdf4", borderColor: "#ccfbf1" };
  };

  const getPrioBadgeStyles = (prio: string) => {
    switch (prio) {
      case "Critique": return { color: "#e11d48", backgroundColor: "#ffe4e6", borderColor: "#fecdd3" };
      case "Haute": return { color: "#d97706", backgroundColor: "#fef3c7", borderColor: "#fde68a" };
      case "Moyenne": return { color: "#1d4ed8", backgroundColor: "#eff6ff", borderColor: "#bfdbfe" };
      default: return { color: "#0d9488", backgroundColor: "#f0fdf4", borderColor: "#ccfbf1" };
    }
  };

  const globalRiskLabel = getRiskBadgeLabel(globalScore);
  const globalRiskStyle = getRiskBadgeStyles(globalScore);
  const globalPrioStyle = getPrioBadgeStyles(actionPriority);

  // Find the 3 weakest pillars
  const sortedPillars = [
    { name: "Comptabilité", score: pillarScores.comptabilite ?? 0 },
    { name: "Fiscalité", score: pillarScores.fiscalite ?? 0 },
    { name: "Trésorerie", score: pillarScores.tresorerie ?? 0 },
    { name: "Ressources Humaines", score: pillarScores.rh ?? 0 },
    { name: "Paie & Obligations Sociales", score: pillarScores.paie ?? 0 },
    { name: "Facturation Électronique", score: pillarScores.facturation ?? 0 }
  ].sort((a, b) => a.score - b.score);

  const getUrgencyLevel = (score: number) => {
    if (score <= 40) return "Critique";
    if (score <= 60) return "Élevé";
    if (score <= 79) return "Modéré";
    return "Faible";
  };
  const urgencyLevel = getUrgencyLevel(globalScore);

  // Dynamic business benefits based on low scores (< 70)
  const activeBenefits: string[] = [];
  if ((pillarScores.comptabilite ?? 0) < 70 || (pillarScores.fiscalite ?? 0) < 70) activeBenefits.push("Réduction du risque fiscal");
  if ((pillarScores.rh ?? 0) < 70 || (pillarScores.paie ?? 0) < 70) activeBenefits.push("Réduction des risques sociaux");
  if ((pillarScores.tresorerie ?? 0) < 70) activeBenefits.push("Amélioration de la trésorerie");
  if ((pillarScores.comptabilite ?? 0) < 70 || (pillarScores.paie ?? 0) < 70 || (pillarScores.facturation ?? 0) < 70) activeBenefits.push("Gain de temps administratif");
  if ((pillarScores.comptabilite ?? 0) < 70 || (pillarScores.tresorerie ?? 0) < 70) activeBenefits.push("Meilleure visibilité financière");

  // Fallbacks if no low scores
  if (activeBenefits.length === 0) {
    activeBenefits.push("Optimisation fiscale continue");
    activeBenefits.push("Sécurisation sociale permanente");
    activeBenefits.push("Pilotage financier proactif");
  }

  return (
    <div
      id={id}
      style={{
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        width: "794px",
        backgroundColor: "#f8fafc",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* ========================================================================= */}
      {/* PAGE 1 : COUVERTURE PREMIUM */}
      {/* ========================================================================= */}
      <div
        className="pdf-page"
        style={{
          width: "794px",
          height: "1123px",
          boxSizing: "border-box",
          backgroundColor: "#0f172a", // Dark theme background
          color: "#ffffff",
          padding: "80px 60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden"
        }}
      >
        {/* Cover Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Custom Styled HTML Premium Logo (no canvas taint) */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#0d9488", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#ffffff", fontWeight: "900", fontSize: "20px" }}>M</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: "900", fontSize: "18px", letterSpacing: "2px" }}>MAJHA</span>
              <span style={{ fontSize: "7px", color: "#d97706", fontWeight: "700", letterSpacing: "1.5px" }}>CONSEIL & ACCOMPAGNEMENT</span>
            </div>
          </div>
          <span style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "bold" }}>Rapport Confidentiel</span>
        </div>

        {/* Cover Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginTop: "40px" }}>
          <div style={{ width: "60px", height: "4px", backgroundColor: "#0d9488" }}></div>
          <h1 style={{ fontSize: "38px", fontWeight: "900", lineHeight: "1.2", letterSpacing: "-1px", maxWidth: "600px" }}>
            Diagnostic de Maturité Administrative & Financière
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "16px", fontWeight: "300", maxWidth: "500px" }}>
            Évaluation stratégique de conformité et plan d'action opérationnel pour le développement de votre entreprise.
          </p>
        </div>

        {/* Cover Score visualization & Badges (Enlarged and centered) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "25px", margin: "60px 0", width: "100%" }}>
          {/* Big Circular Score */}
          <div style={{ position: "relative", width: "220px", height: "220px", borderRadius: "50%", border: "10px solid #1e293b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(30, 41, 59, 0.4)" }}>
            <span style={{ fontSize: "72px", fontWeight: "900", color: "#ffffff", lineHeight: "1" }}>
              {globalScore}
            </span>
            <span style={{ fontSize: "12px", color: "#0d9488", textTransform: "uppercase", fontWeight: "800", letterSpacing: "1.5px", marginTop: "6px" }}>
              Score Global
            </span>
            {/* Visual Arc Indicator */}
            <div style={{ position: "absolute", inset: "-10px", borderRadius: "50%", border: "10px solid transparent", borderTopColor: "#0d9488", borderRightColor: "#0d9488", transform: `rotate(${Math.min(270, (globalScore / 100) * 360) - 135}deg)` }}></div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginTop: "10px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>Niveau de risque :</span>
              <span style={{ display: "inline-block", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", border: "1px solid", ...globalRiskStyle }}>
                {globalRiskLabel}
              </span>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>Priorité d'action :</span>
              <span style={{ display: "inline-block", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", border: "1px solid", ...globalPrioStyle }}>
                {actionPriority}
              </span>
            </div>
          </div>
        </div>

        {/* Cover Footer & Metadata */}
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: "35px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "20px" }}>
          <div>
            <span style={{ fontSize: "9px", color: "#94a3b8", textTransform: "uppercase", display: "block" }}>Entreprise</span>
            <span style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff" }}>{contact.companyName || "Non spécifié"}</span>
          </div>
          <div>
            <span style={{ fontSize: "9px", color: "#94a3b8", textTransform: "uppercase", display: "block" }}>Dirigeant</span>
            <span style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff" }}>{contact.leaderName || "Non spécifié"}</span>
          </div>
          <div>
            <span style={{ fontSize: "9px", color: "#94a3b8", textTransform: "uppercase", display: "block" }}>Date d'évaluation</span>
            <span style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff" }}>{new Date(data.generatedAt || Date.now()).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 2 : SYNTHÈSE EXÉCUTIVE & BENCHMARK */}
      {/* ========================================================================= */}
      <div
        className="pdf-page"
        style={{
          width: "794px",
          height: "1123px",
          boxSizing: "border-box",
          backgroundColor: "#f8fafc",
          color: "#1e293b",
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "15px" }}>
          <span style={{ fontSize: "10px", fontWeight: "bold", color: "#0d9488", textTransform: "uppercase", letterSpacing: "1.5px" }}>1. Synthèse & Benchmark</span>
          <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "bold" }}>{contact.companyName}</span>
        </div>

        {/* Content columns */}
        <div style={{ display: "flex", gap: "40px", flexGrow: 1, marginTop: "30px", marginBottom: "30px" }}>
          {/* Left Column (60%) */}
          <div style={{ width: "60%", display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Executive Summary */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a" }}>Synthèse Exécutive</h2>
              <p style={{ fontSize: "11px", color: "#475569", lineHeight: "1.6", fontWeight: "300" }}>
                L'analyse globale de maturité de <strong style={{ fontWeight: "700" }}>{contact.companyName}</strong> met en évidence un score de <strong style={{ fontWeight: "700" }}>{globalScore}/100</strong>, caractérisant une situation de <strong style={{ color: globalScore < 50 ? "#e11d48" : globalScore < 70 ? "#d97706" : "#0d9488", fontWeight: "700" }}>{globalRisk.toLowerCase()}</strong>. La priorité d'action requise est estimée <strong style={{ fontWeight: "700" }}>{actionPriority.toLowerCase()}</strong> pour sécuriser le fonctionnement et préparer la transition réglementaire obligatoire.
              </p>
            </div>

            {/* Recommandation MAJHA Block */}
            <div style={{ backgroundColor: "#ffffff", border: "2px solid #0d9488", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: "900", color: "#0d9488", textTransform: "uppercase", letterSpacing: "1px" }}>Recommandation MAJHA</span>
                <span style={{ fontSize: "9px", padding: "3px 8px", borderRadius: "6px", fontWeight: "bold", border: "1px solid",
                  ...(urgencyLevel === "Critique" ? { color: "#e11d48", backgroundColor: "#ffe4e6", borderColor: "#fecdd3" } :
                      urgencyLevel === "Élevé" ? { color: "#d97706", backgroundColor: "#fef3c7", borderColor: "#fde68a" } :
                      urgencyLevel === "Modéré" ? { color: "#1d4ed8", backgroundColor: "#eff6ff", borderColor: "#bfdbfe" } :
                      { color: "#0d9488", backgroundColor: "#f0fdf4", borderColor: "#ccfbf1" })
                }}>
                  Urgence : {urgencyLevel}
                </span>
              </div>
              <p style={{ fontSize: "10.5px", color: "#475569", margin: 0, lineHeight: "1.4" }}>
                Au regard des résultats obtenus, nous recommandons un accompagnement prioritaire sur les piliers suivants :
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                {sortedPillars.slice(0, 3).map((p, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#1f2937" }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: idx === 0 ? "#e11d48" : idx === 1 ? "#d97706" : "#2563eb", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "bold" }}>
                      {idx + 1}
                    </div>
                    <span style={{ fontWeight: "700" }}>{p.name}</span>
                    <span style={{ color: "#6b7280", fontSize: "10px" }}>(Score : {p.score}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benchmark PME Table */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <h3 style={{ fontSize: "12px", fontWeight: "850", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>Comparatif Benchmark PME</h3>
              <div style={{ backgroundColor: "#ffffff", borderRadius: "10px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "1px solid #e2e8f0", fontWeight: "bold", color: "#475569" }}>
                      <th style={{ padding: "8px 12px" }}>Pilier d'analyse</th>
                      <th style={{ padding: "8px 12px", textAlign: "center" }}>Votre score</th>
                      <th style={{ padding: "8px 12px", textAlign: "center" }}>Référence PME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Comptabilité", key: "comptabilite", ref: benchmark.comptabilite },
                      { name: "Fiscalité", key: "fiscalite", ref: benchmark.fiscalite },
                      { name: "Trésorerie", key: "tresorerie", ref: benchmark.tresorerie },
                      { name: "Ressources Humaines", key: "rh", ref: benchmark.rh },
                      { name: "Paie & Obligations Sociales", key: "paie", ref: benchmark.paie },
                      { name: "Facturation Électronique", key: "facturation", ref: benchmark.facturation }
                    ].map((row, index) => {
                      const score = pillarScores[row.key] ?? 0;
                      return (
                        <tr key={index} style={{ borderBottom: index < 5 ? "1px solid #e2e8f0" : "none" }}>
                          <td style={{ padding: "8px 12px", fontWeight: "600", color: "#334155" }}>{row.name}</td>
                          <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: "900", color: score < 50 ? "#e11d48" : score < 70 ? "#d97706" : "#0d9488" }}>{score}%</td>
                          <td style={{ padding: "8px 12px", textAlign: "center", color: "#64748b" }}>{row.ref}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Improvement Potential Premium Block */}
            <div style={{ backgroundColor: "rgba(13, 148, 136, 0.05)", border: "1px solid rgba(13, 148, 136, 0.2)", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "10px", fontWeight: "800", color: "#0d9488", textTransform: "uppercase", letterSpacing: "0.5px" }}>Potentiel de gain de maturité</span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>
                  Progression potentielle estimée : <strong style={{ color: "#0d9488", fontWeight: "800" }}>{improvementPotential.summary}</strong>
                </span>
              </div>
              <div style={{ borderTop: "1px solid rgba(13, 148, 136, 0.15)", paddingTop: "10px" }}>
                <span style={{ fontSize: "10px", fontWeight: "bold", color: "#0f172a", textTransform: "uppercase", display: "block", marginBottom: "8px", letterSpacing: "0.5px" }}>Bénéfices métiers prioritaires :</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {activeBenefits.map((b: string, idx: number) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#334155", fontWeight: "600" }}>
                      <span style={{ color: "#0d9488", fontWeight: "900", fontSize: "12px" }}>✓</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (40%) */}
          <div style={{ width: "40%", display: "flex", flexDirection: "column", gap: "25px", borderLeft: "1px solid #e2e8f0", paddingLeft: "30px" }}>
            {/* Service Recommendations */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "900", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>Opportunités d'Accompagnement</h2>
              <p style={{ fontSize: "10px", color: "#64748b", fontWeight: "300", lineHeight: "1.4" }}>
                Selon les faiblesses détectées, MAJHA a identifié {opportunities.length} axes prioritaires pour renforcer votre organisation.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {opportunities.map((opp: string, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px"
                    }}
                  >
                    <span style={{ fontSize: "10px", fontWeight: "800", color: "#0d9488" }}>Offre #{idx + 1}</span>
                    <span style={{ fontSize: "11px", fontWeight: "900", color: "#0f172a" }}>{opp}</span>
                  </div>
                ))}
                {opportunities.length === 0 && (
                  <div style={{ padding: "12px", border: "1px dotted #e2e8f0", borderRadius: "10px", textAlign: "center", fontSize: "10px", color: "#64748b" }}>
                    Aucun besoin critique identifié.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8px", color: "#94a3b8", borderTop: "1px solid #e2e8f0", paddingTop: "15px" }}>
          <span>MAJHA © {new Date().getFullYear()}</span>
          <span>Page 2 sur 5</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 3 : ANALYSE DÉTAILLÉE DES PILIERS 1 À 3 */}
      {/* ========================================================================= */}
      <div
        className="pdf-page"
        style={{
          width: "794px",
          height: "1123px",
          boxSizing: "border-box",
          backgroundColor: "#f8fafc",
          color: "#1e293b",
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "15px" }}>
          <span style={{ fontSize: "10px", fontWeight: "bold", color: "#0d9488", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            2. Analyse Détaillée - Piliers 1 à 3
          </span>
          <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "bold" }}>{contact.companyName}</span>
        </div>

        {/* Content - 3 Pillars */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px", flexGrow: 1, marginTop: "30px", marginBottom: "30px" }}>
          {[0, 1, 2].map((pId) => {
            const keys = ["comptabilite", "fiscalite", "tresorerie"];
            const key = keys[pId];
            const name = getPillarName(pId);
            const score = pillarScores[key] ?? 0;
            const label = getRiskBadgeLabel(score);
            const badgeStyle = getRiskBadgeStyles(score);

            // Filter vulnerabilities related to this pillar
            const pillarVulnerabilities = activeVulnerabilities.filter(v => v.pillarName === name);

            return (
              <div
                key={pId}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  minHeight: "260px"
                }}
              >
                {/* Header card */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "9px", fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase" }}>Pilier {pId + 1}</span>
                    <h3 style={{ fontSize: "14px", fontWeight: "900", color: "#0f172a" }}>{name}</h3>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "6px", fontSize: "9px", fontWeight: "bold", border: "1px solid", ...badgeStyle }}>
                      {label}
                    </span>
                    <span style={{ fontSize: "18px", fontWeight: "900", color: score < 50 ? "#e11d48" : score < 70 ? "#d97706" : "#0d9488" }}>
                      {score}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ width: "100%", height: "4px", backgroundColor: "#f1f5f9", borderRadius: "2px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      backgroundColor: score < 50 ? "#e11d48" : score < 70 ? "#d97706" : "#0d9488",
                      width: `${score}%`,
                      borderRadius: "2px"
                    }}
                  />
                </div>

                {/* Risk and gains analysis layout */}
                <div style={{ display: "flex", gap: "20px", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                  {/* Risks Column (50%) */}
                  <div style={{ width: "50%", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontSize: "9px", fontWeight: "bold", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>Risques & Vulnérabilités :</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {pillarVulnerabilities.map((v, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontSize: "10px", fontWeight: "bold", color: "#e11d48" }}>⚠️ {v.title}</span>
                          <span style={{ fontSize: "9px", color: "#64748b", lineHeight: "1.3" }}>{v.risk}</span>
                        </div>
                      ))}
                      {pillarVulnerabilities.length === 0 && (
                        <span style={{ fontSize: "10px", color: "#64748b", fontStyle: "italic" }}>Aucun risque majeur identifié.</span>
                      )}
                    </div>
                  </div>
                  {/* Benefit Column (50%) */}
                  <div style={{ width: "50%", display: "flex", flexDirection: "column", gap: "6px", borderLeft: "1px solid #f1f5f9", paddingLeft: "20px" }}>
                    <span style={{ fontSize: "9px", fontWeight: "bold", color: "#0d9488", textTransform: "uppercase", letterSpacing: "0.5px" }}>Bénéfices après correction :</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {pillarVulnerabilities.map((v, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontSize: "10px", fontWeight: "bold", color: "#0d9488" }}>✓ {v.title}</span>
                          <span style={{ fontSize: "9px", color: "#475569", lineHeight: "1.3" }}>{v.benefit}</span>
                        </div>
                      ))}
                      {pillarVulnerabilities.length === 0 && (
                        <span style={{ fontSize: "9px", color: "#475569", lineHeight: "1.3" }}>Maintien de la bonne conformité administrative de l'entreprise.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8px", color: "#94a3b8", borderTop: "1px solid #e2e8f0", paddingTop: "15px" }}>
          <span>MAJHA © {new Date().getFullYear()}</span>
          <span>Page 3 sur 5</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 4 : ANALYSE DÉTAILLÉE DES PILIERS 4 À 6 */}
      {/* ========================================================================= */}
      <div
        className="pdf-page"
        style={{
          width: "794px",
          height: "1123px",
          boxSizing: "border-box",
          backgroundColor: "#f8fafc",
          color: "#1e293b",
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "15px" }}>
          <span style={{ fontSize: "10px", fontWeight: "bold", color: "#0d9488", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            3. Analyse Détaillée - Piliers 4 à 6
          </span>
          <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "bold" }}>{contact.companyName}</span>
        </div>

        {/* Content - 3 Pillars */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px", flexGrow: 1, marginTop: "30px", marginBottom: "30px" }}>
          {[3, 4, 5].map((pId) => {
            const keys = ["rh", "paie", "facturation"];
            const key = keys[pId - 3];
            const name = getPillarName(pId);
            const score = pillarScores[key] ?? 0;
            const label = getRiskBadgeLabel(score);
            const badgeStyle = getRiskBadgeStyles(score);

            // Filter vulnerabilities related to this pillar
            const pillarVulnerabilities = activeVulnerabilities.filter(v => v.pillarName === name);

            return (
              <div
                key={pId}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  minHeight: "260px"
                }}
              >
                {/* Header card */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "9px", fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase" }}>Pilier {pId + 1}</span>
                    <h3 style={{ fontSize: "14px", fontWeight: "900", color: "#0f172a" }}>{name}</h3>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "6px", fontSize: "9px", fontWeight: "bold", border: "1px solid", ...badgeStyle }}>
                      {label}
                    </span>
                    <span style={{ fontSize: "18px", fontWeight: "900", color: score < 50 ? "#e11d48" : score < 70 ? "#d97706" : "#0d9488" }}>
                      {score}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ width: "100%", height: "4px", backgroundColor: "#f1f5f9", borderRadius: "2px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      backgroundColor: score < 50 ? "#e11d48" : score < 70 ? "#d97706" : "#0d9488",
                      width: `${score}%`,
                      borderRadius: "2px"
                    }}
                  />
                </div>

                {/* Risk and gains analysis layout */}
                <div style={{ display: "flex", gap: "20px", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                  {/* Risks Column (50%) */}
                  <div style={{ width: "50%", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontSize: "9px", fontWeight: "bold", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>Risques & Vulnérabilités :</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {pillarVulnerabilities.map((v, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontSize: "10px", fontWeight: "bold", color: "#e11d48" }}>⚠️ {v.title}</span>
                          <span style={{ fontSize: "9px", color: "#64748b", lineHeight: "1.3" }}>{v.risk}</span>
                        </div>
                      ))}
                      {pillarVulnerabilities.length === 0 && (
                        <span style={{ fontSize: "10px", color: "#64748b", fontStyle: "italic" }}>Aucun risque majeur identifié.</span>
                      )}
                    </div>
                  </div>
                  {/* Benefit Column (50%) */}
                  <div style={{ width: "50%", display: "flex", flexDirection: "column", gap: "6px", borderLeft: "1px solid #f1f5f9", paddingLeft: "20px" }}>
                    <span style={{ fontSize: "9px", fontWeight: "bold", color: "#0d9488", textTransform: "uppercase", letterSpacing: "0.5px" }}>Bénéfices après correction :</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {pillarVulnerabilities.map((v, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontSize: "10px", fontWeight: "bold", color: "#0d9488" }}>✓ {v.title}</span>
                          <span style={{ fontSize: "9px", color: "#475569", lineHeight: "1.3" }}>{v.benefit}</span>
                        </div>
                      ))}
                      {pillarVulnerabilities.length === 0 && (
                        <span style={{ fontSize: "9px", color: "#475569", lineHeight: "1.3" }}>Sécurisation réglementaire continue de la partie administrative.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8px", color: "#94a3b8", borderTop: "1px solid #e2e8f0", paddingTop: "15px" }}>
          <span>MAJHA © {new Date().getFullYear()}</span>
          <span>Page 4 sur 5</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 5 : CONCLUSION & SUIVI COMMERCIAL */}
      {/* ========================================================================= */}
      <div
        className="pdf-page"
        style={{
          width: "794px",
          height: "1123px",
          boxSizing: "border-box",
          backgroundColor: "#f8fafc",
          color: "#1e293b",
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "15px" }}>
          <span style={{ fontSize: "10px", fontWeight: "bold", color: "#0d9488", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            4. Conclusion & Prochaines Étapes
          </span>
          <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "bold" }}>{contact.companyName}</span>
        </div>

        {/* Action Plan Table */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", flexGrow: 1, marginTop: "25px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "900", color: "#0f172a" }}>Top 5 actions prioritaires</h3>
            <div style={{ backgroundColor: "#ffffff", borderRadius: "10px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9px", textAlign: "left" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "1px solid #e2e8f0", fontWeight: "bold", color: "#475569" }}>
                    <th style={{ padding: "8px 12px", width: "40px" }}>Prio</th>
                    <th style={{ padding: "8px 12px" }}>Action recommandee</th>
                    <th style={{ padding: "8px 12px" }}>Pilier concerne</th>
                    <th style={{ padding: "8px 12px", textAlign: "right" }}>Niveau de risque</th>
                  </tr>
                </thead>
                <tbody>
                  {activeVulnerabilities.slice(0, 5).map((v, index) => (
                    <tr key={index} style={{ borderBottom: index < activeVulnerabilities.slice(0, 5).length - 1 ? "1px solid #e2e8f0" : "none" }}>
                      <td style={{ padding: "8px 12px", fontWeight: "bold", color: "#0d9488" }}>#{index + 1}</td>
                      <td style={{ padding: "8px 12px", fontWeight: "700", color: "#1e293b" }}>{v.title}</td>
                      <td style={{ padding: "8px 12px", color: "#475569" }}>{v.pillarName}</td>
                      <td style={{ padding: "8px 12px", textAlign: "right", color: "#e11d48", fontWeight: "bold" }}>🔴 Critique</td>
                    </tr>
                  ))}
                  {activeVulnerabilities.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: "12px", textAlign: "center", color: "#64748b" }}>Aucune vulnérabilité critique active.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Restitution meeting info card (Optimized confirmed block) */}
          {appointment.requested && appointment.time && (
            <div style={{ backgroundColor: "#f0fdf4", border: "2px solid #0d9488", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
              <span style={{ fontSize: "11px", fontWeight: "900", color: "#0d9488", textTransform: "uppercase", letterSpacing: "1px" }}>VOTRE ENTRETIEN EST CONFIRMÉ</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#1f2937" }}>
                  <span>📅</span>
                  <span><strong>Date & Heure :</strong> {appointment.time}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#1f2937" }}>
                  <span>👨</span>
                  <span><strong>Expert :</strong> Conseiller Expert MAJHA</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#1f2937", gridColumn: "span 2" }}>
                  <span>📧</span>
                  <span style={{ color: "#059669", fontWeight: "600" }}>Confirmation envoyée à votre adresse email</span>
                </div>
              </div>
            </div>
          )}

          {/* Premium Conclusion Message */}
          <div style={{ borderTop: "2px solid #e2e8f0", paddingTop: "20px", marginTop: "10px" }}>
            <p style={{ fontSize: "11px", color: "#334155", lineHeight: "1.6", fontWeight: "normal", fontStyle: "italic", textAlign: "justify" }}>
              "La maturité administrative et financière constitue un levier majeur de croissance durable.
              Les résultats de ce diagnostic permettent d’identifier les actions prioritaires pour renforcer la conformité, sécuriser la gestion et améliorer la performance globale de votre entreprise.
              Les équipes MAJHA restent à votre disposition pour vous accompagner dans la mise en œuvre de ces recommandations."
            </p>
          </div>

          {/* Contact Details Grid (Optimized Coordinate Visibility) */}
          <div style={{ borderTop: "2px solid #e2e8f0", paddingTop: "20px", marginTop: "15px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: "900", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>Besoin d'accompagnement ?</span>
            <p style={{ fontSize: "10.5px", color: "#475569", margin: 0, lineHeight: "1.4" }}>
              Pour toute question sur vos résultats ou pour en savoir plus sur nos offres, n'hésitez pas à nous contacter directement.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "5px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "9px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.5px" }}>Téléphone</span>
                <span style={{ fontSize: "13px", fontWeight: "800", color: "#0d9488" }}>01 88 88 88 88</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "9px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.5px" }}>Email</span>
                <span style={{ fontSize: "13px", fontWeight: "800", color: "#0d9488" }}>contact@majha.fr</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "9px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.5px" }}>Site Web</span>
                <span style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>www.majha.fr</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "9px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.5px" }}>Adresse</span>
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#0f172a" }}>12 Rue de la Paix, 75002 Paris</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer & legal disclaimer */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid #e2e8f0", paddingTop: "15px" }}>
          <p style={{ fontSize: "7px", color: "#94a3b8", lineHeight: "1.3", margin: 0 }}>
            <strong style={{ color: "#64748b" }}>Notice légale :</strong> Ce rapport est basé sur les réponses déclaratives fournies par le dirigeant. Il ne remplace pas un audit de conformité légal complet ni un avis d'expert formel. MAJHA ne peut être tenu responsable d'écarts de gestion ou réglementaires.
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8px", color: "#94a3b8" }}>
            <span>MAJHA © {new Date().getFullYear()}</span>
            <span>Page 5 sur 5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
