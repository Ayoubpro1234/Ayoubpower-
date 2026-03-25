import * as React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useChallenges } from '../hooks/useChallenges';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Trophy, Zap, Flame, CheckCircle2, Circle, ArrowRight, Video, Instagram, Plus, Sparkles, Brain, Share2, Star, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { db, doc, updateDoc } from '../lib/firebase';
import { useNotifications } from '../hooks/useNotifications';
import { Stories } from './Stories';
import { BADGES, getNextLevelPoints } from '../lib/gamification';

export function Dashboard() {
  const { profile } = useAuth();
  const { challenges, userChallenges, completeChallenge, loading, seedChallenges, generateAITasks } = useChallenges(profile?.uid);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const { sendNotification } = useNotifications();

  const handleGenerateAI = async () => {
    if (!profile) return;
    setIsGenerating(true);
    await generateAITasks(profile);
    setIsGenerating(false);
  };

  const handleShare = (title: string, description: string) => {
    if (navigator.share) {
      navigator.share({
        title: `تحدي: ${title}`,
        text: `${description}\nانضم إلي في هذا التحدي على منصة أيوب باور!`,
        url: window.location.origin + '/challenges',
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`تحدي: ${title}\n${description}\nانضم إلي في هذا التحدي على منصة أيوب باور!`);
      alert('تم نسخ تفاصيل التحدي إلى الحافظة!');
    }
  };

  React.useEffect(() => {
    if (profile?.uid) {
      const userRef = doc(db, 'users', profile.uid);
      updateDoc(userRef, { lastActive: new Date().toISOString() }).catch((err) => {
        // We don't want to crash the dashboard for this background update,
        // but we should log it if it's a permission error
        if (err.message?.includes('permission')) {
          console.error('Permission error updating lastActive:', err);
        }
      });
    }
  }, [profile?.uid]);

  React.useEffect(() => {
    if (!loading && challenges.length === 0 && profile?.role === 'admin') {
      seedChallenges();
    }
  }, [loading, challenges, seedChallenges, profile?.role]);

  // Push notification for incomplete tasks
  React.useEffect(() => {
    if (!loading && challenges.length > 0) {
      const incompleteTasks = challenges.filter(c => c.type === 'study' && !userChallenges.some(uc => uc.challengeId === c.id && uc.completed));
      
      if (incompleteTasks.length > 0) {
        // Check if we already notified today
        const lastNotified = localStorage.getItem('lastTaskNotification');
        const today = new Date().toDateString();
        
        if (lastNotified !== today) {
          setTimeout(() => {
            sendNotification('تذكير بالمهام اليومية! 📚', {
              body: `لديك ${incompleteTasks.length} مهام دراسية بانتظارك اليوم. لا تفوت سلسلة إنجازاتك!`,
              type: 'task'
            });
            localStorage.setItem('lastTaskNotification', today);
          }, 3000); // Delay slightly so it doesn't pop up instantly on load
        }
      }
    }
  }, [loading, challenges, userChallenges, sendNotification]);

  const stats = [
    { name: 'النقاط', value: profile?.points || 0, icon: Trophy, color: 'text-yellow-500' },
    { name: 'التحديات المكتملة', value: userChallenges.filter(uc => uc.completed).length, icon: Zap, color: 'text-blue-500' },
    { name: 'سلسلة الإنجاز', value: profile?.streak || 0, icon: Flame, color: 'text-orange-500' },
  ];

  const dailyChallenges = challenges.slice(0, 3); // Just show 3 for now

  const currentLevel = profile?.level || 1;
  const nextLevelPoints = getNextLevelPoints(currentLevel);
  const currentPoints = profile?.points || 0;
  const prevLevelPoints = currentLevel > 1 ? getNextLevelPoints(currentLevel - 1) : 0;
  const progressPercentage = Math.min(100, Math.max(0, ((currentPoints - prevLevelPoints) / (nextLevelPoints - prevLevelPoints)) * 100));

  const userBadges = profile?.badges || [];

  return (
    <div className="space-y-12" dir="rtl">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2 text-white">
            أهلاً، <span className="gold-text">{profile?.displayName?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-xl font-bold text-white/60">
            مستعد لتحدي اليوم؟ لنواصل التقدم في {profile?.grade}.
            {profile?.isRegional ? ' (تركيز على الجهوي 📚)' : ' (تركيز على الوطني 🎓)'}
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link to="/social">
            <Button className="gold-bg hover:opacity-90 flex items-center gap-2 border-none text-black font-black px-6 py-6 text-lg rounded-xl">
              <Video size={20} />
              شاهد الفيديوهات التعليمية
            </Button>
          </Link>
          <Link to="/tasks">
            <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all flex items-center gap-2 font-black px-6 py-6 text-lg rounded-xl">
              <Zap size={20} />
              ابدأ المهام اليومية
            </Button>
          </Link>
        </div>
      </section>

      {/* Stories Section (TikTok/Instagram style) */}
      <section>
        <Stories />
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="flex items-center gap-6 p-8 glass-card gold-border">
              <div className={`p-4 bg-zinc-800 border border-[#D4AF37]/20 rounded-none gold-text`}>
                <stat.icon size={32} />
              </div>
              <div>
                <p className="text-sm font-black uppercase opacity-50 text-white">{stat.name}</p>
                <p className="text-4xl font-black gold-text">{stat.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Gamification: Level & Badges */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Level Progress */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="p-6 glass-card gold-border h-full flex flex-col justify-center">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#D4AF37]/10 rounded-full">
                  <Star className="text-[#D4AF37]" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">المستوى {currentLevel}</h3>
                  <p className="text-sm text-white/60">{currentPoints} / {nextLevelPoints} نقطة</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-[#D4AF37]">المستوى التالي</p>
                  <p className="text-2xl font-black text-white">{currentLevel + 1}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleShare(`المستوى ${currentLevel}`, `لقد وصلت إلى المستوى ${currentLevel} في منصة أيوب باور بـ ${currentPoints} نقطة!`)}
                  className="text-white/50 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
                >
                  <Share2 size={20} />
                </Button>
              </div>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-4 overflow-hidden border border-white/10">
              <motion.div 
                className="gold-bg h-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-center text-sm text-white/50 mt-3 font-bold">
              باقي {nextLevelPoints - currentPoints} نقطة للوصول للمستوى القادم!
            </p>
          </Card>
        </motion.div>

        {/* Badges */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="p-6 glass-card gold-border h-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Award className="text-[#D4AF37]" size={24} />
                <h3 className="text-xl font-black text-white">شارات الإنجاز</h3>
              </div>
              {userBadges.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleShare(`شارات الإنجاز`, `لقد جمعت ${userBadges.length} شارات في منصة أيوب باور! هل يمكنك التغلب علي؟`)}
                  className="text-white/50 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
                >
                  <Share2 size={20} />
                </Button>
              )}
            </div>
            
            {userBadges.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center opacity-50">
                <Trophy size={48} className="mb-2 text-white/20" />
                <p className="font-bold text-white">لم تحصل على أي شارة بعد.</p>
                <p className="text-sm">أكمل المهام لتبدأ في جمع الشارات!</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {userBadges.map(badgeId => {
                  const badge = BADGES.find(b => b.id === badgeId);
                  if (!badge) return null;
                  return (
                    <div 
                      key={badge.id} 
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${badge.color} border border-white/10 shadow-sm`}
                      title={badge.description}
                    >
                      <span className="text-xl">{badge.icon}</span>
                      <span className="font-bold text-sm">{badge.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </motion.div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks Section */}
        <section className="lg:col-span-2 space-y-6">
          {/* AI Personalized Tasks */}
          {challenges.some(c => c.isAI) && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black uppercase flex items-center gap-3 gold-text">
                  <Sparkles />
                  مهام الذكاء الاصطناعي
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {challenges.filter(c => c.isAI).map((task, i) => {
                  const isCompleted = userChallenges.some(uc => uc.challengeId === task.id && uc.completed);
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                    <Card className={`border-purple-500 border-2 glass-card ${isCompleted ? 'opacity-70' : 'hover:shadow-[8px_8px_0px_0px_rgba(168,85,247,1)]'}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-start gap-4">
                            <button 
                              onClick={() => !isCompleted && completeChallenge(task.id)}
                              className={`mt-1 transition-colors ${isCompleted ? 'text-green-500' : 'text-purple-300 hover:text-purple-400'}`}
                            >
                              {isCompleted ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                            </button>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-purple-500">توصية ذكية</Badge>
                                <span className="text-sm font-black gold-text">+{task.points} نقطة</span>
                              </div>
                              <h3 className={`text-xl font-black text-white ${isCompleted ? 'line-through opacity-50' : ''}`}>{task.title}</h3>
                              <p className="font-bold text-white/60">{task.description}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <h2 className="text-3xl font-black uppercase flex items-center gap-3 gold-text">
              <Zap />
              المهام اليومية
            </h2>
            <Link to="/tasks" className="font-bold hover:underline">عرض الكل</Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="p-12 text-center font-bold opacity-50">جاري تحميل المهام...</div>
            ) : challenges.filter(c => c.type === 'study').slice(0, 2).length > 0 ? (
              challenges.filter(c => c.type === 'study').slice(0, 2).map((task, i) => {
                const isCompleted = userChallenges.some(uc => uc.challengeId === task.id && uc.completed);
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className={`group transition-all glass-card ${isCompleted ? 'opacity-70' : 'hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(212,175,55,0.3)]'}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-start gap-4">
                          <button 
                            onClick={() => !isCompleted && completeChallenge(task.id)}
                            className={`mt-1 transition-colors ${isCompleted ? 'text-green-500' : 'text-zinc-300 hover:text-black'}`}
                          >
                            {isCompleted ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                          </button>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="default">مهمة دراسية</Badge>
                              <span className="text-sm font-black gold-text">+{task.points} نقطة</span>
                            </div>
                            <h3 className={`text-xl font-black text-white ${isCompleted ? 'line-through opacity-50' : ''}`}>{task.title}</h3>
                            <p className="font-bold text-white/60">{task.description}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <div className="p-12 text-center border-2 border-dashed border-black font-bold opacity-50">
                لا توجد مهام دراسية متاحة حالياً.
              </div>
            )}
          </div>

          {/* Challenges Section */}
          <div className="flex justify-between items-center pt-8">
            <h2 className="text-3xl font-black uppercase flex items-center gap-3 gold-text">
              <Trophy />
              التحديات الرئيسية
            </h2>
            <Link to="/challenges" className="font-bold hover:underline">عرض الكل</Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="p-12 text-center font-bold opacity-50">جاري تحميل التحديات...</div>
            ) : challenges.filter(c => c.type !== 'study').slice(0, 2).length > 0 ? (
              challenges.filter(c => c.type !== 'study').slice(0, 2).map((challenge, i) => {
                const isCompleted = userChallenges.some(uc => uc.challengeId === challenge.id && uc.completed);
                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className={`group transition-all glass-card ${isCompleted ? 'opacity-70' : 'hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(212,175,55,0.3)]'}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-start gap-4">
                          <button 
                            onClick={() => !isCompleted && completeChallenge(challenge.id)}
                            className={`mt-1 transition-colors ${isCompleted ? 'text-green-500' : 'text-zinc-300 hover:text-black'}`}
                          >
                            {isCompleted ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                          </button>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary">
                                {challenge.type === 'quiz' ? 'كويز' : 'اجتماعي'}
                              </Badge>
                              <span className="text-sm font-black gold-text">+{challenge.points} نقطة</span>
                            </div>
                            <h3 className={`text-xl font-black text-white ${isCompleted ? 'line-through opacity-50' : ''}`}>{challenge.title}</h3>
                            <p className="font-bold text-white/60">{challenge.description}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(challenge.title, challenge.description);
                          }}
                          title="مشاركة التحدي"
                        >
                          <Share2 size={20} />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <div className="p-12 text-center border-2 border-dashed border-black font-bold opacity-50">
                لا توجد تحديات متاحة حالياً.
              </div>
            )}
          </div>
        </section>

        {/* Sidebar / Social Section */}
        <section className="space-y-6">
          {/* AI Diagnosis Prompt */}
          {!profile?.diagnosis && (
            <Card className="p-6 border-purple-500 border-4 bg-purple-50 hover:shadow-[8px_8px_0px_0px_rgba(168,85,247,1)] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="text-purple-600" />
                <h3 className="text-xl font-black">التشخيص الذكي 🧠</h3>
              </div>
              <p className="font-bold text-sm mb-4">أضف تشخيصك الدراسي للحصول على مهام مخصصة من الذكاء الاصطناعي!</p>
              <Link to="/profile">
                <Button variant="primary" className="w-full bg-purple-600 hover:bg-purple-700">أضف تشخيصك الآن</Button>
              </Link>
            </Card>
          )}

          <h2 className="text-3xl font-black uppercase flex items-center gap-3 gold-text">
            <Video />
            آخر الفيديوهات
          </h2>
          
          <Card className="p-0 overflow-hidden glass-card gold-border">
            <div className="aspect-video bg-zinc-800 flex items-center justify-center relative group">
              <img 
                src="https://img.youtube.com/vi/p60rN9n382s/hqdefault.jpg" 
                alt="Video Thumbnail" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 bg-[#D4AF37] text-black rounded-full flex items-center justify-center shadow-xl scale-90 group-hover:scale-100 transition-transform">
                  <Video size={32} fill="currentColor" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-black mb-2 text-white">كيف تذاكر بذكاء وليس بجهد؟ 🧠</h3>
              <p className="font-bold text-white/60 text-sm mb-4">أفضل النصائح لتنظيم الوقت والمذاكرة بفعالية مع أحمد أبو زيد.</p>
              <div className="flex gap-2">
                <a href="https://www.youtube.com/watch?v=p60rN9n382s" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full gold-bg hover:opacity-90 border-none text-sm">شاهد الآن</Button>
                </a>
              </div>
            </div>
          </Card>

          <Card className="bg-black text-white p-8">
            <h3 className="text-2xl font-black mb-4">انضم لمجتمعنا! 🚀</h3>
            <p className="font-bold opacity-70 mb-6">شارك تقدمك مع آلاف الطلاب الآخرين واحصل على دعم مباشر.</p>
            <Button variant="secondary" className="w-full">
              انضم لمجموعة تلغرام
            </Button>
          </Card>
        </section>
      </div>

      {/* Floating Action Button for AI Generation */}
      <div className="fixed bottom-8 left-8 z-50">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex items-center justify-center group relative"
          >
            {isGenerating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={32} />
              </motion.div>
            ) : (
              <Plus size={32} />
            )}
            
            {/* Tooltip */}
            <div className="absolute bottom-full mb-4 right-0 bg-black text-white text-xs font-black py-2 px-4 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              توليد مهام ذكية بالذكاء الاصطناعي ✨
            </div>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
