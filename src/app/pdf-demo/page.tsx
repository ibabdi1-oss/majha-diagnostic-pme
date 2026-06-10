"use client";

import React, { useState, useEffect } from "react";
import PremiumDiagnosticPdf from "../../components/pdf/PremiumDiagnosticPdf";
import { generatePremiumPdf } from "../../lib/pdf-generator";

// MOCK DATA DEFINITIONS
const mockLow = {
  contact: {
    companyName: "PME Risque Élevé SAS",
    leaderName: "René Dupont",
    email: "contact@pmerisque.fr",
    phone: "01 23 45 67 89"
  },
  globalScore: 32,
  globalRisk: "Risque élevé",
  actionPriority: "Critique",
  pillarScores: {
    comptabilite: 25,
    fiscalite: 30,
    tresorerie: 35,
    rh: 25,
    paie: 30,
    facturation: 45
  },
  recommendations: ["Expertise Comptable", "Gestion de la paie & accompagnement social"],
  opportunities: [
    "Expertise Comptable",
    "Fiscalité & Optimisation",
    "Pilotage Financier",
    "Conseil RH",
    "Gestion de la Paie & Accompagnement Social",
    "Accompagnement Facturation Électronique"
  ],
  appointment: {
    requested: false,
    time: null
  },
  generatedAt: new Date().toISOString(),
  answers: {
    "q1.1": "Pas de tenue régulière ou saisie très en retard (fort risque d'erreurs)",
    "q1.5": "Non, ou nous ne savons pas ce qu'est le FEC (conformité comptable à sécuriser)",
    "q2.1": 30,
    "q2.5": "Non, nous n'avons aucun document de ce type (point de vigilance TVA)",
    "q3.4": 90,
    "q3.2": "Pas de prévisions, nous pilotons à vue en regardant le solde bancaire",
    "q4.3": "Pas de mutuelle collective en place (situation de non-conformité ANI à régulariser)",
    "q4.7": "Non, aucun document rédigé (obligation de sécurité employeur à couvrir d'urgence)",
    "q6.1": "Bulletins saisis en interne sur un tableur (Excel) ou outil non spécialisé (fort risque d'erreur)",
    "q6.2": "Retards fréquents ou erreurs de dépôt entraînant des relances ou des pénalités URSSAF",
    "q6.3": "Aucune veille formalisée, nous appliquons des règles historiques sans mise à jour des grilles de salaire",
    "q6.4": "Suivi informel sur des calendriers papier ou par emails (risque d'erreurs ou de contestation)",
    "q6.6": "Contrôle URSSAF récent ayant donné lieu à un redressement ou jamais audité (risque de conformité latent)",
    "q6.7": "Contrats éparpillés, modèles obsolètes ou avenants non signés lors des changements de poste/salaire",
    "q5.1": "Saisie libre sur Word, Excel ou sur papier libre"
  }
};

const mockMedium = {
  contact: {
    companyName: "PME Transition SARL",
    leaderName: "Marc Vasseur",
    email: "m.vasseur@pmetransition.fr",
    phone: "06 98 76 54 32"
  },
  globalScore: 58,
  globalRisk: "Risque modéré",
  actionPriority: "Haute",
  pillarScores: {
    comptabilite: 60,
    fiscalite: 50,
    tresorerie: 55,
    rh: 65,
    paie: 60,
    facturation: 58
  },
  recommendations: ["Expertise Comptable", "Gestion de la paie & accompagnement social", "Conseil financier & DAF externalisé"],
  opportunities: [
    "Expertise Comptable",
    "Fiscalité & Optimisation",
    "Pilotage Financier",
    "Conseil RH",
    "Gestion de la Paie & Accompagnement Social",
    "Accompagnement Facturation Électronique"
  ],
  appointment: {
    requested: true,
    time: "Mardi 16 Juin à 10:30"
  },
  generatedAt: new Date().toISOString(),
  answers: {
    "q1.1": "Saisie en interne sans supervision régulière d'un expert-comptable diplômé",
    "q1.5": "Oui, mais il n'a jamais été testé par un outil de vérification de conformité de la DGFIP",
    "q2.1": 10,
    "q2.5": "Non, nous n'avons aucun document de ce type (point de vigilance TVA)",
    "q3.4": 45,
    "q3.2": "Pas de prévisions, nous pilotons à vue en regardant le solde bancaire",
    "q4.7": "Non, aucun document rédigé (obligation de sécurité employeur à couvrir d'urgence)",
    "q6.1": "Logiciel de paie en interne géré par un collaborateur non expert (veille conventionnelle fragile)",
    "q6.2": "Retards fréquents ou erreurs de dépôt entraînant des relances ou des pénalités URSSAF",
    "q6.3": "Aucune veille formalisée, nous appliquons des règles historiques sans mise à jour des grilles de salaire",
    "q6.7": "Contrats éparpillés, modèles obsolètes ou avenants non signés lors des changements de poste/salaire",
    "q5.1": "Saisie libre sur Word, Excel ou sur papier libre"
  }
};

