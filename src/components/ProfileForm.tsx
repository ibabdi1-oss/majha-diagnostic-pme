"use client";

import React, { useState } from "react";
import { useDiagnostic, CompanyProfile } from "../context/DiagnosticContext";
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  FileCheck, 
  Coins, 
  Users, 
  Calendar, 
  ShieldCheck, 
  ArrowRight,
  ChevronLeft
} from "lucide-react";

export default function ProfileForm() {
  const { saveProfile, setStep } = useDiagnostic();

  const [formData, setFormData] = useState({
    companyName: "",
    leaderName: "",
    email: "",
    phone: "",
    sector: "",
    legalForm: "",
    annualCA: "",
    employees: "",
    seniority: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const sectors = [
    "Commerce & Vente",
    "Services aux entreprises",
    "Services aux particuliers",
    "Industrie & Production",
    "Bâtiment & Travaux Publics (BTP)",
    "Santé & Social",
    "Technologies & Digital",
    "Hôtellerie & Restauration",
    "Agriculture & Viticulture",
    "Autre"
  ];

  const legalForms = [
    "SAS (Société par Actions Simplifiée)",
    "SASU (SAS Unipersonnelle)",
    "SARL (Société à Responsabilité Limitée)",
    "EURL (SARL Unipersonnelle)",
    "SCI (Société Civile Immobilière)",
    "EI (Entreprise Individuelle / Profession Libérale)",
    "Autre"
  ];

  const caRanges = [
    "< 100 000 €",
    "100 000 € à 500 000 €",
    "500 000 € à 2 M€",
    "2 M€ à 10 M€",
    "> 10 M€"
  ];

  const seniorityOptions = [
    "Moins d'un an (Création récente)",
    "1 à 3 ans",
    "3 à 5 ans",
    "Plus de 5 ans"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.companyName.trim()) newErrors.companyName = "Le nom de l'entreprise est obligatoire";
    if (!formData.leaderName.trim()) newErrors.leaderName = "Le nom du dirigeant est obligatoire";
    
    if (!formData.email.trim()) {
      newErrors.email = "L'adresse email professionnelle est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est obligatoire";
    } else if (!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Format de numéro français invalide (ex: 06 12 34 56 78)";
    }

    if (!formData.sector) newErrors.sector = "Veuillez choisir un secteur d'activité";
    if (!formData.legalForm) newErrors.legalForm = "Veuillez choisir la forme juridique";
    if (!formData.annualCA) newErrors.annualCA = "Veuillez estimer le chiffre d'affaires";
    
    if (formData.employees === "") {
      newErrors.employees = "Le nombre de salariés est obligatoire";
    } else {
      const num = Number(formData.employees);
      if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
        newErrors.employees = "Veuillez saisir un nombre entier positif ou nul";
      }
    }

    if (!formData.seniority) newErrors.seniority = "Veuillez sélectionner l'ancienneté";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const profileData: CompanyProfile = {
        ...formData,
        employees: Number(formData.employees)
      };
      saveProfile(profileData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between py-8 px-6">
      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
        <button 
          onClick={() => setStep("landing")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Retour à l'accueil
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-sm tracking-wide text-slate-950">MAJHA</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full flex-grow flex flex-col justify-center">
        {/* Stepper progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest pb-2">
            <span>Étape 1 sur 6 : Profil Entreprise</span>
            <span className="text-teal-600">16% complété</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 rounded-full transition-all duration-300" style={{ width: "16.66%" }} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center md:text-left mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Configurez votre diagnostic</h1>
          <p className="text-slate-500 text-sm md:text-base font-light mt-2">
            Ces informations permettent d'adapter les questions de conformité sociale (CSE, DUERP) et de calculer les ratios financiers (matelas de trésorerie disponible) spécifiques à votre PME.
          </p>
        </div>

        {/* Crisp White Card Form */}
        <form 
          data-testid="profile-form"
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom de l'entreprise */}
            <div className="flex flex-col gap-2">
              <label htmlFor="companyName" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-teal-600" />
                Nom de l'entreprise
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Ex: SARL Martin & Co"
                className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all ${
                  errors.companyName ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "border-slate-300"
                }`}
              />
              {errors.companyName && <span className="text-xs text-rose-500 font-semibold">{errors.companyName}</span>}
            </div>

            {/* Nom du dirigeant */}
            <div className="flex flex-col gap-2">
              <label htmlFor="leaderName" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-teal-600" />
                Nom & Prénom du dirigeant
              </label>
              <input
                type="text"
                id="leaderName"
                name="leaderName"
                value={formData.leaderName}
                onChange={handleChange}
                placeholder="Ex: Sophie Martin"
                className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all ${
                  errors.leaderName ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "border-slate-300"
                }`}
              />
              {errors.leaderName && <span className="text-xs text-rose-500 font-semibold">{errors.leaderName}</span>}
            </div>

            {/* Email professionnel */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                Adresse email professionnelle
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex: contact@entreprise.fr"
                className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all ${
                  errors.email ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "border-slate-300"
                }`}
              />
              {errors.email && <span className="text-xs text-rose-500 font-semibold">{errors.email}</span>}
            </div>

            {/* Téléphone */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                Téléphone professionnel
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ex: 06 12 34 56 78"
                className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all ${
                  errors.phone ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "border-slate-300"
                }`}
              />
              {errors.phone && <span className="text-xs text-rose-500 font-semibold">{errors.phone}</span>}
            </div>

            {/* Secteur d'activité */}
            <div className="flex flex-col gap-2">
              <label htmlFor="sector" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                Secteur d'activité
              </label>
              <select
                id="sector"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all ${
                  errors.sector ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "border-slate-300"
                }`}
              >
                <option value="" disabled className="text-slate-400">Sélectionnez votre secteur</option>
                {sectors.map((sec, idx) => (
                  <option key={idx} value={sec} className="text-slate-900">{sec}</option>
                ))}
              </select>
              {errors.sector && <span className="text-xs text-rose-500 font-semibold">{errors.sector}</span>}
            </div>

            {/* Forme juridique */}
            <div className="flex flex-col gap-2">
              <label htmlFor="legalForm" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                Forme juridique
              </label>
              <select
                id="legalForm"
                name="legalForm"
                value={formData.legalForm}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all ${
                  errors.legalForm ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "border-slate-300"
                }`}
              >
                <option value="" disabled className="text-slate-400">Sélectionnez la forme</option>
                {legalForms.map((lf, idx) => (
                  <option key={idx} value={lf} className="text-slate-900">{lf}</option>
                ))}
              </select>
              {errors.legalForm && <span className="text-xs text-rose-500 font-semibold">{errors.legalForm}</span>}
            </div>

            {/* Chiffre d'affaires annuel HT */}
            <div className="flex flex-col gap-2">
              <label htmlFor="annualCA" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <Coins className="w-3.5 h-3.5 text-teal-600" />
                Chiffre d'affaires annuel HT
              </label>
              <select
                id="annualCA"
                name="annualCA"
                value={formData.annualCA}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all ${
                  errors.annualCA ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "border-slate-300"
                }`}
              >
                <option value="" disabled className="text-slate-400">Sélectionnez une tranche</option>
                {caRanges.map((ca, idx) => (
                  <option key={idx} value={ca} className="text-slate-900">{ca}</option>
                ))}
              </select>
              {errors.annualCA && <span className="text-xs text-rose-500 font-semibold">{errors.annualCA}</span>}
            </div>

            {/* Nombre de salariés */}
            <div className="flex flex-col gap-2">
              <label htmlFor="employees" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                Nombre de salariés
              </label>
              <input
                type="number"
                id="employees"
                name="employees"
                value={formData.employees}
                onChange={handleChange}
                placeholder="Ex: 15"
                min="0"
                className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all ${
                  errors.employees ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "border-slate-300"
                }`}
              />
              {errors.employees && <span className="text-xs text-rose-500 font-semibold">{errors.employees}</span>}
            </div>

            {/* Ancienneté de l'entreprise */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="seniority" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                Ancienneté de l'entreprise
              </label>
              <select
                id="seniority"
                name="seniority"
                value={formData.seniority}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all ${
                  errors.seniority ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "border-slate-300"
                }`}
              >
                <option value="" disabled className="text-slate-400">Sélectionnez l'ancienneté</option>
                {seniorityOptions.map((so, idx) => (
                  <option key={idx} value={so} className="text-slate-900">{so}</option>
                ))}
              </select>
              {errors.seniority && <span className="text-xs text-rose-500 font-semibold">{errors.seniority}</span>}
            </div>
          </div>

          {/* Privacy Box */}
          <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 flex gap-3 text-teal-800 text-xs">
            <ShieldCheck className="w-5 h-5 shrink-0 text-teal-600 mt-0.5" />
            <p className="leading-relaxed font-light">
              <span className="font-bold text-slate-900">Confidentialité garantie :</span> Vos informations professionnelles sont protégées par le secret professionnel le plus strict applicable aux cabinets d'expertise comptable. Vos données ne seront jamais cédées ou partagées avec des tiers.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-base font-bold transition-all duration-200 shadow-sm flex items-center justify-center gap-2 active:scale-95 cursor-pointer group"
            >
              Commencer mon diagnostic
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center pt-8 border-t border-slate-200 text-slate-400 text-xs mt-12">
        © {new Date().getFullYear()} MAJHA. Tous droits réservés.
      </footer>
    </div>
  );
}
