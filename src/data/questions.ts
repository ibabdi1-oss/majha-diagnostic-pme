export interface Option {
  label: string;
  score: number;
}

export interface Question {
  id: string; // e.g., 'q1.1'
  pillarId: number; // 0: Compta, 1: Fiscalité, 2: Trésorerie, 3: RH, 4: Paie, 5: Facturation
  text: string;
  type: "choice" | "numeric";
  options?: Option[];
  placeholder?: string;
  unit?: string;
  calculateScore?: (value: number, context?: { annualCA: number; employees: number }) => number;
  helpText?: string;
}

export const PILLARS = [
  { id: 0, name: "Comptabilité", desc: "Tenue, clôture, FEC et pilotage financier" },
  { id: 1, name: "Fiscalité", desc: "TVA, IS, taxes locales, PAF et risques fiscaux" },
  { id: 2, name: "Trésorerie", desc: "BFR, DSO, prévisions financières et placements" },
  { id: 3, name: "Ressources Humaines", desc: "Obligations employeur, DUERP et CSE" },
  { id: 4, name: "Paie & Obligations Sociales", desc: "Bulletins, DSN, veille conventionnelle et suivi des coûts" },
  { id: 5, name: "Facturation Électronique", desc: "Réforme 2026, formats Factur-X, PPF/PDP et archivage" }
];

