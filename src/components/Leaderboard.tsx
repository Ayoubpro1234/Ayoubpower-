import * as React from 'react';
import { db, collection, query, orderBy, limit, onSnapshot, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Trophy, Medal, Crown, Star, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Leaderboard() {
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<'all' | 'regional' | 'national' | 'university'>('all');

  React.useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('points', 'desc'), limit(100));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      } as UserProfile));
      setUsers(usersData);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'users');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredUsers = React.useMemo(() => {
    if (filter === 'all') return users;
    if (filter === 'regional') return users.filter(u => u.grade === 'السنة الأولى باك');
    if (filter === 'national') return users.filter(u => u.grade === 'السنة الثانية باك');
    if (filter === 'university') return users.filter(u => u.grade === 'طالب جامعي');
    return users;
  }, [users, filter]);

  return (
    <div className="max-w-4xl mx-auto space-y-8" dir="rtl">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black tracking-tighter uppercase text-white">
          ترتيب <span className="gold-text">الأبطال</span> 🏆
        </h1>
        <p className="text-xl font-bold text-white/60">الترتيب العام لجميع الطلاب بناءً على النقاط.</p>
      </div>

      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        <button onClick={() => setFilter('all')} className={`px-6 py-2 rounded-full font-bold transition-all ${filter === 'all' ? 'bg-[#D4AF37] text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}>الكل</button>
        <button onClick={() => setFilter('regional')} className={`px-6 py-2 rounded-full font-bold transition-all ${filter === 'regional' ? 'bg-[#D4AF37] text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}>الجهوي (أولى باك)</button>
        <button onClick={() => setFilter('national')} className={`px-6 py-2 rounded-full font-bold transition-all ${filter === 'national' ? 'bg-[#D4AF37] text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}>الوطني (ثانية باك)</button>
        <button onClick={() => setFilter('university')} className={`px-6 py-2 rounded-full font-bold transition-all ${filter === 'university' ? 'bg-[#D4AF37] text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}>جامعي</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Top 3 Podium */}
        {filteredUsers.slice(0, 3).map((user, i) => {
          const icons = [<Crown className="text-yellow-600" />, <Medal className="text-zinc-500" />, <Medal className="text-orange-600" />];
          const colors = ['border-[#D4AF37] bg-yellow-50', 'border-zinc-400 bg-zinc-100', 'border-orange-500 bg-orange-50'];
          
          return (
            <motion.div
              key={user.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 border-4 ${colors[i]} shadow-[8px_8px_0px_0px_rgba(212,175,55,0.2)] text-center space-y-4 relative overflow-hidden text-black rounded-xl`}
            >
              <div className="absolute top-4 left-4 opacity-20">
                {icons[i]}
              </div>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto text-3xl font-black border-4 shadow-xl ${i === 0 ? 'bg-[#D4AF37] text-black border-black' : 'bg-white text-black border-zinc-300'}`}>
                {i + 1}
              </div>
              <div>
                <h3 className="text-2xl font-black truncate text-black">{user.displayName}</h3>
                <p className="text-sm font-bold text-black/60">{user.school || 'طالب مجتهد'}</p>
              </div>
              <div className={`text-3xl font-black ${i === 0 ? 'text-yellow-700' : 'text-black'}`}>
                {user.points} <span className="text-sm uppercase text-black/50">نقطة</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Card className="border-2 border-[#D4AF37]/30 shadow-[12px_12px_0px_0px_rgba(212,175,55,0.1)] overflow-hidden glass-card">
        <CardHeader className="bg-zinc-900 text-white border-b border-[#D4AF37]/20">
          <div className="grid grid-cols-4 font-black text-lg">
            <div className="text-right">الترتيب</div>
            <div className="text-right">الطالب</div>
            <div className="text-right">المدرسة</div>
            <div className="text-left">النقاط</div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center font-bold text-white/50">جاري تحميل الترتيب...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center font-bold text-white/50">لا يوجد طلاب في هذا التصنيف حالياً.</div>
          ) : (
            <div className="divide-y divide-[#D4AF37]/10">
              {filteredUsers.slice(3).map((user, i) => (
                <motion.div
                  key={user.uid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-4 p-6 items-center font-bold hover:bg-zinc-800/50 transition-colors text-white"
                >
                  <div className="text-2xl font-black text-white/50">#{i + 4}</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-800 border border-[#D4AF37]/30 rounded-full flex items-center justify-center text-xs font-black gold-text">
                      {user.displayName.charAt(0)}
                    </div>
                    <span className="truncate">{user.displayName}</span>
                  </div>
                  <div className="text-white/60 truncate">{user.school || '---'}</div>
                  <div className="text-left font-black text-xl gold-text">
                    {user.points} <span className="text-xs text-white/50">نقطة</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
