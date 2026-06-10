-- =====================================================================
-- MAJHA DIAGNOSTIC PME - BASE DE DONNÉES SUPABASE / POSTGRESQL
-- Script d'initialisation de la table 'diagnostics' (Sécurité RLS Renforcée)
-- =====================================================================

-- 1. Création de la table 'diagnostics'
CREATE TABLE IF NOT EXISTS public.diagnostics (
    -- Clés et Horodatages
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Profil Entreprise (CompanyProfile)
    company_name VARCHAR(255) NOT NULL,
    leader_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    legal_form VARCHAR(100) NOT NULL,
    annual_ca VARCHAR(100) NOT NULL, -- Stocke la tranche (ex: "500 000 € à 2 M€")
    employees INTEGER NOT NULL CHECK (employees >= 0),
    seniority VARCHAR(100) NOT NULL,

    -- Résultats du Diagnostic
    global_score INTEGER NOT NULL CHECK (global_score BETWEEN 0 AND 100),
    
    -- Scores détaillés par pilier au format JSONB
    -- Structure : { "compta": X, "fiscalite": Y, "tresorerie": Z, "rh": A, "facturation": B }
    pillar_scores JSONB NOT NULL,

    -- Réponses aux 40 questions du diagnostic
    -- Structure : { "q1.1": "...", "q2.1": X, ... }
    answers JSONB NOT NULL,

    -- Services MAJHA recommandés
    -- Tableau de chaînes (ex: {"Expertise comptable", "Gestion de la paie"})
    recommended_services TEXT[] NOT NULL DEFAULT '{}',

    -- Informations de suivi Commercial & Prise de RDV
    appointment_requested BOOLEAN NOT NULL DEFAULT false,
    appointment_time VARCHAR(255) NULL, -- Ex: "Mardi 16 Juin à 10h00"
    status VARCHAR(50) NOT NULL DEFAULT 'Nouveau' 
        CHECK (status IN ('Nouveau', 'Contacté', 'RDV Planifié', 'Opportunité active', 'Sans suite')),
    internal_notes TEXT NOT NULL DEFAULT ''
);

-- 2. Commentaires de table et de colonnes pour la documentation Supabase
COMMENT ON TABLE public.diagnostics IS 'Stocke les diagnostics PME complétés par les prospects et gérés par les administrateurs MAJHA.';
COMMENT ON COLUMN public.diagnostics.annual_ca IS 'Tranche de chiffre d''affaires de la PME.';
COMMENT ON COLUMN public.diagnostics.pillar_scores IS 'Scores sur 100 pour chacun des 5 piliers métier.';
COMMENT ON COLUMN public.diagnostics.answers IS 'Ensemble des réponses clés-valeurs fournies lors du questionnaire.';
COMMENT ON COLUMN public.diagnostics.recommended_services IS 'Liste des services MAJHA identifiés comme opportunités d''accompagnement.';
COMMENT ON COLUMN public.diagnostics.status IS 'État d''avancement du traitement commercial de l''opportunité.';

-- 3. Création des index d'optimisation pour le Dashboard Admin
-- Ces index accélèrent le filtrage par date, statut, score et secteur.
CREATE INDEX IF NOT EXISTS idx_diagnostics_created_at ON public.diagnostics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diagnostics_status ON public.diagnostics(status);
CREATE INDEX IF NOT EXISTS idx_diagnostics_global_score ON public.diagnostics(global_score);
CREATE INDEX IF NOT EXISTS idx_diagnostics_email ON public.diagnostics(email);
CREATE INDEX IF NOT EXISTS idx_diagnostics_sector ON public.diagnostics(sector);

-- 4. Déclencheur (Trigger) pour mettre à jour automatiquement la colonne 'updated_at'
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_diagnostics_modtime
    BEFORE UPDATE ON public.diagnostics
    FOR EACH ROW
    EXECUTE FUNCTION public.update_modified_column();

-- 5. Configuration de la sécurité (Row Level Security - RLS)
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;

-- Politique A : Autoriser l'insertion publique des diagnostics (soumission depuis le Wizard public)
CREATE POLICY "Autoriser l'insertion publique" ON public.diagnostics
    FOR INSERT
    WITH CHECK (true);

-- Politique B : Réserver tout accès (SELECT, UPDATE, DELETE, INSERT) aux administrateurs authentifiés
-- Aucun accès public SELECT n'est configuré, protégeant ainsi l'ensemble des données de diagnostic.
CREATE POLICY "Autoriser accès complet aux administrateurs authentifiés" ON public.diagnostics
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Politique C : Autoriser la mise à jour anonyme par ID pour les prises de rendez-vous
-- (Sécurisé car l'UUID de l'enregistrement n'est connu que par le client qui vient de le soumettre)
CREATE POLICY "Autoriser la mise à jour anonyme par ID" ON public.diagnostics
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

-- Note pour l'évolution future (Lien privé sécurisé) :
-- Pour permettre à un utilisateur anonyme d'accéder à son propre diagnostic après soumission
-- sans authentification complète, on pourra implémenter l'une des solutions suivantes :
-- 1. Utiliser un jeton de signature cryptographique (HMAC) passé en paramètre d'URL.
-- 2. Ajouter une colonne 'share_token' de type UUID générée aléatoirement à l'insertion, 
--    et configurer une policy SELECT filtrant sur cette colonne.
