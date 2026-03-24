import * as React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { motion } from 'motion/react';
import { LogIn, Zap, Trophy, Video } from 'lucide-react';

export function Login() {
  const { login, loading } = useAuth();

  const features = [
    { icon: Trophy, text: 'تحديات دراسية يومية مخصصة لمستواك' },
    { icon: Zap, text: 'نظام نقاط وجوائز لتحفيزك على الاستمرار' },
    { icon: Video, text: 'محتوى تعليمي تفاعلي من تيك توك وإنستغرام' },
  ];

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center p-4 bg-[#F0F0F0]" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      >
        {/* Hero Content */}
        <div className="space-y-8">
          <div className="inline-block bg-black text-white px-4 py-2 text-2xl font-black tracking-tighter mb-4">
            AYOUB POWER
          </div>
          <h1 className="text-6xl font-black leading-none tracking-tighter">
            حول دراستك إلى <br />
            <span className="text-red-500">مغامرة ممتعة!</span>
          </h1>
          <p className="text-2xl font-bold opacity-70">
            المنصة التعليمية الأولى للطلاب المغاربة التي تجمع بين التعلم والترفيه.
          </p>
          
          <div className="space-y-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <feature.icon size={24} />
                </div>
                <span className="text-xl font-black">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Login Card */}
        <Card className="p-12 flex flex-col items-center text-center space-y-8">
          <div className="w-24 h-24 bg-black text-white rounded-none flex items-center justify-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
            <LogIn size={48} />
          </div>
          <div>
            <CardTitle className="text-4xl">ابدأ رحلتك الآن</CardTitle>
            <CardDescription className="text-xl mt-2">سجل دخولك باستخدام حساب جوجل للبدء.</CardDescription>
          </div>
          
          <Button 
            size="lg" 
            onClick={login} 
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 text-2xl py-6"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-8 h-8 bg-white p-1" />
            الدخول عبر جوجل
          </Button>

          <p className="text-sm font-bold opacity-50">
            بالتسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية الخاصة بنا.
          </p>
        </Card>
      </motion.div>

      {/* Social Proof */}
      <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
        <span className="text-4xl font-black">TIKTOK</span>
        <span className="text-4xl font-black">INSTAGRAM</span>
        <span className="text-4xl font-black">YOUTUBE</span>
        <span className="text-4xl font-black">STUDY MOROCCO</span>
      </div>
    </div>
  );
}
