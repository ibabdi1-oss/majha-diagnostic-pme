export interface Option {
  label: string;
  score: number;
}

export interface Question {
  id: string; // e.g., 'q1.1'
  pillarId: number; // 0: Compta, 1: Fiscalité, 2: Trésorerie, 3: RH, 4: Facturation
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
  // PILIER 1 : COMPTABILITÉ (8 questions)
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
      { label: "Tableur (Excel / Google Sheets) ou sur papier", score: 0 },
      { label: "Logiciel de comptabilité classique installé localement (monoposte, sans synchronisation bancaire)", score: 1 },
      { label: "Outil cloud moderne et collaboratif (ex: Pennylane, Dext) avec flux de données automatisés", score: 2 }
    ],
    helpText: "L'automatisation réduit les risques de saisie manuelle et de perte de pièces."
  },
  {
    id: "q1.3",
    pillarId: 0,
    text: "Sous quel délai obtenez-vous votre liasse fiscale annuelle après la date de clôture ?",
    type: "choice",
    options: [
      { label: "Retards fréquents ou supérieurs au délai réglementaire de 3 à 4 mois", score: 0 },
      { label: "Liasse déposée à temps, mais sans aucune situation comptable ou bilan intermédiaire en cours d'année", score: 1 },
      { label: "Liasse obtenue rapidement, complétée par des bilans/situations mensuelles ou trimestrielles", score: 2 }
    ],
    helpText: "Attendre la liasse fiscale pour connaître sa rentabilité empêche le pilotage stratégique de l'entreprise."
  },
  {
    id: "q1.4",
    pillarId: 0,
    text: "À quelle fréquence effectuez-vous le rapprochement bancaire de vos comptes ?",
    type: "choice",
    options: [
      { label: "Uniquement lors de la clôture annuelle des comptes", score: 0 },
      { label: "Une fois par mois à la réception du relevé de compte", score: 1 },
      { label: "Chaque semaine ou chaque jour via une synchronisation automatique des flux", score: 2 }
    ],
    helpText: "Un rapprochement régulier permet de détecter rapidement les fraudes, impayés et erreurs bancaires."
  },
  {
    id: "q1.5",
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
  {
    id: "q1.6",
    pillarId: 0,
    text: "Comment archivez-vous vos justificatifs de dépenses et factures d'achat ?",
    type: "choice",
    options: [
      { label: "Classeurs physiques ou emails éparpillés (fort risque de perte ou décoloration des tickets)", score: 0 },
      { label: "Numérisation simple sur un espace de stockage partagé (Google Drive, Dropbox) sans valeur probante", score: 1 },
      { label: "Numérisation systématique et archivage électronique à valeur probante (GED conforme DGFIP)", score: 2 }
    ],
    helpText: "L'archivage à valeur probante vous permet de détruire légalement les reçus papier sans risque de redressement de TVA."
  },
  {
    id: "q1.7",
    pillarId: 0,
    text: "Disposez-vous d'une comptabilité analytique pour suivre votre rentabilité ?",
    type: "choice",
    options: [
      { label: "Non, nous suivons uniquement la marge globale en fin d'exercice", score: 0 },
      { label: "Oui, mais de façon très simple (répartition par type de dépense ou grands départements)", score: 1 },
      { label: "Oui, notre comptabilité permet de suivre la marge par projet, par produit ou par client", score: 2 }
    ],
    helpText: "La comptabilité analytique permet de stopper les activités déficitaires et d'orienter les ventes vers les plus rentables."
  },
  {
    id: "q1.8",
    pillarId: 0,
    text: "Quelles sont vos procédures de contrôle interne et de validation des paiements ?",
    type: "choice",
    options: [
      { label: "Aucune procédure formalisée, le dirigeant valide tout au fil de l'eau", score: 0 },
      { label: "Validation des grosses dépenses partagée informellement, inventaire annuel basique", score: 1 },
      { label: "Procédures claires de séparation des tâches, validation systématique et inventaires tournants", score: 2 }
    ],
    helpText: "Un bon contrôle interne prévient le risque de fraude interne ou de détournement de fonds."
  },

  // ==========================================
  // PILIER 2 : FISCALITÉ (8 questions)
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
    text: "Comment gérez-vous le calcul et le provisionnement de l'Impôt sur les Sociétés (IS) ?",
    type: "choice",
    options: [
      { label: "Montant découvert lors de la clôture annuelle, sans aucun provisionnement préalable", score: 0 },
      { label: "Acomptes calculés sur le barème historique et payés à temps, sans lien avec le résultat réel de l'année", score: 1 },
      { label: "Suivi mensuel de l'IS réel, optimisation du taux réduit à 15% (jusqu'à 42 500 €) et provision de trésorerie", score: 2 }
    ],
    helpText: "L'IS se paye par 4 acomptes trimestriels obligatoires dès que l'impôt de l'exercice précédent dépasse 3 000 €."
  },
  {
    id: "q2.3",
    pillarId: 1,
    text: "Comment gérez-vous vos taxes locales (CFE, taxes sur les véhicules) et autres impôts annexes ?",
    type: "choice",
    options: [
      { label: "Oublis fréquents de déclaration initiale ou retards de paiement réguliers", score: 0 },
      { label: "Paiement réactif à la réception des avis sur impots.gouv.fr sans planification budgétaire", score: 1 },
      { label: "Suivi rigoureux sur un calendrier fiscal annuel et paiement dématérialisé anticipé", score: 2 }
    ],
    helpText: "La CFE (Cotisation Foncière des Entreprises) doit être payée par voie dématérialisée au plus tard le 15 décembre."
  },
  {
    id: "q2.4",
    pillarId: 1,
    text: "Avez-vous déjà fait réaliser un Examen de Conformité Fiscale (ECF) pour votre entreprise ?",
    type: "choice",
    options: [
      { label: "Non, nous ne connaissons pas ce dispositif officiel", score: 0 },
      { label: "Oui, nous y avons pensé mais n'avons jamais formalisé la demande avec notre conseil", score: 1 },
      { label: "Oui, un ECF est validé chaque année par notre expert-comptable pour sécuriser notre liasse", score: 2 }
    ],
    helpText: "L'ECF est un audit de conformité sur 10 points fiscaux clés qui limite fortement la probabilité d'un contrôle fiscal."
  },
  {
    id: "q2.5",
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
    id: "q2.6",
    pillarId: 1,
    text: "Comment effectuez-vous votre veille réglementaire face aux modifications de la Loi de Finances ?",
    type: "choice",
    options: [
      { label: "Aucune veille, nous découvrons les règles lors du bilan comptable", score: 0 },
      { label: "Veille passive via la réception de newsletters générales ou de mails de notre comptable", score: 1 },
      { label: "Veille active et réunion annuelle d'ajustement fiscal pour optimiser nos choix de gestion", score: 2 }
    ],
    helpText: "La Loi de Finances modifie chaque année des seuils, des taux de crédit d'impôt et des exonérations de charges."
  },
  {
    id: "q2.7",
    pillarId: 1,
    text: "Comment gérez-vous la TVA sur vos achats intracommunautaires ou importations (autoliquidation) ?",
    type: "choice",
    options: [
      { label: "Mauvaise application des règles, oublis d'autoliquidation ou erreurs fréquentes de taux", score: 0 },
      { label: "Gestion manuelle avec risque d'erreur au moment du dépôt de la déclaration mensuelle", score: 1 },
      { label: "Paramétrage automatique de l'autoliquidation dans notre outil comptable et contrôle de conformité", score: 2 }
    ],
    helpText: "Depuis 2022, l'autoliquidation de la TVA à l'importation est obligatoire et automatique sur la déclaration de TVA."
  },
  {
    id: "q2.8",
    pillarId: 1,
    text: "Bénéficiez-vous des aides fiscales à l'innovation et à l'investissement (CIR, CII, mécénat) ?",
    type: "choice",
    options: [
      { label: "Aucun recours par méconnaissance des dispositifs ou complexité perçue", score: 0 },
      { label: "Utilisation ponctuelle mais sans dossier scientifique/technique justificatif robuste (risque)", score: 1 },
      { label: "Maximisation sécurisée de nos crédits d'impôt (CIR/CII) avec obtention de rescrits fiscaux de protection", score: 2 }
    ],
    helpText: "Le CII (Crédit d'Impôt Innovation) permet de déduire 30% des dépenses d'innovation des PME."
  },

  // ==========================================
  // PILIER 3 : TRÉSORERIE (8 questions)
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
    text: "Quelle est votre politique de suivi et d'optimisation de votre Besoin en Fonds de Roulement (BFR) ?",
    type: "choice",
    options: [
      { label: "Aucun suivi du BFR, découverts bancaires réguliers non anticipés", score: 0 },
      { label: "BFR calculé uniquement une fois par an par l'expert-comptable lors du bilan", score: 1 },
      { label: "Suivi mensuel précis des composantes du BFR (délai de rotation des stocks, délais clients et fournisseurs)", score: 2 }
    ],
    helpText: "Le BFR représente l'argent immobilisé par les décalages de paiements et les stocks. L'optimiser libère du cash."
  },
  {
    id: "q3.4",
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
  {
    id: "q3.5",
    pillarId: 2,
    text: "Quel est votre processus de relance clients et de recouvrement des factures en retard ?",
    type: "choice",
    options: [
      { label: "Pas de processus formalisé, relance informelle uniquement en cas de tension de trésorerie", score: 0 },
      { label: "Relances régulières mais manuelles par email ou téléphone, sans scénario préétabli", score: 1 },
      { label: "Relance structurée et automatisée par scénarios gradués, et recours si besoin à une assurance-crédit", score: 2 }
    ],
    helpText: "Automatiser la relance permet de réduire de 15% à 30% les retards de paiement sans altérer la relation commerciale."
  },
  {
    id: "q3.6",
    pillarId: 2,
    text: "Comment gérez-vous vos relations et conditions de tarification bancaires ?",
    type: "choice",
    options: [
      { label: "Conditions et frais bancaires subis sans vérification (frais de tenue de compte, agios élevés)", score: 0 },
      { label: "Renégociation ponctuelle uniquement lors d'une demande d'emprunt de moyen terme", score: 1 },
      { label: "Multi-bancarisation avec revue annuelle des conditions financières et contrôle des commissions", score: 2 }
    ],
    helpText: "Les commissions de mouvement et les frais d'opérations à l'étranger font partie des coûts bancaires négociables."
  },
  {
    id: "q3.7",
    pillarId: 2,
    text: "De quels outils de financement de court terme disposez-vous ?",
    type: "choice",
    options: [
      { label: "Uniquement des découverts ou facilités de caisse subis et très onéreux", score: 0 },
      { label: "Recours ponctuel à l'affacturage ou à la cession de créances Dailly", score: 1 },
      { label: "Lignes de financement court terme négociées à l'avance (affacturage forfaitaire, lignes de crédit)", score: 2 }
    ],
    helpText: "Négocier des lignes de trésorerie en amont coûte moins cher que de subir des taux de découverts non autorisés."
  },
  {
    id: "q3.8",
    pillarId: 2,
    text: "Comment gérez-vous le placement de vos excédents de trésorerie ?",
    type: "choice",
    options: [
      { label: "Les excédents restent sur notre compte courant sans aucune rémunération", score: 0 },
      { label: "Excédents placés sur des livrets bancaires réglementés à faible rendement", score: 1 },
      { label: "Stratégie de placement diversifiée et sécurisée (Comptes à Terme, OPCVM monétaires)", score: 2 }
    ],
    helpText: "Dans un contexte de taux d'intérêt positifs, rémunérer ses excédents de trésorerie à court terme génère des produits financiers significatifs."
  },

  // ==========================================
  // PILIER 4 : RESSOURCES HUMAINES (8 questions)
  // ==========================================
  {
    id: "q4.1",
    pillarId: 3,
    text: "Comment gérez-vous la conformité de vos contrats de travail avec votre Convention Collective Nationale (CCN) ?",
    type: "choice",
    options: [
      { label: "Absence de contrat écrit pour certains salariés ou non-respect de la CCN (risque de litige social à anticiper)", score: 0 },
      { label: "Modèles de contrats standards récupérés en ligne, sans mise à jour régulière face aux évolutions de la CCN", score: 1 },
      { label: "Contrats rédigés par un juriste ou expert-comptable avec clauses spécifiques adaptées à la CCN", score: 2 }
    ],
    helpText: "Les clauses de non-concurrence, de forfait jours ou de période d'essai doivent respecter strictement la CCN."
  },
  {
    id: "q4.2",
    pillarId: 3,
    text: "Comment assurez-vous la production de la paie et le dépôt de vos Déclarations Sociales Nominatives (DSN) ?",
    type: "choice",
    options: [
      { label: "Production sur Excel ou saisie manuelle de la DSN avec des retards réguliers", score: 0 },
      { label: "Logiciel de paie interne géré par un collaborateur non spécialisé en droit du travail", score: 1 },
      { label: "Production confiée à un pôle social d'expert-comptable ou via un outil de paie SaaS de référence", score: 2 }
    ],
    helpText: "La DSN transmet mensuellement les données sociales de vos salariés à l'URSSAF et aux caisses de retraite."
  },
  {
    id: "q4.3",
    pillarId: 3,
    text: "Votre entreprise respecte-t-elle l'obligation de mutuelle collective (loi ANI) et de prévoyance ?",
    type: "choice",
    options: [
      { label: "Pas de mutuelle collective en place (situation de non-conformité ANI à régulariser)", score: 0 },
      { label: "Mutuelle en place mais sans prévoyance complémentaire pour les cadres (obligation de 1,5% patronal)", score: 1 },
      { label: "Mutuelle d'entreprise ANI obligatoire active pour tous et prévoyance cadre / non-cadre conforme", score: 2 }
    ],
    helpText: "Depuis 2016, l'employeur doit proposer une mutuelle santé collective et financer au moins 50% de la cotisation."
  },
  {
    id: "q4.4",
    pillarId: 3,
    text: "Comment suivez-vous le temps de travail, les heures supplémentaires, les congés et les RTT ?",
    type: "choice",
    options: [
      { label: "Suivi informel oral ou sur papier, sans décompte précis (risque de litige sur les heures supplémentaires)", score: 0 },
      { label: "Saisie centralisée manuellement sur un tableau Excel par la direction ou un secrétaire", score: 1 },
      { label: "Portail RH en ligne (SaaS) où les salariés saisissent leurs temps et posent leurs congés avec validation", score: 2 }
    ],
    helpText: "En cas de litige prud'homal sur les heures supplémentaires, la charge de la preuve du contrôle du temps incombe à l'employeur."
  },
  {
    id: "q4.5",
    pillarId: 3,
    text: "Si vous avez 11 salariés ou plus, avez-vous organisé les élections du Comité Social et Économique (CSE) ?",
    type: "choice",
    options: [
      { label: "Plus de 11 salariés et aucune élection organisée (conformité CSE à sécuriser)", score: 0 },
      { label: "Moins de 11 salariés (non soumis) ou PV de carence en règle si aucune candidature ne s'est présentée", score: 2 },
      { label: "CSE en place, réunions et procès-verbaux rédigés conformément à la législation", score: 2 }
    ],
    helpText: "L'obligation de mettre en place le CSE se déclenche dès que l'effectif atteint 11 salariés pendant 12 mois consécutifs."
  },
  {
    id: "q4.6",
    pillarId: 3,
    text: "Comment gérez-vous le plan de développement des compétences et le financement par votre OPCO ?",
    type: "choice",
    options: [
      { label: "Aucun plan de formation, nous ne sollicitons jamais notre OPCO pour financer des formations", score: 0 },
      { label: "Formations financées sur le budget interne de l'entreprise sans monter de dossier de subvention", score: 1 },
      { label: "Plan de formation annuel établi et optimisé grâce aux subventions de notre OPCO (Atlas, Akto, etc.)", score: 2 }
    ],
    helpText: "Toutes les PME cotisent à la formation professionnelle continue et disposent d'un budget annuel mobilisable auprès de leur OPCO."
  },
  {
    id: "q4.7",
    pillarId: 3,
    text: "Votre entreprise dispose-t-elle d'un Document Unique d'Évaluation des Risques Professionnels (DUERP) ?",
    type: "choice",
    options: [
      { label: "Non, aucun document rédigé (obligation de sécurité employeur à couvrir d'urgence)", score: 0 },
      { label: "DUERP existant mais obsolète (non mis à jour depuis plus d'un an ou sans plan d'action)", score: 1 },
      { label: "DUERP rédigé, mis à jour annuellement et communiqué à l'ensemble de nos salariés", score: 2 }
    ],
    helpText: "Le DUERP est obligatoire dans toutes les entreprises dès le premier salarié et doit lister les risques physiques/mentaux."
  },
  {
    id: "q4.8",
    pillarId: 3,
    text: "Comment organisez-vous l'affiliation et les visites médicales d'embauche ou de prévention (VIP) ?",
    type: "choice",
    options: [
      { label: "Aucune affiliation au service de santé ou visites de recrutement systématiquement oubliées", score: 0 },
      { label: "Affiliation active mais retards importants dans la planification des visites médicales obligatoires", score: 1 },
      { label: "Suivi rigoureux avec visites médicales d'embauche et visites périodiques réalisées à jour", score: 2 }
    ],
    helpText: "La visite d'information et de prévention (VIP) doit être réalisée dans un délai maximum de 3 mois après la prise de poste."
  },

  // ==========================================
  // PILIER 5 : PAIE & OBLIGATIONS SOCIALES (8 questions)
  // ==========================================
  {
    id: "q6.1",
    pillarId: 4,
    text: "Comment sont produits vos bulletins de paie ?",
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
    text: "Vos Déclarations Sociales Nominatives (DSN) mensuelles sont-elles déposées dans les délais réglementaires ?",
    type: "choice",
    options: [
      { label: "Retards fréquents ou erreurs de dépôt entraînant des relances ou des pénalités URSSAF", score: 0 },
      { label: "DSN déposées dans les délais, mais sans contrôle de cohérence ou d'anomalies de taux", score: 1 },
      { label: "DSN déposées systématiquement à temps avec contrôle de cohérence intégré avant transmission", score: 2 }
    ],
    helpText: "Les erreurs ou retards de DSN s'accompagnent de pénalités automatiques de l'URSSAF et des caisses de retraite."
  },
  {
    id: "q6.3",
    pillarId: 4,
    text: "Comment assurez-vous la veille juridique sur votre Convention Collective Nationale (CCN) ?",
    type: "choice",
    options: [
      { label: "Aucune veille formalisée, nous appliquons des règles historiques sans mise à jour des grilles de salaire", score: 0 },
      { label: "Veille ponctuelle ou informelle, sans abonnement d'alertes aux changements conventionnels", score: 1 },
      { label: "Veille active et automatique avec application immédiate des avenants (salaires minimums, primes, congés exceptionnels)", score: 2 }
    ],
    helpText: "L'absence d'application des grilles de salaires minimaux de sa CCN est une source fréquente de contentieux de la part des salariés."
  },
  {
    id: "q6.4",
    pillarId: 4,
    text: "Comment gérez-vous le suivi des congés payés, RTT et absences de vos salariés ?",
    type: "choice",
    options: [
      { label: "Suivi informel sur des calendriers papier ou par emails (risque d'erreurs ou de contestation)", score: 0 },
      { label: "Tableau de suivi Excel partagé avec saisie manuelle et mise à jour régulière", score: 1 },
      { label: "Portail RH en ligne (SaaS) avec workflow de validation et mise à jour automatique des soldes de congés", score: 2 }
    ],
    helpText: "Un outil de suivi transparent évite les litiges lors des départs et facilite la planification opérationnelle."
  },
  {
    id: "q6.5",
    pillarId: 4,
    text: "Quelle est votre procédure pour comptabiliser et contrôler les heures supplémentaires ?",
    type: "choice",
    options: [
      { label: "Déclaration informelle sans contrôle des limites légales (risque de litige prud'homal)", score: 0 },
      { label: "Suivi déclaratif mensuel validé par les managers mais sans outil de suivi précis des temps", score: 1 },
      { label: "Système de décompte rigoureux (badgeuse ou feuille de temps signée) avec suivi des repos compensateurs", score: 2 }
    ],
    helpText: "L'employeur doit être capable de prouver la réalité des heures effectuées. Le formalisme écrit est impératif."
  },
  {
    id: "q6.6",
    pillarId: 4,
    text: "Quand a eu lieu votre dernier contrôle URSSAF ou audit de conformité sociale ?",
    type: "choice",
    options: [
      { label: "Contrôle URSSAF récent ayant donné lieu à un redressement ou jamais audité (risque de conformité latent)", score: 0 },
      { label: "Aucun contrôle récent, mais nous réalisons des vérifications internes basiques sur nos taux de cotisations", score: 1 },
      { label: "Dernier contrôle sans redressement significatif ou audit de conformité sociale réalisé il y a moins de 2 ans", score: 2 }
    ],
    helpText: "Un audit de conformité sociale préventif permet de déceler les anomalies de cotisations avant le passage de l'URSSAF."
  },
  {
    id: "q6.7",
    pillarId: 4,
    text: "Comment sont centralisés et mis à jour vos contrats de travail et avenants ?",
    type: "choice",
    options: [
      { label: "Contrats éparpillés, modèles obsolètes ou avenants non signés lors des changements de poste/salaire", score: 0 },
      { label: "Dossiers numérisés simples (Drive/Dropbox) avec modèles de contrats révisés occasionnellement", score: 1 },
      { label: "Dossier RH centralisé et sécurisé (GED) avec des contrats et avenants systématiquement rédigés par un expert", score: 2 }
    ],
    helpText: "Des contrats mal rédigés ou non signés exposent l'entreprise à un risque de requalification juridique."
  },
  {
    id: "q6.8",
    pillarId: 4,
    text: "Effectuez-vous un suivi mensuel de votre coût salarial global (charges patronales, taxes sur les salaires) ?",
    type: "choice",
    options: [
      { label: "Non, nous découvrons le coût total lors de la clôture annuelle ou du débit des charges", score: 0 },
      { label: "Oui, par un simple suivi de la masse salariale nette sans analyse détaillée des cotisations et taxes", score: 1 },
      { label: "Oui, via un tableau de bord mensuel évaluant le coût chargé complet pour piloter notre rentabilité", score: 2 }
    ],
    helpText: "Le suivi précis du coût salarial permet d'ajuster les taux de facturation et de mesurer la productivité."
  },
  
  // ==========================================
  // PILIER 6 : FACTURATION ÉLECTRONIQUE (8 questions)
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
    text: "Comment garantissez-vous la présence des mentions légales obligatoires sur vos factures ?",
    type: "choice",
    options: [
      { label: "Saisie manuelle avec des risques réguliers d'erreurs ou d'oubli de mentions fiscales", score: 0 },
      { label: "Vérification manuelle ponctuelle lors de la création d'un client dans le système", score: 1 },
      { label: "Notre logiciel bloque l'émission d'une facture s'il manque le SIREN, l'adresse ou la catégorie de TVA", score: 2 }
    ],
    helpText: "L'adresse de livraison, le SIREN client et le type d'opération (livraison de biens vs service) deviennent des mentions de facturation obligatoires."
  },
  {
    id: "q5.4",
    pillarId: 5,
    text: "Comment collectez-vous et validez-vous vos factures fournisseurs d'achats ?",
    type: "choice",
    options: [
      { label: "Factures reçues par divers canaux (courrier, mails), saisie et classement comptable 100% manuels", score: 0 },
      { label: "Centralisation sur une adresse email d'achats unique ou un dossier de partage simple", score: 1 },
      { label: "Outil de dématérialisation avec lecture automatique OCR/IA et workflow de validation numérique", score: 2 }
    ],
    helpText: "Dématérialiser les achats fait gagner 4 à 5 fois plus de temps administratif qu'une saisie comptable classique."
  },
  {
    id: "q5.5",
    pillarId: 5,
    text: "Comment gérez-vous les règles d'exigibilité de la TVA sur vos prestations de services (débits vs encaissements) ?",
    type: "choice",
    options: [
      { label: "Nous appliquons la même règle pour tout, entraînant des décalages et des erreurs déclaratives", score: 0 },
      { label: "Calcul et ajustements faits manuellement par le comptable en fin de mois", score: 1 },
      { label: "Identification automatique du régime fiscal selon l'article de facture et mention de l'option sur débits", score: 2 }
    ],
    helpText: "La TVA sur les services est exigible aux encaissements, sauf en cas d'option pour la TVA sur les débits mentionnée sur la facture."
  },
  {
    id: "q5.6",
    pillarId: 5,
    text: "Comment suivez-vous les encaissements pour le e-reporting obligatoire des paiements ?",
    type: "choice",
    options: [
      { label: "Pas de suivi automatisé ni de rapprochement en temps réel des règlements", score: 0 },
      { label: "Rapprochement des paiements fait manuellement sur un fichier de pointage Excel séparé", score: 1 },
      { label: "Logiciel de facturation connecté aux flux bancaires avec pointage automatique et e-reporting prêt", score: 2 }
    ],
    helpText: "Le e-reporting de paiement exigera de déclarer régulièrement à l'administration fiscale la date et le montant des règlements reçus."
  },
  {
    id: "q5.7",
    pillarId: 5,
    text: "Comment vos outils de facturation et de comptabilité communiquent-ils ?",
    type: "choice",
    options: [
      { label: "Aucun lien, nos factures d'achats et de ventes sont ressaisies manuellement par le comptable", score: 0 },
      { label: "Nous exportons manuellement un fichier mensuel des ventes/achats (CSV/TXT) pour l'intégrer en compta", score: 1 },
      { label: "Synchronisation automatique en temps réel via une API directe de notre facturation avec la comptabilité", score: 2 }
    ],
    helpText: "L'intégration directe par API élimine les erreurs d'intégration et accélère la production des situations mensuelles."
  },
  {
    id: "q5.8",
    pillarId: 5,
    text: "Quelle est votre méthode d'archivage légal pour vos factures d'achats et de ventes ?",
    type: "choice",
    options: [
      { label: "Archivage papier ou sur un ordinateur local (risque de crash disque ou d'incendie)", score: 0 },
      { label: "Fichiers sauvegardés sur des disques externes ou des cloud personnels (Google Drive)", score: 1 },
      { label: "Archivage électronique à valeur probante conforme à la norme NF Z42-013 pendant 10 ans", score: 2 }
    ],
    helpText: "L'article L. 123-22 du Code de commerce impose la conservation des pièces comptables et factures pendant 10 ans."
  }
];
