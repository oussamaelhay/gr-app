import { LayoutDashboard, Calendar, FileText, LogOut, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { User, AppPage } from '../types';

interface LayoutProps {
  user: User;
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const navItems: { id: AppPage; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'conge', label: 'Demande de Congé', icon: Calendar },
  { id: 'attestation', label: 'Attestation de Travail', icon: FileText },
];

export default function Layout({ user, currentPage, onNavigate, onLogout, children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      <div className="p-5 border-b border-stone-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield size={15} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm leading-tight">GRH Portal</p>
            <p className="text-stone-400 text-[10px]">Ministère de l'Intérieur</p>
          </div>
        </div>
      </div>

      <div className="p-3 border-b border-stone-700">
        <div className="bg-stone-700 rounded-xl p-3">
          <p className="text-white font-semibold text-sm truncate">{user.prenom} {user.nom}</p>
          <p className="text-stone-400 text-[11px] truncate">{user.grade}</p>
          <p className="text-stone-500 text-[10px] mt-1">CIN: {user.cin}</p>
        </div>
      </div>

      <nav className="p-3 flex-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { onNavigate(id); setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all ${
              currentPage === id
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:bg-stone-700 hover:text-white'
            }`}
          >
            <Icon size={16} className="flex-shrink-0" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-stone-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-400 hover:bg-red-900/40 hover:text-red-300 transition-all"
        >
          <LogOut size={16} />
          <span>Déconnexion</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-stone-100">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-stone-800 fixed inset-y-0 left-0 z-30">
        <NavContent />
      </aside>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-stone-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-600 rounded-lg flex items-center justify-center">
            <Shield size={13} className="text-white" />
          </div>
          <span className="font-display font-bold text-white text-sm">GRH Portal</span>
        </div>
        <button onClick={() => setMobileOpen(v => !v)} className="text-white p-1">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="flex flex-col w-56 bg-stone-800 h-full shadow-xl">
            <NavContent />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-56 overflow-auto min-h-screen">
        <div className="md:hidden h-12" /> {/* mobile header spacer */}
        {children}
      </main>
    </div>
  );
}
