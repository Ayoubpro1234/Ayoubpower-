import * as React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useChallenges } from '../hooks/useChallenges';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Trophy, CheckCircle2, Circle, Search, Filter, Share2, Bell, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Input } from './ui/Input';
import { useNotifications } from '../hooks/useNotifications';

export function ChallengesList() {
  const { profile } = useAuth();
  const { challenges, userChallenges, completeChallenge, loading, toggleLike } = useChallenges(profile?.uid);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'study' | 'quiz' | 'social'>('all');
  const { sendNotification, permission, requestPermission } = useNotifications();

  const filteredChallenges = challenges.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || c.type === filter;
    const matchesGrade = !c.grade || c.grade === profile?.grade;
    return matchesSearch && matchesFilter && matchesGrade;
  });

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

  const handleRemindMe = (challengeTitle: string) => {
    if (permission !== 'granted') {
      requestPermission().then(granted => {
        if (granted) {
          scheduleReminder(challengeTitle);
        }
      });
    } else {
      scheduleReminder(challengeTitle);
    }
  };

  const scheduleReminder = (challengeTitle: string) => {
    sendNotification('تم جدولة التذكير ⏰', {
      body: `سنقوم بتذكيرك بتحدي "${challengeTitle}" لاحقاً.`,
      type: 'reminder'
    });
    
    // Simulate a delayed push notification (e.g., 10 seconds for demo purposes)
    setTimeout(() => {
      sendNotification('تحدي بانتظارك! 🏆', {
        body: `حان الوقت للبدء في تحدي "${challengeTitle}". أظهر قوتك!`,
        type: 'challenge'
      });
    }, 10000);
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h1 className="text-5xl font-black tracking-tighter text-white">
          تحديات <span className="gold-text">{profile?.grade?.includes('الأولى') ? 'الجهوي' : 'الوطني'}</span> 🏆
        </h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <Input 
              placeholder="ابحث عن تحدي..." 
              className="pr-10 bg-zinc-900 border-[#D4AF37]/30 text-white placeholder:text-white/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'study', 'quiz', 'social'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
                className={`capitalize ${filter === f ? 'gold-bg text-black border-none' : 'border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black'}`}
              >
                {f === 'all' ? 'الكل' : f === 'study' ? 'دراسة' : f === 'quiz' ? 'كويز' : 'اجتماعي'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-20 text-center font-bold opacity-50 text-white">جاري تحميل التحديات...</div>
        ) : filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge, i) => {
            const isCompleted = userChallenges.some(uc => uc.challengeId === challenge.id && uc.completed);
            const hasLiked = challenge.likes?.includes(profile?.uid || '');
            
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`h-full flex flex-col glass-card gold-border ${isCompleted ? 'opacity-70' : 'hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(212,175,55,0.3)]'}`}>
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 justify-between items-start">
                      <div className="flex gap-2">
                        <Badge className={challenge.type === 'study' ? 'bg-blue-500' : 'bg-purple-500'}>
                          {challenge.type === 'study' ? 'دراسة' : challenge.type === 'quiz' ? 'كويز' : 'اجتماعي'}
                        </Badge>
                        {challenge.grade && (
                          <Badge className="bg-zinc-800 text-white border-none">
                            {challenge.grade}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleLike(challenge.id)}
                          className={`flex items-center gap-1 transition-colors ${hasLiked ? 'text-red-500' : 'text-zinc-500 hover:text-red-400'}`}
                          title={hasLiked ? "إلغاء الإعجاب" : "إعجاب"}
                        >
                          <Heart size={18} fill={hasLiked ? "currentColor" : "none"} />
                          <span className="text-sm font-bold">{challenge.likes?.length || 0}</span>
                        </button>
                        <div className="flex items-center gap-1 font-black gold-text">
                          <Trophy size={16} />
                          +{challenge.points}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="mt-4 text-white">{challenge.title}</CardTitle>
                    <CardDescription className="text-base text-white/70">{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1" />
                  <CardFooter className="flex gap-2 border-t border-[#D4AF37]/20 pt-4">
                    <Button 
                      className={`flex-1 ${isCompleted ? 'bg-zinc-800 text-white border-none' : 'gold-bg text-black border-none hover:opacity-90'}`}
                      variant={isCompleted ? 'outline' : 'primary'}
                      disabled={isCompleted}
                      onClick={() => completeChallenge(challenge.id)}
                    >
                      {isCompleted ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 size={20} />
                          تم الإنجاز
                        </span>
                      ) : 'ابدأ التحدي'}
                    </Button>
                    {!isCompleted && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
                        onClick={() => handleRemindMe(challenge.title)}
                        title="ذكرني لاحقاً"
                      >
                        <Bell size={20} />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
                      onClick={() => handleShare(challenge.title, challenge.description)}
                      title="مشاركة التحدي"
                    >
                      <Share2 size={20} />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full p-20 text-center border-2 border-dashed border-[#D4AF37]/30 glass-card">
            <p className="text-2xl font-black opacity-50 uppercase text-white">لا توجد تحديات تطابق بحثك.</p>
          </div>
        )}
      </div>
    </div>
  );
}