export const questions: Question[] = [
  // ==========================================
  // PILIER 1 : COMPTABILITÉ (3 questions)
  // ==========================================
  {
    id: "q1.1",
    pillarId: 0,
    text: "Comment est organisée la tenue de votre comptabilité générale ?",
    type: "choice",
    options: [
      { label: "Pas de tenue régulière ou saisie très en retard (fort risque d'erreurs)", score: 0 },
      { label: "Saisie en interne sans supervision régulière d'un expert-comptable diplômé", score: 1 },
      { label: "Tenue ou révision régulière confiée à un cabinet inscrit à l'Ordre des Experts-Comptables", score: 2 }
    ],
    helpText: "La loi française réserve la tenue de comptabilité pour le compte de tiers aux seuls professionnels inscrits à l'Ordre."
  },
  {
    id: "q1.2",
    pillarId: 0,
    text: "Quel outil utilisez-vous pour saisir et gérer votre comptabilité ?",
    type: "choice",
    options: [
      { label: "Tableur (Excel / Google Sheets) ou sur papier libre pour la comptabilité", score: 0 },
      { label: "Logiciel comptable local avec rapprochement mensuel manuel et numérisation simple", score: 1 },
      { label: "Outil cloud moderne (ex: Pennylane, Dext) avec synchro bancaire quotidienne et archivage GED valeur probante", score: 2 }
    ],
    helpText: "L'automatisation réduit les risques de saisie manuelle et de perte de pièces."
  },
  {
    id: "q1.4",
    pillarId: 0,
    text: "Êtes-vous en mesure de générer instantanément un Fichier des Écritures Comptables (FEC) ?",
    type: "choice",
    options: [
      { label: "Non, ou nous ne savons pas ce qu'est le FEC (conformité comptable à sécuriser)", score: 0 },
      { label: "Oui, mais il n'a jamais été testé par un outil de vérification de conformité de la DGFIP", score: 1 },
      { label: "Oui, notre outil le génère et sa conformité technique est régulièrement auditée", score: 2 }
    ],
    helpText: "Le FEC est obligatoire lors de tout contrôle fiscal. Un FEC non conforme peut entraîner un rejet de comptabilité."
  },

  // ==========================================
  // PILIER 2 : FISCALITÉ (3 questions)
  // ==========================================
  {
    id: "q2.1",
    pillarId: 1,
    text: "Combien de jours de retard cumulez-vous sur le dépôt ou le paiement de vos dernières déclarations de TVA ?",
    type: "numeric",
    placeholder: "Indiquez 0 si vous n’avez aucun retard.",
    unit: "jours",
    calculateScore: (value) => {
      if (value <= 0) return 2;
      if (value <= 15) return 1;
      return 0;
    },
    helpText: "La DGFIP applique une majoration automatique de 10% pour retard de paiement de TVA, plus des intérêts mensuels."
  },
  {
    id: "q2.2",
    pillarId: 1,
    text: "Votre entreprise dispose-t-elle d'une documentation de Piste d'Audit Fiable (PAF) ?",
    type: "choice",
    options: [
      { label: "Non, nous n'avons aucun document de ce type (point de vigilance TVA)", score: 0 },
      { label: "Processus de facturation documenté de manière très simple ou non mis à jour", score: 1 },
      { label: "Oui, documentation complète et à jour détaillant nos contrôles internes de facturation", score: 2 }
    ],
    helpText: "La PAF est obligatoire pour toutes les entreprises qui émettent ou reçoivent des factures PDF simples."
  },
  {
    id: "q2.4",
    pillarId: 1,
    text: "Comment optimisez-vous et sécurisez-vous votre fiscalité globale ?",
    type: "choice",
    options: [
      { label: "Pas d'ECF annuel ni d'aides fiscales (CIR, CII, mécénat) par méconnaissance", score: 0 },
      { label: "Utilisation d'aides fiscales (CIR/CII) sans rescrit ni examen de conformité régulier", score: 1 },
      { label: "Examen de Conformité Fiscale (ECF) annuel validé et aides sécurisées par rescrit", score: 2 }
    ],
    helpText: "L'ECF est un audit de conformité sur 10 points fiscaux clés qui limite fortement la probabilité d'un contrôle fiscal."
  },

  // ==========================================
  // PILIER 3 : TRÉSORERIE (3 questions)
  // ==========================================
  {
    id: "q3.1",
    pillarId: 2,
    text: "De combien de mois de charges ou de chiffre d'affaires disposez-vous en trésorerie disponible immédiatement ?",
    type: "numeric",
    placeholder: "Exemple : 2 pour deux mois de trésorerie disponible.",
    unit: "mois",
    calculateScore: (value) => {
      if (value >= 3) return 2;
      if (value >= 1) return 1;
      return 0;
    },
    helpText: "Le matelas de sécurité recommandé pour une PME est de 3 mois de charges d'exploitation ou de chiffre d'affaires."
  },
  {
    id: "q3.2",
    pillarId: 2,
    text: "Comment élaborez-vous vos prévisions de trésorerie ?",
    type: "choice",
    options: [
      { label: "Pas de prévisions, nous pilotons à vue en regardant le solde bancaire", score: 0 },
      { label: "Plan de trésorerie réalisé sur un tableur Excel mis à jour irrégulièrement", score: 1 },
      { label: "Prévisions glissantes à 3/6 mois alimentées automatiquement par un outil de flux (ex: Agicap)", score: 2 }
    ],
    helpText: "Un plan de trésorerie permet d'anticiper les impasses financières et de négocier les financements à l'avance."
  },
  {
    id: "q3.3",
    pillarId: 2,
    text: "Quel est le délai moyen de paiement effectif de vos clients (DSO) ?",
    type: "numeric",
    placeholder: "Exemple : 45 pour un délai moyen de paiement de 45 jours.",
    unit: "jours",
    calculateScore: (value) => {
      if (value <= 30) return 2;
      if (value <= 60) return 1;
      return 0;
    },
    helpText: "La loi LME fixe le délai de paiement maximum à 60 jours ou 45 jours fin de mois à compter de la facture."
  },

  // ==========================================
  // PILIER 4 : RESSOURCES HUMAINES (3 questions)
  // ==========================================
  {
    id: "q4.2",
    pillarId: 3,
    text: "Votre entreprise respecte-t-elle l'obligation de mutuelle collective (loi ANI) et de prévoyance ?",
    type: "choice",
    options: [
      { label: "Pas de mutuelle collective en place (situation de non-conformité ANI à régulariser)", score: 0 },
      { label: "Mutuelle en place mais sans prévoyance complémentaire obligatoire pour les cadres", score: 1 },
      { label: "Mutuelle d'entreprise ANI obligatoire active pour tous et prévoyance cadre / non-cadre conforme", score: 2 }
    ],
    helpText: "Depuis 2016, l'employeur doit proposer une mutuelle santé collective et financer au moins 50% de la cotisation."
  },
  {
    id: "q4.3",
    pillarId: 3,
    text: "Si vous avez 11 salariés ou plus, avez-vous organisé les élections du Comité Social et Économique (CSE) ?",
    type: "choice",
    options: [
      { label: "Plus de 11 salariés et aucune élection organisée (conformité CSE à sécuriser)", score: 0 },
      { label: "Moins de 11 salariés (non soumis) ou PV de carence en règle si aucune candidature", score: 2 },
      { label: "CSE en place, réunions et procès-verbaux rédigés conformément à la législation", score: 2 }
    ],
    helpText: "L'obligation de mettre en place le CSE se déclenche dès que l'effectif atteint 11 salariés pendant 12 mois consécutifs."
  },
  {
    id: "q4.4",
    pillarId: 3,
    text: "Votre entreprise est-elle à jour concernant le DUERP et le suivi médical ?",
    type: "choice",
    options: [
      { label: "Non, aucun document rédigé (obligation de sécurité employeur à couvrir d'urgence)", score: 0 },
      { label: "DUERP existant mais obsolète, ou retards significatifs pour les visites médicales VIP", score: 1 },
      { label: "DUERP à jour communiqué aux salariés et visites médicales obligatoires à jour", score: 2 }
    ],
    helpText: "Le DUERP est obligatoire dans toutes les entreprises dès le premier salarié et doit lister les risques physiques/mentaux."
  },

  // ==========================================
  // PILIER 5 : PAIE & OBLIGATIONS SOCIALES (3 questions)
  // ==========================================
  {
    id: "q6.1",
    pillarId: 4,
    text: "Comment est organisée la production de vos bulletins de paie ?",
    type: "choice",
    options: [
      { label: "Bulletins saisis en interne sur un tableur (Excel) ou outil non spécialisé (fort risque d'erreur)", score: 0 },
      { label: "Logiciel de paie en interne géré par un collaborateur non expert (veille conventionnelle fragile)", score: 1 },
      { label: "Bulletins de paie entièrement externalisés et supervisés par un prestataire expert (cabinet d'expertise comptable ou spécialiste de la paie)", score: 2 }
    ],
    helpText: "L'externalisation de la paie permet de transférer la responsabilité de la conformité réglementaire."
  },
  {
    id: "q6.2",
    pillarId: 4,
    text: "Comment valisez-vous la conformité de vos DSN et l'analyse de vos coûts salariaux ?",
    type: "choice",
    options: [
      { label: "Retards fréquents ou erreurs de dépôt entraînant des relances ou des pénalités URSSAF", score: 0 },
      { label: "DSN déposées dans les délais sans contrôle de cohérence, suivi simple de la masse salariale nette", score: 1 },
      { label: "DSN déposées systématiquement à temps avec contrôles de cohérence et suivi du coût chargé complet", score: 2 }
    ],
    helpText: "Les erreurs ou retards de DSN s'accompagnent de pénalités automatiques de l'URSSAF et des caisses de retraite."
  },
  {
    id: "q6.4",
    pillarId: 4,
    text: "Quand a eu lieu votre dernier contrôle URSSAF ou audit de conformité sociale ?",
    type: "choice",
    options: [
      { label: "Contrôle URSSAF récent ayant donné lieu à un redressement ou jamais audité (risque de conformité latent)", score: 0 },
      { label: "Aucun contrôle récent, mais nous réalisons des vérifications internes basiques sur nos taux", score: 1 },
      { label: "Dernier contrôle sans redressement significatif ou audit de conformité sociale réalisé il y a moins de 2 ans", score: 2 }
    ],
    helpText: "Un audit de conformité sociale préventif permet de déceler les anomalies de cotisations avant le passage de l'URSSAF."
  },

  // ==========================================
  // PILIER 6 : FACTURATION ÉLECTRONIQUE (3 questions)
  // ==========================================
  {
    id: "q5.1",
    pillarId: 5,
    text: "Sous quel format émettez-vous vos factures clients de ventes ?",
    type: "choice",
    options: [
      { label: "Saisie libre sur Word, Excel ou sur papier libre", score: 0 },
      { label: "Logiciel de facturation classique générant des fichiers PDF simples", score: 1 },
      { label: "Logiciel certifié générant le format réglementaire mixte Factur-X (PDF + XML structuré) ou structuré", score: 2 }
    ],
    helpText: "La réforme de la facturation électronique va proscrire les simples PDF pour imposer des formats contenant des données structurées."
  },
  {
    id: "q5.2",
    pillarId: 5,
    text: "Où en êtes-vous de votre choix de plateforme pour la réforme de la facturation électronique ?",
    type: "choice",
    options: [
      { label: "Aucune action menée, nous ne savons pas comment nous préparer à la réforme", score: 0 },
      { label: "Nous connaissons la réforme, mais le choix entre le PPF et une PDP partenaire n'est pas encore fait", score: 1 },
      { label: "Notre plateforme de transmission (PPF / PDP) est validée et nos équipes se forment aux flux", score: 2 }
    ],
    helpText: "Le Portail Public de Facturation (PPF) et les Plateformes de Dématérialisation Partenaires (PDP) seront les intermédiaires obligatoires."
  },
  {
    id: "q5.3",
    pillarId: 5,
    text: "Comment gérez-vous la réception, l'intégration comptable et l'archivage de vos factures fournisseurs ?",
    type: "choice",
    options: [
      { label: "Factures reçues par divers canaux (courrier, mails), saisie et classement comptable 100% manuels", score: 0 },
      { label: "Centralisation sur email unique d'achats, export manuel de fichiers pour la comptabilité", score: 1 },
      { label: "Outil de dématérialisation avec OCR/IA, synchro API avec compta et archivage GED valeur probante", score: 2 }
    ],
    helpText: "Dématérialiser les achats fait gagner 4 à 5 fois plus de temps administratif qu'une saisie comptable classique."
  }
];
