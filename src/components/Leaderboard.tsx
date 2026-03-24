import * as React from 'react';
import { db, collection, query, orderBy, limit, onSnapshot, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Trophy, Medal, Crown, Star, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Leaderboard() {
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [loading, setLoading] = React.useState(true);

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

  return (
    <div className="max-w-4xl mx-auto space-y-8" dir="rtl">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black tracking-tighter uppercase">
          ترتيب <span className="text-yellow-500">الأبطال</span> 🏆
        </h1>
        <p className="text-xl font-bold opacity-60">الترتيب العام لجميع الطلاب بناءً على النقاط.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Top 3 Podium */}
        {users.slice(0, 3).map((user, i) => {
          const icons = [<Crown className="text-yellow-500" />, <Medal className="text-zinc-400" />, <Medal className="text-orange-500" />];
          const colors = ['border-yellow-500 bg-yellow-50', 'border-zinc-400 bg-zinc-50', 'border-orange-500 bg-orange-50'];
          
          return (
            <motion.div
              key={user.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 border-4 ${colors[i]} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center space-y-4 relative overflow-hidden`}
            >
              <div className="absolute top-4 left-4 opacity-20">
                {icons[i]}
              </div>
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto text-3xl font-black border-4 border-white shadow-xl">
                {i + 1}
              </div>
              <div>
                <h3 className="text-2xl font-black truncate">{user.displayName}</h3>
                <p className="text-sm font-bold opacity-60">{user.school || 'طالب مجتهد'}</p>
              </div>
              <div className="text-3xl font-black text-black">
                {user.points} <span className="text-sm uppercase">نقطة</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Card className="border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <CardHeader className="bg-black text-white border-b-4 border-black">
          <div className="grid grid-cols-4 font-black text-lg">
            <div className="text-right">الترتيب</div>
            <div className="text-right">الطالب</div>
            <div className="text-right">المدرسة</div>
            <div className="text-left">النقاط</div>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white">
          {loading ? (
            <div className="p-12 text-center font-bold opacity-50">جاري تحميل الترتيب...</div>
          ) : (
            <div className="divide-y-4 divide-black">
              {users.slice(3).map((user, i) => (
                <motion.div
                  key={user.uid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-4 p-6 items-center font-bold hover:bg-zinc-50 transition-colors"
                >
                  <div className="text-2xl font-black">#{i + 4}</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-200 rounded-full flex items-center justify-center text-xs font-black">
                      {user.displayName.charAt(0)}
                    </div>
                    <span className="truncate">{user.displayName}</span>
                  </div>
                  <div className="opacity-60 truncate">{user.school || '---'}</div>
                  <div className="text-left font-black text-xl">
                    {user.points} <span className="text-xs opacity-50">نقطة</span>
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
