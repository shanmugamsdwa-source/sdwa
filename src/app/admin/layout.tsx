'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Building2,
  Users,
  Trophy,
  Swords,
  Dumbbell,
  Weight,
  Scale,
  ImageIcon,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

// ─── Navigation Config ──────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Website',
    href: '/admin/settings',
    icon: <Building2 size={20} />,
    children: [
      { label: 'Association Info', href: '/admin/settings' },
      { label: 'Objectives', href: '/admin/objectives' },
      { label: 'Committee', href: '/admin/committee' },
    ],
  },
  {
    label: 'Achievements',
    href: '/admin/achievements',
    icon: <Trophy size={20} />,
    children: [
      { label: 'All Achievements', href: '/admin/achievements' },
      { label: 'Categories', href: '/admin/achievements/categories' },
      { label: 'Levels', href: '/admin/achievements/levels' },
    ],
  },
  {
    label: 'Tournaments',
    href: '/admin/tournaments',
    icon: <Swords size={20} />,
    children: [
      { label: 'All Tournaments', href: '/admin/tournaments' },
      { label: 'Categories', href: '/admin/tournaments/categories' },
      { label: 'Weight Divisions', href: '/admin/tournaments/divisions' },
      { label: 'Weight Classes', href: '/admin/tournaments/weights' },
    ],
  },
  {
    label: 'Affiliated Centres',
    href: '/admin/affiliated-centres',
    icon: <Dumbbell size={20} />,
  },
  {
    label: 'Media Gallery',
    href: '/admin/gallery',
    icon: <ImageIcon size={20} />,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: <Settings size={20} />,
  },
];

// ─── Sidebar Component ──────────────────────────────────────────────────────

function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label)
        ? prev.filter((g) => g !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  // Auto-expand the active group
  useEffect(() => {
    for (const item of navItems) {
      if (item.children) {
        const isChildActive = item.children.some((child) =>
          pathname.startsWith(child.href)
        );
        if (isChildActive && !expandedGroups.includes(item.label)) {
          setExpandedGroups((prev) => [...prev, item.label]);
        }
      }
    }
  }, [pathname]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-white text-lg">SDWA Admin</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleGroup(item.label)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-white bg-slate-800'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        {item.label}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          expandedGroups.includes(item.label)
                            ? 'rotate-180'
                            : ''
                        }`}
                      />
                    </button>
                    {expandedGroups.includes(item.label) && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={onClose}
                              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                pathname === child.href
                                  ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/10'
                                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-white bg-slate-800'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Admin Layout Content ───────────────────────────────────────────────────

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [user, loading, router, isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-[var(--color-accent)] rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800 flex items-center px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-400 hover:text-white mr-4"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">
                {user.displayName || user.email}
              </p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {(user.displayName || user.email || 'A')[0].toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

// ─── Admin Layout (with AuthProvider) ───────────────────────────────────────

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
