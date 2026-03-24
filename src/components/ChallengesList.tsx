import * as React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useChallenges } from '../hooks/useChallenges';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Trophy, CheckCircle2, Circle, Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { Input } from './ui/Input';

export function ChallengesList() {
  const { profile } = useAuth();
  const { challenges, userChallenges, completeChallenge, loading } = useChallenges(profile?.uid);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'study' | 'quiz' | 'social'>('all');

  const filteredChallenges = challenges.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || c.type === filter;
    const matchesGrade = !c.grade || c.grade === profile?.grade;
    return matchesSearch && matchesFilter && matchesGrade;
  });

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h1 className="text-5xl font-black tracking-tighter">
          تحديات <span className="text-yellow-500">{profile?.grade?.includes('الأولى') ? 'الجهوي' : 'الوطني'}</span> 🏆
        </h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <Input 
              placeholder="ابحث عن تحدي..." 
              className="pr-10"
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
                className="capitalize"
              >
                {f === 'all' ? 'الكل' : f === 'study' ? 'دراسة' : f === 'quiz' ? 'كويز' : 'اجتماعي'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-20 text-center font-bold opacity-50">جاري تحميل التحديات...</div>
        ) : filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge, i) => {
            const isCompleted = userChallenges.some(uc => uc.challengeId === challenge.id && uc.completed);
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`h-full flex flex-col ${isCompleted ? 'bg-zinc-50 opacity-70' : 'hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]'}`}>
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 justify-between items-start">
                      <div className="flex gap-2">
                        <Badge variant={challenge.type === 'study' ? 'default' : 'secondary'}>
                          {challenge.type === 'study' ? 'دراسة' : challenge.type === 'quiz' ? 'كويز' : 'اجتماعي'}
                        </Badge>
                        {challenge.grade && (
                          <Badge className="bg-zinc-800 text-white border-none">
                            {challenge.grade}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 font-black text-yellow-600">
                        <Trophy size={16} />
                        +{challenge.points}
                      </div>
                    </div>
                    <CardTitle className="mt-4">{challenge.title}</CardTitle>
                    <CardDescription className="text-base">{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1" />
                  <CardFooter>
                    <Button 
                      className="w-full" 
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
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full p-20 text-center border-4 border-dashed border-black">
            <p className="text-2xl font-black opacity-30 uppercase">لا توجد تحديات تطابق بحثك.</p>
          </div>
        )}
      </div>
    </div>
  );
}
