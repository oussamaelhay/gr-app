import { useState } from 'react';
import { Printer, ArrowLeft, CheckCircle, Calendar, User, Shield } from 'lucide-react';
import type { User as UserType, DemandeConge } from '../types';
import { generateDemandeConge, generateBordereauConge } from '../utils/pdfGenerator';

interface Props { user: UserType; onBack: () => void; }

type AgentType = 'fonctionnaire' | 'autorite' | null;

export default function CongeForm({ user, onBack }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [agentType, setAgentType] = useState<AgentType>(null);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<DemandeConge>({
    annee: new Date().getFullYear().toString(),
    prenom: user.prenom,
    nom: user.nom,
    grade: user.grade || '',
    posteAffectation: user.posteAffectation || '',
    cin: user.cin || '',
    ppr: '',
    dateDepart: '',
    dateRetour: '',
    duree: '',
    residencePendantConge: '',
    telephone: user.telephone || '',
    observations: `Congé administratif au titre de l'année ${new Date().getFullYear()}`,
    dateSignature: new Date().toLocaleDateString('fr-MA'),
  });

  const [errors, setErrors] = useState<Partial<Record<keyof DemandeConge, string>>>({});

  const set = (k: keyof DemandeConge) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const calcDuree = (depart: string, retour: string) => {
    if (!depart || !retour) return '';
    const d1 = new Date(depart), d2 = new Date(retour);
    if (d2 < d1) return '';
    return (Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1).toString();
  };

  const handleDateChange = (k: 'dateDepart' | 'dateRetour', val: string) => {
    const updated = { ...form, [k]: val };
    updated.duree = calcDuree(
      k === 'dateDepart' ? val : form.dateDepart,
      k === 'dateRetour' ? val : form.dateRetour
    );
    setForm(updated);
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.dateDepart) e.dateDepart = 'Requis';
    if (!form.dateRetour) e.dateRetour = 'Requis';
    if (!form.residencePendantConge) e.residencePendantConge = 'Requis';
    if (agentType === 'fonctionnaire' && !form.ppr) e.ppr = 'PPR requis pour un fonctionnaire';
    if (form.dateDepart && form.dateRetour && form.dateRetour < form.dateDepart)
      e.dateRetour = 'La date de retour doit être après le départ';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    generateDemandeConge(form);
    generateBordereauConge(form);
    setSubmitted(true);
  };

  const inp = "w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent";
  const lbl = "block text-xs font-semibold text-stone-600 mb-1 uppercase tracking-wide";
  const err = "text-red-500 text-xs mt-1";

  // ── STEP 0 : Sélection type agent ──
  if (!agentType) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-stone-700 text-sm mb-6">
          <ArrowLeft size={16} /> Retour
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center shadow-md">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-stone-800">Demande de Congé</h2>
            <p className="text-xs text-stone-500">Étape 1 sur 2 — Sélectionnez votre type d'agent</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-xs font-bold">1</div>
          <div className="flex-1 h-1 bg-amber-200 rounded" />
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-stone-200 text-stone-400 text-xs font-bold">2</div>
        </div>

        <p className="text-sm font-semibold text-stone-600 mb-4 text-center">
          Quel est votre type d'agent ?
        </p>

        <div className="grid grid-cols-1 gap-4">

          {/* Fonctionnaire */}
          <button
            onClick={() => setAgentType('fonctionnaire')}
            className="group flex items-center gap-5 p-6 bg-white border-2 border-stone-200 hover:border-amber-500 rounded-2xl shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="w-14 h-14 flex-shrink-0 bg-amber-100 group-hover:bg-amber-500 rounded-xl flex items-center justify-center transition-colors">
              <User className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-bold text-stone-800 text-base mb-1">Fonctionnaire</p>
              <p className="text-sm text-stone-500">Dispose d'un numéro <span className="font-semibold text-amber-700">PPR</span> — Personnel de la Fonction Publique</p>
            </div>
            <div className="ml-auto">
              <div className="w-5 h-5 rounded-full border-2 border-stone-300 group-hover:border-amber-500 group-hover:bg-amber-500 transition-all flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
          </button>

          {/* Agent d'autorité */}
          <button
            onClick={() => setAgentType('autorite')}
            className="group flex items-center gap-5 p-6 bg-white border-2 border-stone-200 hover:border-blue-500 rounded-2xl shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="w-14 h-14 flex-shrink-0 bg-blue-100 group-hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors">
              <Shield className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-bold text-stone-800 text-base mb-1">Agent d'Autorité</p>
              <p className="text-sm text-stone-500">Sans numéro PPR — Caïd, Khalifa, Moqaddem, etc.</p>
            </div>
            <div className="ml-auto">
              <div className="w-5 h-5 rounded-full border-2 border-stone-300 group-hover:border-blue-500 group-hover:bg-blue-500 transition-all flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 1 : Succès ──
  if (submitted) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-200">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-display text-xl font-bold text-stone-800 mb-2">Documents générés !</h3>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4
            bg-amber-100 text-amber-700">
            {agentType === 'fonctionnaire' ? <User size={12} /> : <Shield size={12} />}
            {agentType === 'fonctionnaire' ? 'Fonctionnaire' : "Agent d'Autorité"}
          </div>
          <p className="text-sm text-stone-500 mb-6">
            Deux PDF téléchargés : <strong>Demande de Congé</strong> + <strong>Bordereau DRH</strong>
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => { generateDemandeConge(form); generateBordereauConge(form); }}
              className="flex items-center justify-center gap-2 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold transition-colors">
              <Printer size={15} /> Retélécharger les PDF
            </button>
            <button onClick={() => { setSubmitted(false); setAgentType(null); }}
              className="py-2.5 border border-stone-300 text-stone-600 hover:bg-stone-50 rounded-lg text-sm font-semibold">
              Nouvelle demande
            </button>
            <button onClick={onBack}
              className="py-2.5 text-stone-400 hover:text-stone-600 text-sm">
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 2 : Formulaire ──
  const isFonctionnaire = agentType === 'fonctionnaire';
  const accentColor = isFonctionnaire ? 'amber' : 'blue';

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => setAgentType(null)}
        className="flex items-center gap-2 text-stone-500 hover:text-stone-700 text-sm mb-6">
        <ArrowLeft size={16} /> Changer le type d'agent
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md
          ${isFonctionnaire ? 'bg-gradient-to-br from-amber-500 to-amber-700' : 'bg-gradient-to-br from-blue-600 to-blue-800'}`}>
          {isFonctionnaire ? <User className="w-5 h-5 text-white" /> : <Shield className="w-5 h-5 text-white" />}
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-stone-800">Demande de Congé</h2>
          <p className="text-xs text-stone-500">
            Étape 2 sur 2 —
            <span className={`font-semibold ml-1 ${isFonctionnaire ? 'text-amber-700' : 'text-blue-700'}`}>
              {isFonctionnaire ? 'Fonctionnaire (avec PPR)' : "Agent d'Autorité (sans PPR)"}
            </span>
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-6">
        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold
          ${isFonctionnaire ? 'bg-amber-600' : 'bg-blue-600'}`}>✓</div>
        <div className={`flex-1 h-1 rounded ${isFonctionnaire ? 'bg-amber-400' : 'bg-blue-400'}`} />
        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold
          ${isFonctionnaire ? 'bg-amber-600' : 'bg-blue-600'}`}>2</div>
      </div>

      {/* Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6
        ${isFonctionnaire ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
        {isFonctionnaire ? <User size={12} /> : <Shield size={12} />}
        {isFonctionnaire ? 'Fonctionnaire — PPR obligatoire' : "Agent d'Autorité — Sans PPR"}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 space-y-5">

        {/* Identité */}
        <section>
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Identité</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Prénom</label>
              <input className={inp + ' bg-stone-50 text-stone-500'} value={form.prenom} readOnly />
            </div>
            <div>
              <label className={lbl}>Nom</label>
              <input className={inp + ' bg-stone-50 text-stone-500'} value={form.nom} readOnly />
            </div>
            <div>
              <label className={lbl}>Grade</label>
              <input className={inp} value={form.grade} onChange={set('grade')} />
            </div>
            <div>
              <label className={lbl}>C.I.N</label>
              <input className={inp} value={form.cin} onChange={set('cin')} />
            </div>

            {/* PPR — seulement pour fonctionnaire */}
            {isFonctionnaire && (
              <div className="col-span-2">
                <label className={lbl}>
                  PPR <span className="text-amber-600">* (obligatoire)</span>
                </label>
                <input className={inp + ' border-amber-300 focus:ring-amber-500'}
                  placeholder="Ex: 1436135"
                  value={form.ppr} onChange={set('ppr')} />
                {errors.ppr && <p className={err}>{errors.ppr}</p>}
              </div>
            )}

            <div className="col-span-2">
              <label className={lbl}>Poste d'affectation</label>
              <input className={inp} value={form.posteAffectation} onChange={set('posteAffectation')} />
            </div>
          </div>
        </section>

        <hr className="border-stone-100" />

        {/* Congé */}
        <section>
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Détails du congé</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Année</label>
              <input className={inp} value={form.annee} onChange={set('annee')} />
            </div>
            <div>
              <label className={lbl}>Téléphone</label>
              <input className={inp} value={form.telephone} onChange={set('telephone')} />
            </div>
            <div>
              <label className={lbl}>Date de départ *</label>
              <input className={inp} type="date" min={today} value={form.dateDepart}
                onChange={e => handleDateChange('dateDepart', e.target.value)} />
              {errors.dateDepart && <p className={err}>{errors.dateDepart}</p>}
            </div>
            <div>
              <label className={lbl}>Date de retour *</label>
              <input className={inp} type="date" min={form.dateDepart || today} value={form.dateRetour}
                onChange={e => handleDateChange('dateRetour', e.target.value)} />
              {errors.dateRetour && <p className={err}>{errors.dateRetour}</p>}
            </div>
          </div>

          {form.duree && (
            <div className={`mt-3 p-3 rounded-lg text-sm font-semibold
              ${isFonctionnaire ? 'bg-amber-50 border border-amber-200 text-amber-800' : 'bg-blue-50 border border-blue-200 text-blue-800'}`}>
              Durée calculée : {form.duree} jour(s)
            </div>
          )}
        </section>

        <section>
          <label className={lbl}>Résidence pendant le congé *</label>
          <input className={inp} placeholder="Rue, Ville, Code postal..."
            value={form.residencePendantConge} onChange={set('residencePendantConge')} />
          {errors.residencePendantConge && <p className={err}>{errors.residencePendantConge}</p>}
        </section>

        <section>
          <label className={lbl}>Observations</label>
          <textarea className={inp + ' resize-none'} rows={2}
            value={form.observations} onChange={set('observations')} />
        </section>

        <section>
          <label className={lbl}>Date de signature</label>
          <input className={inp} value={form.dateSignature} onChange={set('dateSignature')} />
        </section>

        <button onClick={handleSubmit}
          className={`w-full flex items-center justify-center gap-2 py-3.5 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all
            ${isFonctionnaire
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800'
              : 'bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900'}`}>
          <Printer size={17} /> Générer les 2 PDF (Demande + Bordereau)
        </button>
      </div>
    </div>
  );
}