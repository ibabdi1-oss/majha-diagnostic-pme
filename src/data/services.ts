export interface ServiceOffering {
  id: string;
  name: string;
  category: "expertise_comptable" | "conseil_financier" | "gestion_paie" | "rh" | "facturation_electronique";
  description: string;
  ctaText: string;
  benefitText: string;
  iconName: string;
  // Détermine si le service doit être recommandé de façon prioritaire
  shouldRecommend: (
    scores: {
      comptabilite: number;
      fiscalite: number;
      tresorerie: number;
      rh: number;
      paie: number;
      facturation: number;
    },
    answers: { [questionId: string]: string | number }
  ) => boolean;
}

export const services: ServiceOffering[] = [
  {
    id: "srv_compta",
    name: "Expertise Comptable",
    category: "expertise_comptable",
    description: "Externalisation et tenue comptable complète sécurisée, établissement des comptes annuels (liasse fiscale) et conformité du fichier FEC.",
    ctaText: "Confier ma comptabilité à MAJHA",
    benefitText: "Déléguez la saisie comptable à un expert-comptable inscrit à l'Ordre et utilisez Pennylane pour suivre vos marges en temps réel.",
    iconName: "Briefcase",
    shouldRecommend: (scores, answers) => {
      // Recommandé si le score en Comptabilité est faible ou si la compta n'est pas révisée par un OEC
      return (scores.comptabilite < 70) || !answers["q1.1"]?.toString().includes("cabinet inscrit à l'Ordre");
    }
  },
  {
    id: "srv_conseil_fi",
    name: "Conseil Financier & DAF Externalisé",
    category: "conseil_financier",
    description: "Audit de BFR, mise en place d'outils de prévisions de trésorerie (Agicap), réduction des délais clients et pilotage de haut de bilan.",
    ctaText: "Optimiser ma trésorerie avec un DAF",
    benefitText: "Réduisez votre DSO sous la barre des 30 jours et liberez de la trésorerie bloquée en optimisant votre cycle d'exploitation.",
    iconName: "TrendingUp",
    shouldRecommend: (scores, answers) => {
      // Recommandé si le score Trésorerie est faible ou si la trésorerie est < 1 mois ou DSO > 45 jours
      const dso = Number(answers["q3.3"] || 0);
      const lowCash = Number(answers["q3.1"] || 0) < 1; // Trésorerie < 1 mois
      return (scores.tresorerie < 70) || lowCash || (dso > 45);
    }
  },
  {
    id: "srv_paie",
    name: "Gestion de la paie & accompagnement social",
    category: "gestion_paie",
    description: "Production sécurisée des bulletins de paie, gestion de la DSN mensuelle URSSAF, entrée/sortie de personnel et déclarations sociales.",
    ctaText: "Sécuriser mes bulletins de paie",
    benefitText: "Éliminez les risques de redressement URSSAF en confiant votre paie à nos gestionnaires spécialisés.",
    iconName: "Users",
    shouldRecommend: (scores, answers) => {
      // Recommandé si le score Paie est < 70% ou si la paie est faite en interne sur Excel/non expert
      return (scores.paie < 70) || !answers["q6.1"]?.toString().includes("externalisés");
    }
  },
  {
    id: "srv_rh",
    name: "Conseil RH & Audit Social",
    category: "rh",
    description: "Mise en conformité des contrats, rédaction du DUERP obligatoire, mise en place des élections du CSE et accord d'intéressement.",
    ctaText: "Réaliser un audit social",
    benefitText: "Sécurisez votre responsabilité de dirigeant en rédigeant un DUERP à jour et en organisant votre CSE si vous dépassez 11 salariés.",
    iconName: "Users",
    shouldRecommend: (scores, answers) => {
      // Recommandé si le score RH est faible ou s'il manque le DUERP ou la mutuelle ANI
      const noDuerp = answers["q4.4"]?.toString().includes("Non, aucun document") || !answers["q4.4"];
      const noMutuelle = answers["q4.2"]?.toString().includes("Pas de mutuelle") || !answers["q4.2"];
      return (scores.rh < 70) || noDuerp || noMutuelle;
    }
  },
  {
    id: "srv_fact_elec",
    name: "Accompagnement Facturation Électronique",
    category: "facturation_electronique",
    description: "Audit de conformité des factures, choix et intégration de la plateforme PPF/PDP et paramétrage des flux Factur-X.",
    ctaText: "Préparer ma transition 2026",
    benefitText: "Anticipez sereinement l'obligation légale de 2026 en déployant dès maintenant des outils de facturation compatibles e-invoicing.",
    iconName: "FileText",
    shouldRecommend: (scores, answers) => {
      // Recommandé si la facturation se fait sous Word/Excel ou s'il n'y a pas de plateforme choisie pour la réforme
      const noFormat = answers["q5.1"]?.toString().includes("Saisie libre") || !answers["q5.1"];
      const noPlatform = answers["q5.2"]?.toString().includes("Aucune action menée") || !answers["q5.2"];
      return (scores.facturation < 70) || noFormat || noPlatform;
    }
  }
];
