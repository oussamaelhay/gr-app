import { useState } from 'react';
import { Printer, ArrowLeft, CheckCircle, FileText } from 'lucide-react';
import type { User, DemandeAttestation } from '../types';
import { generateAttestationTravail, generateBordereauAttestation } from '../utils/pdfGenerator';

interface Props { user: User; onBack: () => void; }

export default function AttestationForm({ user, onBack }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<DemandeAttestation>({
    prenom: user.prenom,
    nom: user.nom,
    cin: user.cin,
    ppr: user.ppr,
    grade: user.grade,
    posteAffectation: user.posteAffectation,
    direction: user.direction || 'DSD/DSBD',
    dateEmbauche: '',
    motif: '',
    dateSignature: new Date().toLocaleDateString('fr-MA'),
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DemandeAttestation, string>>>({});

  const set = (k: keyof DemandeAttestation) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.dateEmbauche) e.dateEmbauche = "Date d'embauche requise";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    generateAttestationTravail(form);
    generateBordereauAttestation(form);
    setSubmitted(true);
  };

  const inputClass = "w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-xs font-semibold text-stone-600 mb-1 uppercase tracking-wide";

  if (submitted) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-200">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-display text-xl font-bold text-stone-800 mb-2">Documents générés !</h3>
          <p className="text-sm text-stone-500 mb-6">
            Deux PDF ont été téléchargés : l'<strong>Attestation de Travail</strong> et le <strong>Bordereau d'Envoi DRH</strong>.
          </p>
          <div className="flex gap-3 flex-col">
            <button onClick={() => { generateAttestationTravail(form); generateBordereauAttestation(form); }}
              className="flex items-center justify-center gap-2 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-semibold transition-colors">
              <Printer size={15} /> Retélécharger les PDF
            </button>
            <button onClick={onBack} className="py-2.5 border border-stone-300 text-stone-600 hover:bg-stone-50 rounded-lg text-sm font-semibold transition-colors">
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-stone-700 text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Retour
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-stone-800">Attestation de Travail</h2>
          <p className="text-xs text-stone-500">Génération de l'attestation officielle + bordereau DRH</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 space-y-5">
        {/* Pre-filled */}
        <section>
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Identité (pré-remplie)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Prénom</label>
              <input className={inputClass + ' bg-stone-50 text-stone-500'} value={form.prenom} readOnly />
            </div>
            <div>
              <label className={labelClass}>Nom</label>
              <input className={inputClass + ' bg-stone-50 text-stone-500'} value={form.nom} readOnly />
            </div>
            <div>
              <label className={labelClass}>C.I.N</label>
              <input className={inputClass + ' bg-stone-50 text-stone-500'} value={form.cin} readOnly />
            </div>
            <div>
              <label className={labelClass}>P.P.R</label>
              <input className={inputClass + ' bg-stone-50 text-stone-500'} value={form.ppr} readOnly />
            </div>
            <div>
              <label className={labelClass}>Grade</label>
              <input className={inputClass + ' bg-stone-50 text-stone-500'} value={form.grade} readOnly />
            </div>
            <div>
              <label className={labelClass}>Poste d'affectation</label>
              <input className={inputClass + ' bg-stone-50 text-stone-500'} value={form.posteAffectation} readOnly />
            </div>
          </div>
        </section>

        <hr className="border-stone-100" />

        <section>
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Détails de l'attestation</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Date d'embauche *</label>
              <input className={inputClass} type="date" value={form.dateEmbauche} onChange={set('dateEmbauche')} />
              {errors.dateEmbauche && <p className="text-red-500 text-xs mt-1">{errors.dateEmbauche}</p>}
            </div>
            <div>
              <label className={labelClass}>Direction</label>
              <input className={inputClass} value={form.direction} onChange={set('direction')} />
            </div>
          </div>
        </section>

        <section>
          <label className={labelClass}>Motif de la demande</label>
          <select className={inputClass} value={form.motif} onChange={set('motif')}>
            <option value="">-- Sélectionner un motif --</option>
            <option value="Banque">Banque / Crédit</option>
            <option value="Ambassade / Visa">Ambassade / Visa</option>
            <option value="Administration">Administration</option>
            <option value="Logement">Logement</option>
            <option value="Assurance">Assurance</option>
            <option value="Usage personnel">Usage personnel</option>
            <option value="Autre">Autre</option>
          </select>
        </section>

        <section>
          <label className={labelClass}>Date de signature</label>
          <input className={inputClass} value={form.dateSignature} onChange={set('dateSignature')} />
        </section>

        <button onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
          <Printer size={17} /> Générer les 2 PDF (Attestation + Bordereau)
        </button>
      </div>
    </div>
  );
}
