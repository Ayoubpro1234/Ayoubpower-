import * as React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { User, Mail, School, GraduationCap, Trophy, Flame, Settings, LogOut, Brain } from 'lucide-react';
import { motion } from 'motion/react';
import { db, doc, updateDoc } from '../lib/firebase';

export function Profile() {
  const { profile, logout } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [diagnosis, setDiagnosis] = React.useState(profile?.diagnosis || '');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSaveDiagnosis = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', profile.uid);
      await updateDoc(userRef, { diagnosis });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving diagnosis:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) return null;

  const stats = [
    { name: 'النقاط', value: profile.points, icon: Trophy, color: 'text-yellow-500' },
    { name: 'سلسلة الإنجاز', value: profile.streak, icon: Flame, color: 'text-orange-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12" dir="rtl">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-40 h-40 bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
          <User size={80} />
        </div>
        <div className="flex-1 text-center md:text-right">
          <h1 className="text-5xl font-black tracking-tighter mb-2">{profile.displayName}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
            <Badge variant="default" className="text-lg py-1 px-4">{profile.grade}</Badge>
            <Badge variant="secondary" className="text-lg py-1 px-4">{profile.school}</Badge>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings size={20} />
            تعديل الملف
          </Button>
          <Button variant="secondary" onClick={logout} className="flex items-center gap-2">
            <LogOut size={20} />
            تسجيل الخروج
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="flex items-center gap-6 p-8">
            <div className={`p-4 bg-zinc-100 border-2 border-black ${stat.color}`}>
              <stat.icon size={40} />
            </div>
            <div>
              <p className="text-sm font-black uppercase opacity-50">{stat.name}</p>
              <p className="text-5xl font-black">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-8 border-purple-500 border-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-purple-100 border-2 border-purple-500 text-purple-600">
            <Brain size={32} />
          </div>
          <div>
            <h3 className="text-3xl font-black">تشخيص الذكاء الاصطناعي 🧠</h3>
            <p className="font-bold opacity-60">أخبرنا عن نقاط قوتك وضعفك لنقوم بتوليد مهام مخصصة لك.</p>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <textarea
              className="w-full p-4 border-4 border-black font-bold text-lg min-h-[150px] focus:outline-none focus:ring-4 focus:ring-purple-200"
              placeholder="مثال: أنا جيد في الرياضيات ولكن أعاني من صعوبة في حفظ مصطلحات التاريخ..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
            <div className="flex gap-4">
              <Button 
                variant="primary" 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleSaveDiagnosis}
                disabled={isSaving}
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ التشخيص'}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>إلغاء</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-6 bg-zinc-50 border-2 border-dashed border-zinc-300 font-bold text-xl italic">
              {profile.diagnosis || "لم تقم بإضافة تشخيص بعد. أضف تشخيصك للحصول على مهام مخصصة!"}
            </div>
            <Button variant="outline" onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Settings size={20} />
              تعديل التشخيص
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-8">
        <h3 className="text-3xl font-black mb-8 border-b-4 border-black pb-4 inline-block">معلومات الدراسة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-100 border-2 border-black">
                <School size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase opacity-50">المؤسسة</p>
                <p className="text-xl font-bold">{profile.school}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-100 border-2 border-black">
                <GraduationCap size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase opacity-50">المستوى الدراسي</p>
                <p className="text-xl font-bold">{profile.grade}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-100 border-2 border-black">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase opacity-50">البريد الإلكتروني</p>
                <p className="text-xl font-bold">{profile.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xl font-black uppercase">المواد المختارة</h4>
            <div className="flex flex-wrap gap-3">
              {profile.subjects?.map((subject) => (
                <Badge key={subject} variant="outline" className="text-base py-2 px-4">
                  {subject}
                </Badge>
              ))}
            </div>
            
            <h4 className="text-xl font-black uppercase mt-8">أوقات الدراسة المفضلة</h4>
            <div className="flex flex-wrap gap-3">
              {profile.studyTimes?.map((time) => (
                <Badge key={time} variant="secondary" className="text-base py-2 px-4">
                  {time}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
