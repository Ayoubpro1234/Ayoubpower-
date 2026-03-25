import * as React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useChallenges } from '../hooks/useChallenges';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { CheckCircle2, Circle, Clock, ListTodo, Calendar, Sparkles, Bell, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { useNotifications } from '../hooks/useNotifications';

export function Tasks() {
  const { profile } = useAuth();
  const { challenges, userChallenges, completeChallenge, loading, generateAITasks, toggleLike } = useChallenges(profile?.uid);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const { sendNotification, permission, requestPermission } = useNotifications();

  const handleGenerateAI = async () => {
    if (!profile) return;
    setIsGenerating(true);
    try {
      await generateAITasks(profile);
    } catch (error) {
      console.error("Failed to generate AI tasks:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemindMe = (taskTitle: string) => {
    if (permission !== 'granted') {
      requestPermission().then(granted => {
        if (granted) {
          scheduleReminder(taskTitle);
        }
      });
    } else {
      scheduleReminder(taskTitle);
    }
  };

  const scheduleReminder = (taskTitle: string) => {
    sendNotification('تم جدولة التذكير ⏰', {
      body: `سنقوم بتذكيرك بمهمة "${taskTitle}" لاحقاً.`,
      type: 'reminder'
    });
    
    // Simulate a delayed push notification (e.g., 10 seconds for demo purposes)
    setTimeout(() => {
      sendNotification('وقت المذاكرة! 📚', {
        body: `حان الوقت للبدء في مهمة "${taskTitle}". بالتوفيق!`,
        type: 'task'
      });
    }, 10000);
  };

  // Filter study-type challenges as "Tasks"
  const tasks = challenges.filter(c => c.type === 'study');
  const aiTasks = challenges.filter(c => c.isAI);

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-white">
            المهام <span className="gold-text">اليومية</span> 📝
          </h1>
          <p className="text-xl font-bold text-white/60 mt-2">
            أنجز مهامك الدراسية اليومية واكسب النقاط!
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <Button 
            variant="primary" 
            className="gold-bg hover:opacity-90 text-black flex items-center gap-2 border-none"
            onClick={handleGenerateAI}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Sparkles size={20} />
              </motion.div>
            ) : <Sparkles size={20} />}
            توليد مهام بالذكاء الاصطناعي
          </Button>
          <div className="glass-card gold-border p-4 flex items-center gap-4 rounded-xl">
            <Calendar size={32} className="gold-text" />
            <div>
              <p className="text-xs font-black uppercase text-white/50">تاريخ اليوم</p>
              <p className="text-xl font-black text-white">{format(new Date(), 'yyyy/MM/dd')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tasks Section */}
      {aiTasks.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-black uppercase flex items-center gap-3 text-white">
            <Sparkles className="gold-text" />
            مهام الذكاء الاصطناعي المخصصة
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {aiTasks.map((task, i) => {
              const isCompleted = userChallenges.some(uc => uc.challengeId === task.id && uc.completed);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={`glass-card gold-border ${isCompleted ? 'opacity-70' : 'hover:shadow-[8px_8px_0px_0px_rgba(212,175,55,0.3)]'}`}>
                    <div className="flex justify-between items-center p-6">
                      <div className="flex items-start gap-4">
                        <button 
                          onClick={() => !isCompleted && completeChallenge(task.id)}
                          className={`mt-1 transition-colors ${isCompleted ? 'text-green-500' : 'text-[#D4AF37] hover:text-white'}`}
                        >
                          {isCompleted ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-purple-500 border-none">توصية ذكية</Badge>
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

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="p-20 text-center font-bold text-white/50">جاري تحميل المهام...</div>
        ) : tasks.length > 0 ? (
          tasks.map((task, i) => {
            const isCompleted = userChallenges.some(uc => uc.challengeId === task.id && uc.completed);
            const hasLiked = task.likes?.includes(profile?.uid || '');
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`flex flex-col md:flex-row items-center gap-6 p-6 glass-card gold-border ${isCompleted ? 'opacity-70' : 'hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(212,175,55,0.3)]'}`}>
                  <div className={`w-16 h-16 flex items-center justify-center rounded-xl border border-[#D4AF37]/30 ${isCompleted ? 'bg-green-500 text-white border-none' : 'bg-zinc-800 gold-text'}`}>
                    {isCompleted ? <CheckCircle2 size={32} /> : <ListTodo size={32} />}
                  </div>
                  
                  <div className="flex-1 text-center md:text-right">
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                      <Badge className="bg-blue-500 border-none">مهمة دراسية</Badge>
                      <span className="flex items-center gap-1 text-sm font-black gold-text">
                        <Clock size={14} />
                        30 دقيقة
                      </span>
                    </div>
                    <h3 className={`text-2xl font-black text-white ${isCompleted ? 'line-through opacity-50' : ''}`}>{task.title}</h3>
                    <p className="font-bold text-white/60">{task.description}</p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleLike(task.id)}
                        className={`flex items-center gap-1 transition-colors ${hasLiked ? 'text-red-500' : 'text-zinc-500 hover:text-red-400'}`}
                        title={hasLiked ? "إلغاء الإعجاب" : "إعجاب"}
                      >
                        <Heart size={20} fill={hasLiked ? "currentColor" : "none"} />
                        <span className="text-sm font-bold">{task.likes?.length || 0}</span>
                      </button>
                      <div className="text-2xl font-black gold-text">+{task.points} نقطة</div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      {!isCompleted && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemindMe(task.title)}
                          className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
                          title="ذكرني لاحقاً"
                        >
                          <Bell size={20} />
                        </Button>
                      )}
                      <Button 
                        variant={isCompleted ? 'outline' : 'primary'}
                        disabled={isCompleted}
                        onClick={() => completeChallenge(task.id)}
                        className={`flex-1 md:flex-none ${isCompleted ? 'bg-zinc-800 text-white border-none' : 'gold-bg text-black border-none hover:opacity-90'}`}
                      >
                        {isCompleted ? 'تم الإنجاز' : 'تحديد كمكتمل'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <div className="p-20 text-center border-2 border-dashed border-[#D4AF37]/30 glass-card">
            <p className="text-2xl font-black text-white/30 uppercase">لا توجد مهام دراسية حالياً.</p>
          </div>
        )}
      </div>

      {/* Progress Section */}
      <Card className="glass-card gold-border p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right">
            <h3 className="text-3xl font-black mb-2 text-white">تقدمك اليومي</h3>
            <p className="font-bold text-white/70">استمر في الإنجاز للحفاظ على سلسلة تفوقك!</p>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-sm font-black uppercase text-white/50">المهام المنجزة</p>
              <p className="text-5xl font-black text-white">
                {userChallenges.filter(uc => tasks.some(t => t.id === uc.challengeId)).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-black uppercase text-white/50">إجمالي النقاط</p>
              <p className="text-5xl font-black gold-text">
                {userChallenges.filter(uc => tasks.some(t => t.id === uc.challengeId)).length * 50}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
