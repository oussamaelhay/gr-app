// Auth types
export interface User {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  password: string;
  role: 'employee' | 'admin';
  cin?: string;
  ppr?: string;
  grade?: string;
  posteAffectation?: string;
  telephone?: string;
  direction?: string;
}

// Demande de congé
export interface DemandeConge {
  annee: string;
  prenom: string;
  nom: string;
  grade: string;
  posteAffectation: string;
  cin: string;
  ppr: string;
  dateDepart: string;
  dateRetour: string;
  duree: string;
  residencePendantConge: string;
  telephone: string;
  observations: string;
  dateSignature: string;
}

// Demande attestation de travail
export interface DemandeAttestation {
  prenom: string;
  nom: string;
  cin: string;
  ppr: string;
  grade: string;
  posteAffectation: string;
  dateEmbauche: string;
  motif: string;
  dateSignature: string;
  direction: string;
}

// App state
export type RequestType = 'conge' | 'attestation';
export type AuthPage = 'login' | 'register';
export type AppPage = 'dashboard' | 'conge' | 'attestation' | 'history';

export interface PermanenceForm {
  cin: string;
  nom: string;
  prenom: string;
  grade: string;
  direction: string;
  service: string;
  typePermanence: 'weekend' | 'nuit';
  dateDebut: string;
  dateFin: string;
  motif: string;
  lieu: string;
  observations?: string;
}
export interface PermanenceRequest extends PermanenceForm {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}