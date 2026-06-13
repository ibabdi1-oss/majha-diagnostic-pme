"use client";

import React, { useState } from "react";
import { 
  ArrowRight, 
  CheckCircle, 
  BarChart3, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  FileText, 
  ChevronDown, 
  Activity, 
  Briefcase,
  HelpCircle,
  Download,
  AlertTriangle
} from "lucide-react";
import { DiagnosticProvider, useDiagnostic } from "../context/DiagnosticContext";
import ProfileForm from "../components/ProfileForm";
import DiagnosticWizard from "../components/DiagnosticWizard";
import ResultsDashboard from "../components/ResultsDashboard";

export default function Home() {
  return (
    <DiagnosticProvider>
      <DiagnosticApp />
    </DiagnosticProvider>
  );
}

function DiagnosticApp() {
  const { step, setStep } = useDiagnostic();
  const [activePillar, setActivePillar] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (step === "profile") {
    return <ProfileForm />;
  }

  if (step === "wizard") {
    return <DiagnosticWizard />;
  }

  if (step === "results") {
    return <ResultsDashboard />;
  }

  // default: step === "landing"
  const pillars = [
    {
      id: 0,
      title: "Comptabilité",
      icon: <Briefcase className="w-5 h-5" />,
      desc: "Évaluez la qualité de tenue de vos comptes, la conformité de votre Fichier des Écritures Comptables (FEC) et la rapidité de vos clôtures.",
      points: [
        "Tenue et révision comptable par un expert-comptable inscrit à l'Ordre",
        "Modernité et sécurité des outils comptables cloud (ex: Pennylane, Dext)",
        "Respect des délais légaux pour la liasse fiscale annuelle",
        "Rapprochement bancaire automatisé et régularité des écritures"
      ],
      riskText: "Un Fichier des Écritures Comptables (FEC) non conforme ou manquant lors d'un contrôle peut entraîner le rejet complet de votre comptabilité par le fisc."
    },
    {
      id: 1,
      title: "Fiscalité",
      icon: <ShieldCheck className="w-5 h-5" />,
      desc: "Mesurez vos risques de redressement sur la TVA et l'IS, sécurisez vos déclarations et optimisez vos dispositifs fiscaux (CIR/CII).",
      points: [
        "Fiabilité des déclarations de TVA (formulaire CA3) et d'impôt sur les sociétés",
        "Mise en conformité de la Piste d'Audit Fiable (PAF) obligatoire",
        "Sécurisation via le dispositif de l'Examen de Conformité Fiscale (ECF)",
        "Maximisation des crédits d'impôt nationaux (CIR, CII, mécénat)"
      ],
      riskText: "Le contrôle de la TVA et l'absence de Piste d'Audit Fiable (PAF) rédigée représentent la première source de redressement fiscal pour les PME françaises."
    },
    {
      id: 2,
      title: "Trésorerie",
      icon: <TrendingUp className="w-5 h-5" />,
      desc: "Optimisez votre Besoin en Fonds de Roulement (BFR), analysez vos retards de paiement (loi LME) et structurez vos prévisions de trésorerie.",
      points: [
        "Visibilité consolidée de vos flux bancaires au quotidien",
        "Planification et prévisions glissantes de trésorerie à 3 et 6 mois",
        "Calcul et suivi des délais clients (DSO) et délais fournisseurs",
        "Respect des délais de paiement maximum imposés par la loi LME"
      ],
      riskText: "Les retards de paiement clients étouffent la trésorerie : un DSO élevé bloque en moyenne entre 5% et 10% de chiffre d'affaires sous forme de créances."
    },
    {
      id: 3,
      title: "Ressources Humaines",
      icon: <Users className="w-5 h-5" />,
      desc: "Garantissez la conformité de vos DSN, sécurisez vos contrats de travail, et respectez vos obligations légales d'employeur (CSE, DUERP).",
      points: [
        "Fiabilité de la paie et transmission de la Déclaration Sociale Nominative (DSN)",
        "Mise en place de la mutuelle d'entreprise collective obligatoire (Loi ANI)",
        "Rédaction et mise à jour annuelle obligatoire du DUERP",
        "Respect des obligations de seuils d'effectifs (mise en place du CSE dès 11 salariés)"
      ],
      riskText: "La non-conformité sur le DUERP ou le CSE expose l'entreprise à des risques de litiges prud'homaux et de régularisations sociales."
    },
    {
      id: 4,
      title: "Facturation Électronique",
      icon: <FileText className="w-5 h-5" />,
      desc: "Préparez vos processus internes à la réforme obligatoire 2026 de la facturation électronique (e-invoicing et e-reporting).",
      points: [
        "Adoption de formats mixtes structurés conformes (ex: Factur-X, UBL, CII)",
        "Choix de la plateforme de transmission (Portail Public de Facturation ou PDP)",
        "Contrôle automatisé des mentions obligatoires (SIREN client, catégorie de TVA)",
        "Gestion automatisée de la réception et de l'intégration des factures d'achats"
      ],
      riskText: "Dès 2026, toutes les entreprises françaises devront être en mesure de recevoir des factures électroniques structurées sous peine de non-conformité fiscale."
    }
  ];

  const faqs = [
    {
      q: "Le diagnostic est-il réellement gratuit ?",
      a: "Oui, le diagnostic en ligne et la restitution de vos scores globaux par pilier sont 100% gratuits. Nous proposons également l'envoi d'un rapport PDF complet et une consultation de restitution gratuite de 30 minutes avec un expert-comptable de notre cabinet, sans aucun engagement."
    },
    {
      q: "Mes données financières sont-elles sécurisées et confidentielles ?",
      a: "La confidentialité de vos données est garantie. En tant que cabinet d'expertise comptable inscrit à l'Ordre, nous sommes soumis à un secret professionnel strict. Vos données sont stockées de façon sécurisée et ne sont jamais vendues ou partagées."
    },
    {
      q: "Combien de temps faut-il pour le remplir ?",
      a: "Il faut compter environ 3 à 5 minutes. L'écran de profil prend 1 minute, et les questions des 6 piliers se remplissent très rapidement grâce à nos choix de réponses simplifiés."
    },
    {
      q: "De quels documents ai-je besoin pour répondre aux questions ?",
      a: "Aucun document complexe n'est requis. Pour les questions chiffrées (CA annuel, nombre de salariés, trésorerie disponible, jours de retard de TVA et délai client), des ordres de grandeur ou des estimations réalistes suffisent amplement pour calibrer le diagnostic."
    },
    {
      q: "Que se passe-t-il après avoir validé le diagnostic ?",
      a: "Vous découvrirez immédiatement vos scores sur votre écran de résultats. Vous pourrez ensuite saisir vos coordonnées professionnelles pour recevoir par email votre rapport PDF de 5 pages contenant les analyses détaillées et le plan d'action prioritaire rédigé par nos experts."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-500 selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <header className="border-b border-slate-200 bg-white/95 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-md">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">MAJHA</span>
              <span className="text-xs block text-teal-600 font-bold tracking-wide uppercase -mt-1">Cabinet d'Expertise</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#piliers" className="hover:text-teal-600 transition-colors">Piliers d'analyse</a>
            <a href="#pourquoi" className="hover:text-teal-600 transition-colors">Avantages</a>
            <a href="#exemple" className="hover:text-teal-600 transition-colors">Modèle de rapport</a>
            <a href="#faq" className="hover:text-teal-600 transition-colors">FAQ</a>
          </nav>
          <div>
            <button 
              onClick={() => setStep("profile")}
              className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-all duration-200 shadow-sm flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              Évaluer ma PME
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:py-28 bg-gradient-to-b from-white to-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Hero text content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex self-center lg:self-start items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-teal-700 tracking-wide">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              Cabinet d'Expertise Comptable Agrée OEC
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Sécurisez la croissance de votre PME avec un diagnostic à <span className="text-teal-600">360°</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Identifiez instantanément vos risques administratifs, fiscaux, de trésorerie et préparez la transition obligatoire vers la facturation électronique 2026.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm font-semibold pt-2">
              <button 
                onClick={() => setStep("profile")}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-base font-bold transition-all duration-200 shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer group"
              >
                Lancer mon diagnostic gratuit
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Trust checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-slate-500 text-xs font-semibold border-t border-slate-200">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                3 à 5 minutes chrono
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                Rapport PDF personnalisé
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                Conforme normes DGFIP & URSSAF
              </div>
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            {/* Minimalist White dashboard mockup */}
            <div className="w-full max-w-[420px] rounded-2xl bg-white border border-slate-200 p-6 shadow-lg relative overflow-hidden">
              {/* Header mockup */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-teal-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">Tableau de bord</span>
                </div>
                <span className="text-[10px] text-teal-700 font-bold px-2.5 py-0.5 bg-teal-50 border border-teal-100 rounded-full">Score Moyen : 74%</span>
              </div>

              {/* Score circular gauge mockup */}
              <div className="py-6 flex flex-col items-center justify-center">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                    <circle cx="50" cy="50" r="42" stroke="#0d9488" strokeWidth="8" strokeDasharray="264" strokeDashoffset="68" strokeLinecap="round" fill="transparent" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-slate-850">74%</span>
                    <span className="text-[9px] text-teal-600 uppercase font-bold tracking-wider">Risque Faible</span>
                  </div>
                </div>
              </div>

              {/* Mini pillar score bars mockup */}
              <div className="flex flex-col gap-3">
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 pb-1">
                    <span>Trésorerie (BFR / DSO)</span>
                    <span className="text-teal-600">85%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600 rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 pb-1">
                    <span>Fiscalité (TVA / IS)</span>
                    <span className="text-amber-500">50%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "50%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 pb-1">
                    <span>Facturation Électronique 2026</span>
                    <span className="text-rose-500">25%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: "25%" }} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Subtle shadow glow decoration */}
            <div className="absolute -inset-1 rounded-2xl bg-teal-500/5 opacity-30 blur-lg -z-20 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Présentation du Diagnostic : Comment ça marche */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-3">
            <span className="text-xs font-bold tracking-tight text-teal-600 uppercase">Méthodologie</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Comment fonctionne le diagnostic ?</h2>
            <p className="text-slate-500 font-light text-base">Un parcours fluide et méthodique conçu par nos experts-comptables pour maximiser votre temps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">Profil Entreprise</h3>
              <p className="text-sm text-slate-655 text-slate-500 font-light leading-relaxed">
                Renseignez en 1 minute la fiche d'identité de votre PME (chiffre d'affaires, secteur, forme juridique, salariés) afin de calibrer nos ratios et seuils légaux.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">Évaluation des 5 Piliers</h3>
              <p className="text-sm text-slate-500 font-light leading-relaxed">
                Répondez à nos 3 questions clés par section. Notre format hybride combine questions à choix simple et données chiffrées stratégiques (retards de TVA, trésorerie disponible, DSO).
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">Restitution & Actions</h3>
              <p className="text-sm text-slate-500 font-light leading-relaxed">
                Visualisez vos scores instantanément sur l'écran. Téléchargez votre rapport d'analyse complet en PDF de 5 pages et planifiez un débriefing stratégique offert de 30 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Les 5 Piliers d'Analyse */}
      <section id="piliers" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-3">
          <span className="text-xs font-bold tracking-tight text-teal-600 uppercase">Périmètre d'audit</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Les 5 piliers clés passés au crible</h2>
          <p className="text-slate-500 font-light text-base">Nous analysons chaque facette critique de votre structure administrative, fiscale et financière.</p>
        </div>

        {/* Pillar selector tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {pillars.map((pillar) => (
            <button
              key={pillar.id}
              onClick={() => setActivePillar(pillar.id)}
              className={`px-5 py-3 rounded-xl flex items-center gap-2.5 text-sm font-semibold transition-all cursor-pointer border ${
                activePillar === pillar.id
                  ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-350 hover:bg-slate-50"
              }`}
            >
              <span className={activePillar === pillar.id ? "text-white" : "text-teal-600"}>{pillar.icon}</span>
              {pillar.title}
            </button>
          ))}
        </div>

        {/* Pillar Details Card */}
        <div className="rounded-2xl bg-white border border-slate-200 p-8 md:p-10 shadow-sm relative transition-all duration-300 min-h-[350px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-5">
              <div className="inline-flex self-start p-3 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700">
                {pillars[activePillar].icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{pillars[activePillar].title}</h3>
              <p className="text-slate-600 font-light leading-relaxed text-sm md:text-base">{pillars[activePillar].desc}</p>
              
              {/* Alert for risk factor */}
              <div className="mt-2 p-4 rounded-xl bg-amber-50 border border-amber-200/60 flex gap-3 text-amber-800">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
                <p className="text-xs font-medium leading-relaxed">
                  <span className="font-bold">Facteur de risque :</span> {pillars[activePillar].riskText}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 bg-slate-50 border border-slate-200/80 p-6 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Points de contrôle évalués :</span>
              <ul className="flex flex-col gap-3">
                {pillars[activePillar].points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle className="w-4.5 h-4.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi réaliser ce diagnostic */}
      <section id="pourquoi" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-3">
            <span className="text-xs font-bold tracking-tight text-teal-600 uppercase">Bénéfices dirigeants</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pourquoi réaliser cette auto-évaluation ?</h2>
            <p className="text-slate-500 font-light text-base">Évitez les pièges de gestion courants et convertissez vos optimisations en gains de trésorerie réels.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-sm transition-all flex gap-5">
              <div className="p-3 rounded-xl bg-teal-100/60 border border-teal-200 text-teal-700 h-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-slate-900">Sécurité fiscale & Examen ECF</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-light">
                  Sachez si vous êtes pleinement en règle sur votre FEC et vos déclarations de TVA. Découvrez comment l'Examen de Conformité Fiscale (ECF) peut vous prémunir d'un contrôle de la DGFIP.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-sm transition-all flex gap-5">
              <div className="p-3 rounded-xl bg-teal-100/60 border border-teal-200 text-teal-700 h-fit">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-slate-900">Libération de trésorerie & Loi LME</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-light">
                  Mesurez l'impact de vos retards de paiement. Une réduction de quelques jours de votre délai moyen de paiement (DSO) peut libérer instantanément des dizaines de milliers d'euros de liquidités.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-sm transition-all flex gap-5">
              <div className="p-3 rounded-xl bg-teal-100/60 border border-teal-200 text-teal-700 h-fit">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-slate-900">Conformité DSN & Obligations Sociales</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-light">
                  Évitez les risques de redressement URSSAF en auditant la qualité de vos DSN. Validez le respect de vos obligations légales (Mutuelle ANI obligatoire, DUERP à jour et CSE).
                </p>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-sm transition-all flex gap-5">
              <div className="p-3 rounded-xl bg-teal-100/60 border border-teal-200 text-teal-700 h-fit">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-slate-900">Anticipation Facture Électronique 2026</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-light">
                  Évaluez si votre organisation est prête pour la réforme obligatoire de 2026. Découvrez les impacts du choix entre le PPF et une PDP et préparez le format de données Factur-X.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exemple de Restitution (Visual Preview of Dashboard/PDF) */}
      <section id="exemple" className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <span className="text-xs font-bold tracking-tight text-teal-600 uppercase">Rapport personnalisé</span>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Un livrable de synthèse complet de 5 pages</h3>
            <p className="text-slate-600 font-light leading-relaxed text-sm md:text-base">
              Dès la fin de votre diagnostic, vous recevez par email un rapport PDF structuré contenant des indicateurs précis sur vos vulnérabilités et des conseils opérationnels directement exploitables.
            </p>
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-slate-700">Analyse de risques par pilier comptable, fiscal et RH.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-slate-700">Plan d'action prioritaire hiérarchisé à court, moyen et long terme.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-slate-700">Indicateurs de comparaison (benchmarks) par rapport aux PME de votre secteur.</span>
              </div>
            </div>
            <div className="pt-2">
              <button 
                onClick={() => setStep("profile")}
                className="px-6 py-3.5 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-50 text-teal-700 text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4 text-teal-600" />
                Télécharger un modèle de rapport (PDF)
              </button>
            </div>
          </div>

          {/* Graphical Mockup of Page 1 PDF */}
          <div className="lg:col-span-7 flex justify-center w-full">
            <div className="w-full max-w-[500px] rounded-2xl bg-white border border-slate-200 shadow-lg p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden">
              {/* PDF Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-extrabold text-sm text-slate-900 tracking-wide">MAJHA</span>
                </div>
                <span className="text-xs text-slate-400 font-bold font-mono">RAPPORT #DX-FR2026</span>
              </div>

              {/* PDF Content Mockup */}
              <div className="flex flex-col gap-5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-600 tracking-widest block mb-1">Synthèse de diagnostic</span>
                  <h4 className="text-lg font-bold text-slate-900">Rapport d'autodiagnostic : SAS Martin & Co</h4>
                  <span className="text-xs text-slate-550 text-slate-500 block mt-0.5 font-light">Secteur : Technologies • 24 salariés • CA : 2 400 000 € HT</span>
                </div>

                {/* Score panel inside PDF */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 p-4.5 rounded-xl items-center">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-500 font-semibold uppercase">Score de Maturité</span>
                    <span className="text-3xl font-black text-slate-900">56%</span>
                    <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Risque Modéré</span>
                  </div>
                  <div className="text-xs text-slate-500 font-light leading-relaxed">
                    L'entreprise présente une gestion comptable saine mais accuse des vulnérabilités fiscales et RH majeures dues à des retards de TVA (15 jours en moyenne) et à l'absence de DUERP.
                  </div>
                </div>

                {/* Recommendations timeline mockup */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold text-slate-700">Actions prioritaires recommandées :</span>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex gap-3 items-start p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-xs leading-relaxed text-slate-700">
                      <span className="px-2 py-0.5 bg-rose-600 text-white font-extrabold rounded-full text-[9px] uppercase tracking-wider mt-0.5">Urgent</span>
                      <p>
                        <span className="font-semibold text-slate-900">Ressources Humaines :</span> Rédiger et diffuser le Document Unique d'Évaluation des Risques (DUERP).
                      </p>
                    </div>
                    <div className="flex gap-3 items-start p-2.5 rounded-lg bg-amber-55 bg-amber-50 border border-amber-200 text-xs leading-relaxed text-slate-700">
                      <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-extrabold rounded-full text-[9px] uppercase tracking-wider mt-0.5">Moyen</span>
                      <p>
                        <span className="font-semibold text-slate-900">Trésorerie :</span> Renégocier les délais de paiement clients (DSO moyen actuel à 45 jours).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages & Statistiques */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          {/* Key numbers grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 text-center">
            <div className="flex flex-col gap-1">
              <span className="text-4xl lg:text-5xl font-extrabold text-teal-600">+1 200</span>
              <span className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">PME diagnostiquées</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-4xl lg:text-5xl font-extrabold text-teal-600">45 min</span>
              <span className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">De temps RH gagné/jour</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-4xl lg:text-5xl font-extrabold text-teal-600">94%</span>
              <span className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">De plans d'actions appliqués</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-4xl lg:text-5xl font-extrabold text-teal-600">-30%</span>
              <span className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">De risques de pénalités</span>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-6 justify-between hover:shadow-sm transition-all">
              <p className="text-slate-655 text-slate-600 font-light leading-relaxed italic text-sm md:text-base">
                "Ce diagnostic a mis en lumière un décalage de trésorerie critique lié à nos conditions de paiement clients. En appliquant les recommandations sur le DSO et la relance automatique, nous avons libéré 45 000 € de trésorerie en moins de 3 mois."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center font-bold text-teal-700 text-sm">
                  MD
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Marc Depierre</span>
                  <span className="text-xs text-slate-500">Directeur Général, DPD Distribution (Lyon)</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-6 justify-between hover:shadow-sm transition-all">
              <p className="text-slate-600 font-light leading-relaxed italic text-sm md:text-base">
                "Nous utilisions Excel pour la paie de nos 32 salariés. Le diagnostic nous a alertés sur l'absence de mutuelle ANI obligatoire et les risques liés à la DSN. Le pôle social de MAJHA a sécurisé tous nos processus."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center font-bold text-teal-700 text-sm">
                  SM
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Sophie Martin</span>
                  <span className="text-xs text-slate-500">Directrice Générale, Innov'Tech (Paris)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 flex flex-col gap-3">
          <span className="text-xs font-bold tracking-tight text-teal-600 uppercase">Questions fréquentes</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Des réponses claires à vos questions</h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-6 text-left flex justify-between items-center gap-4 text-sm md:text-base font-semibold text-slate-900 transition-colors hover:text-teal-600 cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-teal-600 shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                    openFaq === index ? "rotate-180 text-teal-600" : ""
                  }`} 
                />
              </button>
              <div 
                className={`transition-all duration-200 ease-in-out overflow-hidden ${
                  openFaq === index ? "max-h-[200px] border-t border-slate-100" : "max-h-0"
                }`}
              >
                <div className="p-6 text-sm text-slate-655 text-slate-600 leading-relaxed font-light bg-slate-50/50">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-6">
        <div className="rounded-3xl bg-teal-900 p-8 md:p-16 text-center relative overflow-hidden flex flex-col gap-6 items-center shadow-lg">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
            Prêt à sécuriser et optimiser la gestion de votre PME ?
          </h2>
          <p className="text-teal-100 text-sm md:text-base max-w-2xl font-light leading-relaxed">
            Prenez 3 à 5 minutes aujourd'hui pour faire le point sur votre gestion financière, sociale et fiscale, et obtenez des solutions concrètes gratuites.
          </p>
          <div className="pt-2">
            <button 
              onClick={() => setStep("profile")}
              className="px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-teal-900 text-base font-bold transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer active:scale-95 group"
            >
              Évaluer ma PME gratuitement
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-teal-900" />
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-bold text-teal-200 pt-2">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-white" />
              100% Confidentiel
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-white" />
              Rapport PDF Instantané
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-white" />
              Expert-Comptable Agrée OEC
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center">
              <Activity className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-slate-900">MAJHA Diagnostic PME</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold">
            <span className="hover:text-teal-600 transition-colors cursor-pointer">Conditions d'utilisation</span>
            <span className="hover:text-teal-600 transition-colors cursor-pointer">Politique de confidentialité</span>
            <span className="hover:text-teal-600 transition-colors cursor-pointer">Contact</span>
          </div>
          <div className="text-xs font-light text-slate-400">
            © {new Date().getFullYear()} MAJHA. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
