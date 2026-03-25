import * as React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { motion, AnimatePresence } from 'motion/react';
import { School, GraduationCap, Clock, BookOpen, CheckCircle2, Brain, Sparkles } from 'lucide-react';
import { generateStudyPlan } from '../services/geminiService';
import Markdown from 'react-markdown';

export function Onboarding() {
  const { completeOnboarding, profile } = useAuth();
  const [step, setStep] = React.useState(1);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [formData, setFormData] = React.useState({
    school: '',
    grade: '',
    isRegional: false,
    studyShift: 'morning' as 'morning' | 'afternoon' | 'full',
    subjects: [] as string[],
    favoriteSubjects: [] as string[],
    struggles: '',
    studyTimes: [] as string[],
    studyPlan: '',
  });

  const grades = ["السنة الأولى باك", "السنة الثانية باك", "طالب جامعي"];
  const shifts = [
    { id: 'morning', label: 'صباحي' },
    { id: 'afternoon', label: 'مسائي' },
    { id: 'full', label: 'يوم كامل' }
  ];
  const studyTimes = ["الصباح", "الظهيرة", "المساء", "الليل"];

  const getSubjectsByGrade = (grade: string) => {
    if (grade === "السنة الأولى باك") {
      return ["اللغة العربية", "اللغة الفرنسية", "التربية الإسلامية", "الاجتماعيات"];
    } else if (grade === "السنة الثانية باك") {
      return ["الرياضيات", "الفيزياء والكيمياء", "علوم الحياة والأرض", "الفلسفة", "اللغة الإنجليزية"];
    } else if (grade === "طالب جامعي") {
      return ["الرياضيات الجامعية", "الفيزياء الجامعية", "البرمجة وعلوم الحاسوب", "الاقتصاد والتدبير", "القانون", "الطب والصيدلة", "البيولوجيا والجيولوجيا", "الآداب والعلوم الإنسانية"];
    }
    return ["الرياضيات", "الفيزياء", "الفلسفة", "اللغة الإنجليزية", "اللغة العربية", "علوم الحياة والأرض", "التربية الإسلامية", "الاجتماعيات", "اللغة الفرنسية"];
  };

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const toggleSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const toggleFavoriteSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      favoriteSubjects: prev.favoriteSubjects.includes(subject)
        ? prev.favoriteSubjects.filter(s => s !== subject)
        : [...prev.favoriteSubjects, subject]
    }));
  };

  const toggleStudyTime = (time: string) => {
    setFormData(prev => ({
      ...prev,
      studyTimes: prev.studyTimes.includes(time)
        ? prev.studyTimes.filter(t => t !== time)
        : [...prev.studyTimes, time]
    }));
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    const plan = await generateStudyPlan(formData as any);
    setFormData(prev => ({ ...prev, studyPlan: plan }));
    setIsGenerating(false);
    handleNext();
  };

  const handleSubmit = async () => {
    await completeOnboarding(formData);
  };

  const steps = [
    {
      title: "مرحباً بك في أيوب باور!",
      description: "لنبدأ بتخصيص تجربتك التعليمية. ما هو اسم مدرستك؟",
      icon: School,
      content: (
        <div className="space-y-4">
          <Input
            placeholder="اسم المدرسة أو الجامعة..."
            value={formData.school}
            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
            className="text-xl"
          />
        </div>
      )
    },
    {
      title: "في أي مستوى تدرس؟",
      description: "اختر مستواك الدراسي الحالي.",
      icon: GraduationCap,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => setFormData({ ...formData, grade, isRegional: grade.includes("الأولى باك") })}
                className={`p-4 text-right font-black text-xl border-2 border-black transition-all ${
                  formData.grade === grade ? 'bg-black text-white translate-x-1 translate-y-1 shadow-none' : 'bg-white hover:bg-zinc-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "نظام دراستك؟",
      description: "هل تدرس في الصباح أم المساء؟",
      icon: Clock,
      content: (
        <div className="grid grid-cols-1 gap-4">
          {shifts.map((shift) => (
            <button
              key={shift.id}
              onClick={() => setFormData({ ...formData, studyShift: shift.id as any })}
              className={`p-4 text-right font-black text-xl border-2 border-black transition-all ${
                formData.studyShift === shift.id ? 'bg-black text-white translate-x-1 translate-y-1 shadow-none' : 'bg-white hover:bg-zinc-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {shift.label}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "ماذا تعاني في دراستك؟",
      description: "أخبرنا عن الصعوبات التي تواجهها لنساعدك.",
      icon: Brain,
      content: (
        <div className="space-y-4">
          <textarea
            className="w-full p-4 border-4 border-black font-bold text-lg min-h-[150px] focus:outline-none focus:ring-4 focus:ring-purple-200"
            placeholder="مثال: أعاني من ضعف التركيز، صعوبة في حفظ المواد الأدبية..."
            value={formData.struggles}
            onChange={(e) => setFormData({ ...formData, struggles: e.target.value })}
          />
        </div>
      )
    },
    {
      title: "المواد المفضلة؟",
      description: "اختر المواد التي تحبها وتتفوق فيها.",
      icon: BookOpen,
      content: (
        <div className="grid grid-cols-2 gap-3">
          {getSubjectsByGrade(formData.grade).map((subject) => (
            <button
              key={subject}
              onClick={() => toggleFavoriteSubject(subject)}
              className={`p-3 text-center font-bold border-2 border-black transition-all ${
                formData.favoriteSubjects.includes(subject) ? 'bg-black text-white' : 'bg-white hover:bg-zinc-100'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "خطتك الدراسية الذكية ✨",
      description: "لقد قمنا بتوليد خطة مخصصة لك بناءً على تشخيصك.",
      icon: Sparkles,
      content: (
        <div className="prose prose-zinc max-w-none bg-zinc-50 p-6 border-4 border-black font-bold max-h-[300px] overflow-y-auto">
          <Markdown>{formData.studyPlan}</Markdown>
        </div>
      )
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-2xl overflow-hidden">
        <div className="h-2 bg-zinc-100 border-b-2 border-black">
          <motion.div
            className="h-full bg-black"
            initial={{ width: 0 }}
            animate={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                <currentStep.icon size={32} />
              </div>
              <div>
                <CardTitle className="text-3xl">{currentStep.title}</CardTitle>
                <CardDescription className="text-lg">{currentStep.description}</CardDescription>
              </div>
            </div>

            <div className="min-h-[200px]">
              {currentStep.content}
            </div>

            <div className="flex justify-between mt-12">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1 || isGenerating}
                className={step === 1 ? 'invisible' : ''}
              >
                السابق
              </Button>
              
              {step === 5 ? (
                <Button
                  onClick={handleGeneratePlan}
                  disabled={isGenerating || formData.favoriteSubjects.length === 0}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isGenerating ? 'جاري توليد الخطة...' : 'توليد الخطة الدراسية ✨'}
                </Button>
              ) : step < steps.length ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !formData.school) ||
                    (step === 2 && !formData.grade) ||
                    (step === 4 && !formData.struggles)
                  }
                >
                  التالي
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-green-500 hover:bg-green-600"
                >
                  ابدأ الآن!
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
