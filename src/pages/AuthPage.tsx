import { useState } from 'react';
import { LogIn, UserPlus, Eye, EyeOff, Shield } from 'lucide-react';
import type { AuthPage } from '../types';
import type { User } from '../types';

interface AuthPageProps {
  onLogin: (email: string, password: string) => { success: boolean; error?: string };
  onRegister: (user: Omit<User, 'id' | 'role'>) => { success: boolean; error?: string };
}

export default function AuthPageComponent({ onLogin, onRegister }: AuthPageProps) {
  const [page, setPage] = useState<AuthPage>('login');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [reg, setReg] = useState({ prenom: '', nom: '', email: '', password: '', confirm: '' });

  const handleLogin = () => {
    setError('');
    if (!loginEmail || !loginPassword) { setError('Veuillez remplir tous les champs.'); return; }
    const result = onLogin(loginEmail, loginPassword);
    if (!result.success) setError(result.error || 'Erreur de connexion.');
  };

  const handleRegister = () => {
    setError('');
    const { prenom, nom, email, password, confirm } = reg;
    if (!prenom || !nom || !email || !password || !confirm) {
      setError('Veuillez remplir tous les champs.'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Adresse email invalide.'); return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.'); return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.'); return;
    }
    const result = onRegister({ prenom, nom, email, password });
    if (result.success) {
      setSuccess('Compte créé ! Vous pouvez maintenant vous connecter.');
      setPage('login');
      setLoginEmail(email);
    } else {
      setError(result.error || "Erreur lors de l'inscription.");
    }
  };

  const inp = "w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all";
  const lbl = "block text-xs font-semibold text-stone-600 mb-1 uppercase tracking-wide";

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4"
      style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(200,164,90,0.08) 0%, transparent 50%)' }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-800 mb-1">GRH Portal</h1>
          <p className="text-sm text-stone-500">Gestion des Ressources Humaines</p>
          <p className="text-xs text-stone-400 mt-1">Ministère de l'Intérieur</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200">

          {/* Tabs */}
          <div className="flex border-b border-stone-200">
            <button onClick={() => { setPage('login'); setError(''); setSuccess(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all ${page === 'login' ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-600' : 'text-stone-400 hover:text-stone-600'}`}>
              <LogIn size={15} /> Connexion
            </button>
            <button onClick={() => { setPage('register'); setError(''); setSuccess(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all ${page === 'register' ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-600' : 'text-stone-400 hover:text-stone-600'}`}>
              <UserPlus size={15} /> Inscription
            </button>
          </div>

          <div className="p-6">
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>}

            {/* LOGIN */}
            {page === 'login' ? (
              <div className="space-y-4">
                <div>
                  <label className={lbl}>Email *</label>
                  <input className={inp} type="email" placeholder="exemple@email.com"
                    value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                </div>
                <div>
                  <label className={lbl}>Mot de passe *</label>
                  <div className="relative">
                    <input className={inp} type={showPass ? 'text' : 'password'} placeholder="••••••••"
                      value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                      onClick={() => setShowPass(v => !v)}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button onClick={handleLogin}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-lg shadow-md transition-all">
                  Se connecter
                </button>
              </div>

            ) : (
              /* REGISTER */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Prénom *</label>
                    <input className={inp} placeholder="Samira"
                      value={reg.prenom} onChange={e => setReg(d => ({ ...d, prenom: e.target.value }))} />
                  </div>
                  <div>
                    <label className={lbl}>Nom *</label>
                    <input className={inp} placeholder="Meftah"
                      value={reg.nom} onChange={e => setReg(d => ({ ...d, nom: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label className={lbl}>Email *</label>
                  <input className={inp} type="email" placeholder="exemple@email.com"
                    value={reg.email} onChange={e => setReg(d => ({ ...d, email: e.target.value }))} />
                </div>

                <div>
                  <label className={lbl}>Mot de passe *</label>
                  <div className="relative">
                    <input className={inp} type={showPass ? 'text' : 'password'} placeholder="Minimum 6 caractères"
                      value={reg.password} onChange={e => setReg(d => ({ ...d, password: e.target.value }))} />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                      onClick={() => setShowPass(v => !v)}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={lbl}>Confirmer le mot de passe *</label>
                  <div className="relative">
                    <input className={inp} type={showConfirm ? 'text' : 'password'} placeholder="Répéter le mot de passe"
                      value={reg.confirm} onChange={e => setReg(d => ({ ...d, confirm: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleRegister()} />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                      onClick={() => setShowConfirm(v => !v)}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button onClick={handleRegister}
                  className="w-full py-3 bg-gradient-to-r from-stone-700 to-stone-800 hover:from-stone-800 hover:to-stone-900 text-white font-semibold rounded-lg shadow-md transition-all">
                  Créer mon compte
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-stone-400 mt-6">
          © {new Date().getFullYear()} Ministère de l'Intérieur — Application GRH
        </p>
      </div>
    </div>
  );
}