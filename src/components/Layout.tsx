import * as React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';
import { LogOut, User, LayoutDashboard, Video, Trophy, Menu, X, ListTodo, MessageSquare, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'الرئيسية', icon: LayoutDashboard, path: '/' },
    { name: 'المهام', icon: ListTodo, path: '/tasks' },
    { name: 'التحديات', icon: Trophy, path: '/challenges' },
    { name: 'الدردشة', icon: MessageSquare, path: '/chat' },
    { name: 'الترتيب', icon: Users, path: '/leaderboard' },
    { name: 'الفيديوهات', icon: Video, path: '/videos' },
    { name: 'الملف الشخصي', icon: User, path: '/profile' },
  ];

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen pro-bg font-sans text-white selection:bg-[#D4AF37] selection:text-black relative overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="fixed top-[20%] right-[10%] w-[30%] h-[30%] bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none animate-float" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#D4AF37]/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <span className="bg-[#D4AF37] text-black px-2 py-1">AYOUB</span>
            <span className="text-white">POWER</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 font-bold hover:text-[#D4AF37] transition-colors ${
                  location.pathname === item.path ? 'text-[#D4AF37]' : 'text-white/70'
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            ))}
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
              <div className="flex flex-col items-end">
                <span className="text-xs font-black uppercase opacity-50 text-white">النقاط</span>
                <span className="font-black text-lg text-[#D4AF37]">{profile?.points || 0}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="p-2 text-white hover:text-[#D4AF37]">
                <LogOut size={20} />
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-40 bg-black pt-20 px-6 border-b border-[#D4AF37]/20"
          >
            <nav className="flex flex-col gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 text-2xl font-black ${
                    location.pathname === item.path ? 'text-[#D4AF37]' : 'text-white'
                  }`}
                >
                  <item.icon size={28} />
                  {item.name}
                </Link>
              ))}
              <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-black uppercase opacity-50 text-white">النقاط</span>
                  <span className="font-black text-3xl text-[#D4AF37]">{profile?.points || 0}</span>
                </div>
                <Button onClick={logout} className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80">
                  تسجيل الخروج
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4 mt-20 border-t border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-3xl font-black mb-4 gold-text">AYOUB POWER</h3>
            <p className="font-bold opacity-70">
              منصة تعليمية ذكية للطلاب المغاربة. تحديات يومية، محتوى تفاعلي، ومجتمع نشط.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-black mb-4 uppercase gold-text">تابعني</h4>
            <div className="flex gap-4">
              <a href="https://tiktok.com/@ayoub_yas2al" target="_blank" rel="noreferrer" className="bg-[#D4AF37] text-black p-3 hover:translate-y-[-4px] transition-transform rounded-sm">
                <span className="font-black">TikTok</span>
              </a>
              <a href="https://instagram.com/ayoub_powere" target="_blank" rel="noreferrer" className="bg-[#D4AF37] text-black p-3 hover:translate-y-[-4px] transition-transform rounded-sm">
                <span className="font-black">Instagram</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-black mb-4 uppercase">روابط سريعة</h4>
            <ul className="space-y-2 font-bold">
              <li><Link to="/" className="hover:underline">الرئيسية</Link></li>
              <li><Link to="/challenges" className="hover:underline">التحديات</Link></li>
              <li><Link to="/videos" className="hover:underline">الفيديوهات</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/20 text-center font-bold opacity-50">
          © {new Date().getFullYear()} AYOUB POWER. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
