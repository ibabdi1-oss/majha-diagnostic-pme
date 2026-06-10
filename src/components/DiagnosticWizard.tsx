"use client";

import React, { useState, useEffect } from "react";
import { useDiagnostic } from "../context/DiagnosticContext";
import { questions, PILLARS } from "../data/questions";
import { 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle,
  AlertCircle,
  Activity,
  Check,
  Sparkles
} from "lucide-react";

export default function DiagnosticWizard() {
  const { 
    profile, 
    answers, 
    saveAnswer, 
    calculateAndFinish, 
    resetDiagnostic 
  } = useDiagnostic();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [numericValue, setNumericValue] = useState("");
  const [numericError, setNumericError] = useState("");

  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;
  
  // Get active answer if it was already filled before
  const activeAnswer = answers[currentQuestion.id];

  // Sync numeric inputs with previously saved values
  useEffect(() => {
    if (currentQuestion.type === "numeric") {
      setNumericValue(activeAnswer !== undefined ? String(activeAnswer) : "");
      setNumericError("");
    }
  }, [currentIdx, currentQuestion.type, activeAnswer]);

  const handleOptionSelect = (optionLabel: string) => {
    saveAnswer(currentQuestion.id, optionLabel);
    
    // Auto-advance to next question with a small delay for visual feedback
    setTimeout(() => {
      if (currentIdx < totalQuestions - 1) {
        setCurrentIdx((prev) => prev + 1);
      } else {
        calculateAndFinish();
      }
    }, 300);
  };

  const handleNumericSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentQuestion.type !== "numeric") return;

    if (numericValue.trim() === "") {
      setNumericError("Veuillez saisir une valeur numérique.");
      return;
    }

    const valueNum = Number(numericValue.replace(",", "."));
    if (isNaN(valueNum) || valueNum < 0) {
      setNumericError("Veuillez saisir un nombre valide supérieur ou égal à 0.");
      return;
    }

    saveAnswer(currentQuestion.id, valueNum);
    setNumericError("");

    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      calculateAndFinish();
    }
  };

  const handleNext = () => {
    if (currentQuestion.type === "numeric") {
      // Simulate submission of numeric input
      const submitBtn = document.getElementById("numeric-submit-btn");
      if (submitBtn) submitBtn.click();
      return;
    }

    if (activeAnswer === undefined) {
      // Prompt user to select an option
      return;
    }

    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      calculateAndFinish();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  // Calculate stats for current pillar
  const currentPillar = PILLARS.find((p) => p.id === currentQuestion.pillarId)!;
  const questionsInPillar = questions.filter((q) => q.pillarId === currentQuestion.pillarId);
  const idxInPillar = questionsInPillar.findIndex((q) => q.id === currentQuestion.id);
  const totalInPillar = questionsInPillar.length;

  // Global Progress Percentage
  const progressPercent = Math.round((currentIdx / totalQuestions) * 100);

  return (
    <div data-testid="diagnostic-wizard" className="min-h-screen bg-slate-50 text-slate-855 text-slate-850 flex flex-col justify-between py-8 px-6">
      
      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
        <button 
          onClick={resetDiagnostic}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Abandonner
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-sm tracking-wide text-slate-950">MAJHA</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full flex-grow flex flex-col justify-center">
        
        {/* Stepper Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest pb-2">
            <span>Question {currentIdx + 1} sur {totalQuestions}</span>
            <span className="text-teal-600">{progressPercent}% complété</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal-600 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>

        {/* Pillar Header Card */}
        <div className="mb-6 p-4 rounded-xl bg-white border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Périmètre d'analyse en cours :</span>
            <span className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-teal-50 border border-teal-200/80 text-teal-700 rounded-md text-xs font-bold">
                Périmètre {currentQuestion.pillarId + 1} / {PILLARS.length}
              </span>
              {currentPillar.name}
            </span>
          </div>
          <div className="text-xs text-slate-500 font-light leading-relaxed max-w-sm italic">
            "{currentPillar.desc}"
          </div>
        </div>

        {/* Question Panel */}
        <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm min-h-[380px] flex flex-col justify-between gap-8">
          
          {/* Question Text & Description */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Question {idxInPillar + 1} sur {totalInPillar} dans ce pilier
              </span>
              {currentQuestion.type === "numeric" && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 px-2 py-0.5 bg-teal-50 border border-teal-200/80 rounded-full">
                  Donnée chiffrée
                </span>
              )}
            </div>
            
            <h2 data-testid="question-text" className="text-xl md:text-2xl font-extrabold text-slate-900 leading-snug">
              {currentQuestion.text}
            </h2>

            {currentQuestion.helpText && (
              <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 text-xs text-teal-850 leading-relaxed font-light flex gap-2.5">
                <HelpCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span>{currentQuestion.helpText}</span>
              </div>
            )}
          </div>

          {/* Interactive Inputs */}
          <div className="flex-grow flex flex-col justify-center">
            {currentQuestion.type === "choice" && currentQuestion.options ? (
              
              /* Choice options rendered as vertical cards */
              <div className="flex flex-col gap-3.5">
                {currentQuestion.options.map((opt, index) => {
                  const isSelected = activeAnswer === opt.label;
                  return (
                    <button
                      key={index}
                      data-testid={`option-btn-${index}`}
                      onClick={() => handleOptionSelect(opt.label)}
                      className={`w-full p-4.5 rounded-xl border text-left text-sm transition-all flex justify-between items-center gap-4 cursor-pointer group ${
                        isSelected
                          ? "bg-teal-50 border-teal-600 text-teal-900 shadow-sm font-semibold"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <span className="leading-relaxed">{opt.label}</span>
                      <div className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center transition-colors ${
                        isSelected 
                          ? "bg-teal-600 border-teal-600 text-white" 
                          : "border-slate-300 group-hover:border-slate-400 bg-white"
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

            ) : (
              
              /* Numeric Input form */
              <form data-testid="numeric-form" onSubmit={handleNumericSubmit} className="flex flex-col gap-4 max-w-md mx-auto w-full">
                <div className="flex flex-col gap-2">
                  <label htmlFor="numeric-input" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Saisissez la valeur :
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      id="numeric-input"
                      data-testid="numeric-input"
                      value={numericValue}
                      onChange={(e) => {
                        setNumericValue(e.target.value);
                        setNumericError("");
                      }}
                      placeholder={currentQuestion.placeholder || "Entrez un nombre..."}
                      className={`w-full pl-4 pr-16 py-3 rounded-xl bg-white border text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all ${
                        numericError ? "border-rose-500 focus:border-rose-500" : "border-slate-300"
                      }`}
                      autoFocus
                    />
                    {currentQuestion.unit && (
                      <span className="absolute right-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {currentQuestion.unit}
                      </span>
                    )}
                  </div>
                  {numericError && (
                    <span className="text-xs text-rose-500 font-semibold flex items-center gap-1.5 mt-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {numericError}
                    </span>
                  )}
                </div>

                {/* Hidden submit button triggered by Next */}
                <button type="submit" id="numeric-submit-btn" className="hidden" />
              </form>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center border-t border-slate-100 pt-6">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </button>

            {/* Hint text if choice question and not yet selected */}
            {currentQuestion.type === "choice" && activeAnswer === undefined && (
              <span className="text-xs text-slate-400 font-light italic hidden sm:inline">
                Sélectionnez une option pour passer à l'étape suivante
              </span>
            )}

            <button
              onClick={handleNext}
              disabled={currentQuestion.type === "choice" && activeAnswer === undefined}
              className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-100 text-white disabled:text-slate-450 disabled:text-slate-400 text-sm font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:scale-100 shadow-sm"
            >
              {currentIdx === totalQuestions - 1 ? (
                <>
                  Terminer
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                </>
              ) : (
                <>
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>

        {/* Bottom context indicators */}
        <div className="mt-4 flex justify-between text-[10px] font-mono text-slate-400">
          <span>Client : {profile?.companyName} • {profile?.employees} salarié(s)</span>
          <span>Données enregistrées en temps réel</span>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center pt-8 border-t border-slate-200 text-slate-400 text-xs mt-12">
        © {new Date().getFullYear()} MAJHA. Tous droits réservés.
      </footer>
    </div>
  );
}
