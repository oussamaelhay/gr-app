import { FileText, Calendar, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import type { User, AppPage } from '../types';

interface DashboardProps {
  user: User;
  onNavigate: (page: AppPage) => void;
}

export default function Dashboard({ user, onNavigate }: DashboardProps) {
  const cards = [
    {
      id: 'conge' as AppPage,
      icon: Calendar,
      title: 'Demande de Congé',
      desc: 'Soumettre une demande de congé administratif ou annuel.',
      color: 'from-amber-500 to-amber-700',
      lightColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
    },
    {
      id: 'attestation' as AppPage,
      icon: FileText,
      title: 'Attestation de Travail',
      desc: 'Demander une attestation de travail officielle.',
      color: 'from-blue-600 to-blue-800',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-stone-800 to-stone-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <p className="text-stone-300 text-sm mb-1">Bienvenue,</p>
        <h2 className="font-display text-2xl font-bold">{user.prenom} {user.nom}</h2>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-stone-300">
          <span className="flex items-center gap-1"><Clock size={13} /> {user.grade}</span>
          <span className="flex items-center gap-1"><FileText size={13} /> {user.posteAffectation}</span>
          <span>CIN: {user.cin} | PPR: {user.ppr}</span>
        </div>
      </div>

      {/* Action cards */}
      <h3 className="text-lg font-semibold text-stone-700 mb-4">Mes demandes administratives</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map(({ id, icon: Icon, title, desc, color, lightColor, textColor, borderColor }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`group text-left p-6 bg-white rounded-2xl border ${borderColor} hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${color} mb-4 shadow-md group-hover:scale-105 transition-transform`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-stone-800 text-base mb-1">{title}</h4>
            <p className="text-sm text-stone-500 mb-4">{desc}</p>
            <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${textColor} ${lightColor} px-3 py-1.5 rounded-full`}>
              Nouvelle demande <ArrowRight size={12} />
            </div>
          </button>
        ))}
      </div>

      {/* Info box */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
        <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Génération automatique de PDF</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Après avoir rempli votre formulaire, l'application génère automatiquement les documents officiels :
            la demande et le bordereau d'envoi DRH, conformes au format du Ministère de l'Intérieur.
          </p>
        </div>
      </div>
    </div>
  );
}
