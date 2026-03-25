import * as React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { motion } from 'motion/react';
import { LogIn, Zap, Trophy, Video, Download, Smartphone, Sparkles } from 'lucide-react';

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
        className="w-full max-w-5xl flex flex-col gap-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
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
        </div>

        {/* Download App Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-2xl text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-4 border-black"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black opacity-20 rounded-full blur-2xl"></div>

          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 text-center sm:text-right">
            {/* Beautiful App Icon */}
            <div className="relative group">
              <div className="absolute inset-0 bg-white rounded-3xl blur opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center p-1.5 transform group-hover:scale-105 transition-transform duration-300 border-2 border-black/10">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
                  <Sparkles className="absolute top-1 right-1 text-white/40" size={16} />
                  <Smartphone size={44} className="text-white drop-shadow-md" strokeWidth={1.5} />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-3xl font-black mb-2 drop-shadow-sm">حمل تطبيقنا الجديد!</h3>
              <p className="text-white/90 font-bold text-lg max-w-md">
                احصل على تجربة أسرع وأفضل على هاتفك المحمول. إشعارات فورية، وتحديات حصرية للتطبيق.
              </p>
            </div>
          </div>

          <button 
            className="relative z-10 flex items-center justify-center gap-3 bg-white text-purple-700 px-8 py-5 rounded-2xl font-black text-xl hover:bg-gray-50 hover:scale-105 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-transparent hover:border-purple-200"
            onClick={(e) => {
              e.preventDefault();
              // Check if the browser supports PWA installation
              if ('BeforeInstallPromptEvent' in window) {
                 alert('يرجى الضغط على "إضافة إلى الشاشة الرئيسية" (Add to Home Screen) من قائمة المتصفح لتحميل التطبيق.');
              } else {
                 alert('لتحميل التطبيق، افتح إعدادات المتصفح (الثلاث نقاط) واختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen).');
              }
            }}
          >
            <Download size={28} className="animate-bounce" />
            تحميل التطبيق مجاناً
          </button>
        </motion.div>
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