const mockHigh = {
  contact: {
    companyName: "PME Excellence SAS",
    leaderName: "Audrey Lemoine",
    email: "a.lemoine@pmeexcellence.fr",
    phone: "07 11 22 33 44"
  },
  globalScore: 84,
  globalRisk: "Conforme",
  actionPriority: "Faible",
  pillarScores: {
    comptabilite: 85,
    fiscalite: 80,
    tresorerie: 90,
    rh: 80,
    paie: 85,
    facturation: 84
  },
  recommendations: [],
  opportunities: [],
  appointment: {
    requested: true,
    time: "Jeudi 18 Juin à 14:00"
  },
  generatedAt: new Date().toISOString(),
  answers: {
    "q1.1": "Tenue ou révision régulière confiée à un cabinet inscrit à l'Ordre des Experts-Comptables",
    "q1.5": "Oui, notre outil le génère et sa conformité technique est régulièrement auditée",
    "q2.1": 0,
    "q2.5": "Oui, documentation complète et à jour détaillant nos contrôles internes de facturation",
    "q3.4": 15,
    "q3.2": "Prévisions glissantes à 3/6 mois alimentées automatiquement par un outil de flux (ex: Agicap)",
    "q4.7": "DUERP rédigé, mis à jour annuellement et communiqué à l'ensemble de nos salariés",
    "q6.1": "Bulletins de paie entièrement externalisés et supervisés par un prestataire expert (cabinet d'expertise comptable ou spécialiste de la paie)",
    "q6.2": "DSN déposées systématiquement à temps avec contrôle de cohérence intégré avant transmission",
    "q6.3": "Veille active et automatique avec application immédiate des avenants (salaires minimums, primes, congés exceptionnels)",
    "q6.7": "Dossier RH centralisé et sécurisé (GED) avec des contrats et avenants systématiquement rédigés par un expert",
    "q5.1": "Logiciel certifié générant le format réglementaire mixte Factur-X (PDF + XML structuré) ou structuré"
  }
};

const benchmark = {
  comptabilite: 75,
  fiscalite: 70,
  tresorerie: 65,
  rh: 70,
  paie: 75,
  facturation: 60
};

export default function PdfDemo() {
  const [selectedScore, setSelectedScore] = useState<"low" | "medium" | "high">("low");
  const [downloading, setDownloading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getMockData = () => {
    switch (selectedScore) {
      case "medium": return { ...mockMedium, benchmark };
      case "high": return { ...mockHigh, benchmark };
      default: return { ...mockLow, benchmark };
    }
  };

  const currentData = getMockData();

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const fileName = `Diagnostic_MAJHA_${currentData.contact.companyName.replace(/\s+/g, "_")}.pdf`;
      const success = await generatePremiumPdf("pdf-demo-container", fileName);
      if (success) {
        console.log(`Demo PDF generated successfully: ${fileName}`);
      } else {
        alert("Erreur lors de la génération.");
      }
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="p-8 bg-slate-100 min-h-screen text-slate-800 font-sans">
      <div className="max-w-4xl mx-auto mb-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-bold">Générateur & Validateur PDF Premium MAJHA</h1>
          <p className="text-sm text-slate-500 mt-1">Générez et validez le document PDF réel directement avec des profils pré-remplis.</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedScore} 
            onChange={(e) => setSelectedScore(e.target.value as any)}
            className="px-4 py-2 border rounded-xl text-sm font-semibold bg-white cursor-pointer"
          >
            <option value="low">Profil 1 : Risque Élevé (Score 32%)</option>
            <option value="medium">Profil 2 : Risque Modéré (Score 58% + RDV)</option>
            <option value="high">Profil 3 : Conforme (Score 84% + RDV)</option>
          </select>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {downloading ? "Génération..." : "Télécharger ce PDF"}
          </button>
        </div>
      </div>

      {/* Visible layout box for layout screenshotting */}
      <div className="flex justify-center overflow-auto p-4 border border-dashed border-slate-350 bg-slate-50 rounded-2xl shadow-inner max-h-[800px]">
        {/* We mount the PDF container in a visible state so we can read, inspect, and take screenshots directly */}
        <div className="relative border border-slate-300 shadow-lg scale-90 origin-top bg-white">
          <PremiumDiagnosticPdf 
            data={currentData} 
            id="pdf-demo-container"
          />
        </div>
      </div>
    </div>
  );
}
