import * as React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useChallenges } from '../hooks/useChallenges';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { CheckCircle2, Circle, Clock, ListTodo, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';

export function Tasks() {
  const { profile } = useAuth();
  const { challenges, userChallenges, completeChallenge, loading, generateAITasks } = useChallenges(profile?.uid);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerateAI = async () => {
    if (!profile) return;
    setIsGenerating(true);
    await generateAITasks(profile);
    setIsGenerating(false);
  };

  // Filter study-type challenges as "Tasks"
  const tasks = challenges.filter(c => c.type === 'study');
  const aiTasks = challenges.filter(c => c.isAI);

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter">
            المهام <span className="text-blue-600">اليومية</span> 📝
          </h1>
          <p className="text-xl font-bold opacity-60 mt-2">
            أنجز مهامك الدراسية اليومية واكسب النقاط!
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <Button 
            variant="primary" 
            className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
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
          <div className="bg-white border-4 border-black p-4 flex items-center gap-4">
            <Calendar size={32} />
            <div>
              <p className="text-xs font-black uppercase opacity-50">تاريخ اليوم</p>
              <p className="text-xl font-black">{format(new Date(), 'yyyy/MM/dd')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tasks Section */}
      {aiTasks.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-black uppercase flex items-center gap-3">
            <Sparkles className="text-purple-500" />
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
                  <Card className={`border-purple-500 border-2 ${isCompleted ? 'bg-purple-50 opacity-70' : 'hover:shadow-[8px_8px_0px_0px_rgba(168,85,247,1)]'}`}>
                    <div className="flex justify-between items-center p-6">
                      <div className="flex items-start gap-4">
                        <button 
                          onClick={() => !isCompleted && completeChallenge(task.id)}
                          className={`mt-1 transition-colors ${isCompleted ? 'text-green-500' : 'text-purple-300 hover:text-purple-600'}`}
                        >
                          {isCompleted ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-purple-500">توصية ذكية</Badge>
                            <span className="text-sm font-black text-purple-700">+{task.points} نقطة</span>
                          </div>
                          <h3 className={`text-xl font-black ${isCompleted ? 'line-through' : ''}`}>{task.title}</h3>
                          <p className="font-bold opacity-60">{task.description}</p>
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
          <div className="p-20 text-center font-bold opacity-50">جاري تحميل المهام...</div>
        ) : tasks.length > 0 ? (
          tasks.map((task, i) => {
            const isCompleted = userChallenges.some(uc => uc.challengeId === task.id && uc.completed);
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`flex flex-col md:flex-row items-center gap-6 p-6 ${isCompleted ? 'bg-zinc-50 opacity-70' : 'hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'}`}>
                  <div className={`w-16 h-16 flex items-center justify-center border-4 border-black ${isCompleted ? 'bg-green-500 text-white' : 'bg-zinc-100'}`}>
                    {isCompleted ? <CheckCircle2 size={32} /> : <ListTodo size={32} />}
                  </div>
                  
                  <div className="flex-1 text-center md:text-right">
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                      <Badge variant="default">مهمة دراسية</Badge>
                      <span className="flex items-center gap-1 text-sm font-black text-yellow-600">
                        <Clock size={14} />
                        30 دقيقة
                      </span>
                    </div>
                    <h3 className="text-2xl font-black">{task.title}</h3>
                    <p className="font-bold opacity-60">{task.description}</p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="text-2xl font-black text-yellow-600">+{task.points} نقطة</div>
                    <Button 
                      variant={isCompleted ? 'outline' : 'primary'}
                      disabled={isCompleted}
                      onClick={() => completeChallenge(task.id)}
                      className="w-full md:w-auto"
                    >
                      {isCompleted ? 'تم الإنجاز' : 'تحديد كمكتمل'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <div className="p-20 text-center border-4 border-dashed border-black">
            <p className="text-2xl font-black opacity-30 uppercase">لا توجد مهام دراسية حالياً.</p>
          </div>
        )}
      </div>

      {/* Progress Section */}
      <Card className="bg-black text-white p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right">
            <h3 className="text-3xl font-black mb-2">تقدمك اليومي</h3>
            <p className="font-bold opacity-70">استمر في الإنجاز للحفاظ على سلسلة تفوقك!</p>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-sm font-black uppercase opacity-50">المهام المنجزة</p>
              <p className="text-5xl font-black">
                {userChallenges.filter(uc => tasks.some(t => t.id === uc.challengeId)).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-black uppercase opacity-50">إجمالي النقاط</p>
              <p className="text-5xl font-black text-yellow-400">
                {userChallenges.filter(uc => tasks.some(t => t.id === uc.challengeId)).length * 50}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
