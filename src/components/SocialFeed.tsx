import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Video, Instagram, Zap, Heart, MessageCircle, Share2, Play } from 'lucide-react';
import { motion } from 'motion/react';

export function SocialFeed() {
  const [playingVideoId, setPlayingVideoId] = React.useState<string | null>(null);

  const videos = [
    {
      id: '1',
      title: 'كيف تذاكر بذكاء وليس بجهد؟ 🧠',
      description: 'أفضل النصائح لتنظيم الوقت والمذاكرة بفعالية مع أحمد أبو زيد.',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=p60rN9n382s',
      embedUrl: 'https://www.youtube.com/embed/p60rN9n382s?autoplay=1',
      thumbnail: 'https://img.youtube.com/vi/p60rN9n382s/hqdefault.jpg',
      likes: '250K',
      comments: '12K',
    },
    {
      id: '2',
      title: 'تقنيات الحفظ السريع وعدم النسيان 📝',
      description: 'تعلم كيف تحفظ دروسك بسرعة البرق مع علي محمد علي.',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=mY8S0W8zYyI',
      embedUrl: 'https://www.youtube.com/embed/mY8S0W8zYyI?autoplay=1',
      thumbnail: 'https://img.youtube.com/vi/mY8S0W8zYyI/hqdefault.jpg',
      likes: '180K',
      comments: '8K',
    },
    {
      id: '3',
      title: 'خطة المراجعة النهائية للامتحانات 📚',
      description: 'كيف تراجع مادة كاملة في وقت قصير جداً وتضمن التفوق.',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=Xv_vT8YvS-I',
      embedUrl: 'https://www.youtube.com/embed/Xv_vT8YvS-I?autoplay=1',
      thumbnail: 'https://img.youtube.com/vi/Xv_vT8YvS-I/hqdefault.jpg',
      likes: '320K',
      comments: '15K',
    },
    {
      id: '4',
      title: 'نصائح ليلة الامتحان والتعامل مع التوتر 🧘‍♂️',
      description: 'كيف تحافظ على هدوئك وتحصل على أعلى الدرجات.',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=8v_vT8YvS-I',
      embedUrl: 'https://www.youtube.com/embed/8v_vT8YvS-I?autoplay=1',
      thumbnail: 'https://img.youtube.com/vi/8v_vT8YvS-I/hqdefault.jpg',
      likes: '95K',
      comments: '3K',
    },
  ];

  return (
    <div className="space-y-12" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h1 className="text-5xl font-black tracking-tighter text-white">
          فيديوهات <span className="gold-text">أيوب باور</span> 🎬
        </h1>
        <div className="flex gap-4">
          <a href="https://tiktok.com/@ayoub_yas2al" target="_blank" rel="noreferrer">
            <Button className="gold-bg hover:opacity-90 flex items-center gap-2 border-none">
              <Zap size={20} />
              TikTok
            </Button>
          </a>
          <a href="https://instagram.com/ayoub_powere" target="_blank" rel="noreferrer">
            <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 flex items-center gap-2">
              <Instagram size={20} />
              Instagram
            </Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {videos.map((video, i) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-0 overflow-hidden group glass-card gold-border">
              <div className="aspect-video bg-zinc-800 relative overflow-hidden border-b border-[#D4AF37]/20">
                {playingVideoId === video.id ? (
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <>
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                      referrerPolicy="no-referrer"
                      onClick={() => setPlayingVideoId(video.id)}
                    />
                    <div 
                      className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center cursor-pointer"
                      onClick={() => setPlayingVideoId(video.id)}
                    >
                      <div className="w-20 h-20 bg-[#D4AF37] text-black rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                        <Play size={40} fill="currentColor" className="ml-2" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 pointer-events-none">
                      <Badge className="gold-bg border-none text-xs py-1 px-3">
                        {video.platform}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black mb-3 gold-text">{video.title}</h3>
                <p className="text-xl font-bold text-white/70 mb-6">{video.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 font-black text-white/80">
                      <Heart size={20} className="text-red-500" />
                      {video.likes}
                    </div>
                    <div className="flex items-center gap-2 font-black text-white/80">
                      <MessageCircle size={20} className="text-blue-500" />
                      {video.comments}
                    </div>
                  </div>
                  {playingVideoId !== video.id && (
                    <Button 
                      onClick={() => setPlayingVideoId(video.id)}
                      className="gold-bg hover:opacity-90 text-black font-black px-8 py-6 text-lg rounded-xl border-none flex items-center gap-2"
                    >
                      شاهد الآن
                      <Play size={20} fill="currentColor" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Social Call to Action */}
      <Card className="bg-zinc-900 p-12 text-center space-y-6 glass-card gold-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 gold-bg" />
        <h2 className="text-5xl font-black uppercase tracking-tighter gold-text">انضم إلى مجتمعنا التعليمي 🚀</h2>
        <p className="text-2xl font-bold text-white/80 max-w-2xl mx-auto">
          تابعنا على وسائل التواصل الاجتماعي للحصول على نصائح يومية، تحديات جديدة، ومحتوى حصري يساعدك في رحلتك الدراسية.
        </p>
        <div className="flex flex-wrap justify-center gap-6 pt-4">
          <a href="https://tiktok.com/@ayoub_yas2al" target="_blank" rel="noreferrer">
            <Button size="lg" className="gold-bg hover:opacity-90 text-2xl px-12 border-none text-black font-black">
              متابعة على TikTok
            </Button>
          </a>
          <a href="https://instagram.com/ayoub_powere" target="_blank" rel="noreferrer">
            <Button size="lg" variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all text-2xl px-12 font-black">
              متابعة على Instagram
            </Button>
          </a>
        </div>
      </Card>
    </div>
  );
}
