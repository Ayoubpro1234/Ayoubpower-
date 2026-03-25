import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, MessageCircle, Share2, Play, CheckCircle2, XCircle, BarChart2, Lightbulb, Brain, Video } from 'lucide-react';
import { cn } from '../lib/utils';

// --- Types ---
type StoryType = 'quiz' | 'tip' | 'fact' | 'poll' | 'video';

interface StoryContent {
  id: string;
  type: StoryType;
  title: string;
  text?: string;
  options?: { id: string; text: string; isCorrect?: boolean; votes?: number }[];
  videoUrl?: string;
  bgGradient: string;
  icon: React.ElementType;
}

interface StoryGroup {
  id: string;
  author: string;
  avatar: string;
  isViewed: boolean;
  stories: StoryContent[];
}

// --- Video Player Component ---
const VideoPlayer = ({ 
  story, 
  isPaused, 
  setIsPaused, 
  handleNext, 
  setProgress 
}: { 
  story: StoryContent, 
  isPaused: boolean, 
  setIsPaused: (p: boolean) => void, 
  handleNext: () => void, 
  setProgress: (p: number) => void 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPaused) {
      video.pause();
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Ignore AbortError which happens when the component unmounts before playing
          if (error.name !== 'AbortError') {
            console.error('Video play error:', error);
          }
        });
      }
    }
  }, [isPaused]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-sm aspect-[9/16] bg-black rounded-2xl border-4 border-white/20 relative overflow-hidden shadow-2xl cursor-pointer shrink-0"
      onClick={(e) => {
        e.stopPropagation();
        setIsPaused(!isPaused);
      }}
    >
      <video
        ref={videoRef}
        src={story.videoUrl}
        className="w-full h-full object-cover"
        playsInline
        onEnded={() => handleNext()}
        onTimeUpdate={(e) => {
          const video = e.currentTarget;
          if (video.duration) {
            setProgress((video.currentTime / video.duration) * 100);
          }
        }}
      />
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
          <Play size={64} className="text-white drop-shadow-lg" />
        </div>
      )}
    </motion.div>
  );
};

// --- Mock Data ---
const STORY_GROUPS: StoryGroup[] = [
  {
    id: '1',
    author: 'تحدي سريع',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=quiz&backgroundColor=ffdfbf',
    isViewed: false,
    stories: [
      {
        id: 's1',
        type: 'quiz',
        title: 'سؤال في الرياضيات',
        text: 'ما هو حل المعادلة: 2x + 5 = 15 ؟',
        options: [
          { id: 'o1', text: 'x = 5', isCorrect: true },
          { id: 'o2', text: 'x = 10', isCorrect: false },
          { id: 'o3', text: 'x = 2', isCorrect: false },
        ],
        bgGradient: 'from-blue-600 to-indigo-800',
        icon: Brain
      }
    ]
  },
  {
    id: '2',
    author: 'نصيحة اليوم',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=tip&backgroundColor=c0aede',
    isViewed: false,
    stories: [
      {
        id: 's2',
        type: 'tip',
        title: 'تقنية بومودورو 🍅',
        text: 'ادرس لمدة 25 دقيقة بتركيز تام، ثم خذ استراحة لمدة 5 دقائق. كرر العملية 4 مرات ثم خذ استراحة طويلة (15-30 دقيقة). هذا سيضاعف تركيزك!',
        bgGradient: 'from-emerald-500 to-teal-700',
        icon: Lightbulb
      }
    ]
  },
  {
    id: '3',
    author: 'هل تعلم؟',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=fact&backgroundColor=ffdfbf',
    isViewed: false,
    stories: [
      {
        id: 's3',
        type: 'fact',
        title: 'معلومة تاريخية 🇲🇦',
        text: 'جامعة القرويين في مدينة فاس هي أقدم جامعة في العالم لا تزال تعمل حتى الآن، وقد أسستها فاطمة الفهرية عام 859م.',
        bgGradient: 'from-amber-500 to-orange-700',
        icon: Lightbulb
      }
    ]
  },
  {
    id: '4',
    author: 'استطلاع رأي',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=poll&backgroundColor=b6e3f4',
    isViewed: false,
    stories: [
      {
        id: 's4',
        type: 'poll',
        title: 'متى تفضل المذاكرة؟',
        text: 'شاركنا رأيك لنقوم بتخصيص التحديات لك!',
        options: [
          { id: 'p1', text: 'في الصباح الباكر 🌅', votes: 65 },
          { id: 'p2', text: 'بعد الظهر ☀️', votes: 15 },
          { id: 'p3', text: 'في وقت متأخر من الليل 🌙', votes: 20 },
        ],
        bgGradient: 'from-purple-600 to-fuchsia-800',
        icon: BarChart2
      }
    ]
  },
  {
    id: '5',
    author: 'شرح سريع',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=video&backgroundColor=ffd5dc',
    isViewed: false,
    stories: [
      {
        id: 's5',
        type: 'video',
        title: 'كيف تحفظ المصطلحات بسرعة؟',
        text: 'شاهد هذا الفيديو القصير لتعلم تقنية الربط الذهني.',
        videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        bgGradient: 'from-rose-500 to-pink-700',
        icon: Video
      }
    ]
  }
];

const STORY_DURATION = 8000; // 8 seconds per story

export function Stories() {
  const [groups, setGroups] = useState(STORY_GROUPS);
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [interacted, setInteracted] = useState(false); // If user clicked a poll/quiz

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentStory = activeGroupIndex !== null ? groups[activeGroupIndex].stories[activeStoryIndex] : null;
  const isVideo = currentStory?.type === 'video';

  // Handle Progress Timer
  useEffect(() => {
    if (activeGroupIndex === null || isPaused || interacted || isVideo) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const updateInterval = 50; // Update every 50ms
    const step = (updateInterval / STORY_DURATION) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, updateInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeGroupIndex, activeStoryIndex, isPaused, interacted]);

  const handleNext = () => {
    if (activeGroupIndex === null) return;
    
    const currentGroup = groups[activeGroupIndex];
    
    if (activeStoryIndex < currentGroup.stories.length - 1) {
      // Next story in same group
      setActiveStoryIndex(prev => prev + 1);
      setProgress(0);
      setInteracted(false);
    } else {
      // Next group
      markGroupAsViewed(activeGroupIndex);
      if (activeGroupIndex < groups.length - 1) {
        setActiveGroupIndex(prev => prev! + 1);
        setActiveStoryIndex(0);
        setProgress(0);
        setInteracted(false);
      } else {
        // Close stories
        closeStories();
      }
    }
  };

  const handlePrev = () => {
    if (activeGroupIndex === null) return;

    if (activeStoryIndex > 0) {
      // Prev story in same group
      setActiveStoryIndex(prev => prev - 1);
      setProgress(0);
      setInteracted(false);
    } else {
      // Prev group
      if (activeGroupIndex > 0) {
        setActiveGroupIndex(prev => prev! - 1);
        const prevGroup = groups[activeGroupIndex - 1];
        setActiveStoryIndex(prevGroup.stories.length - 1);
        setProgress(0);
        setInteracted(false);
      } else {
        setProgress(0);
      }
    }
  };

  const openStory = (index: number) => {
    setActiveGroupIndex(index);
    setActiveStoryIndex(0);
    setProgress(0);
    setInteracted(false);
  };

  const closeStories = () => {
    if (activeGroupIndex !== null) {
      markGroupAsViewed(activeGroupIndex);
    }
    setActiveGroupIndex(null);
    setProgress(0);
  };

  const markGroupAsViewed = (index: number) => {
    setGroups(prev => {
      const newGroups = [...prev];
      newGroups[index].isViewed = true;
      return newGroups;
    });
  };

  // --- Renderers ---

  const renderStoryContent = (story: StoryContent) => {
    const Icon = story.icon;

    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6 text-white text-center z-10 relative">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 p-4 bg-white/20 rounded-full backdrop-blur-sm"
        >
          <Icon size={48} className="text-white" />
        </motion.div>
        
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-black mb-4 drop-shadow-lg"
        >
          {story.title}
        </motion.h2>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-medium mb-8 opacity-90 drop-shadow-md max-w-sm"
        >
          {story.text}
        </motion.p>

        {/* Quiz & Poll Options */}
        {(story.type === 'quiz' || story.type === 'poll') && story.options && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-sm space-y-3"
          >
            {story.options.map((option, idx) => (
              <button
                key={option.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setInteracted(true);
                }}
                className={cn(
                  "w-full p-4 rounded-xl font-bold text-lg transition-all flex items-center justify-between",
                  interacted 
                    ? story.type === 'quiz'
                      ? option.isCorrect 
                        ? "bg-green-500 text-white" 
                        : "bg-red-500/80 text-white"
                      : "bg-white/30 text-white" // Poll interacted
                    : "bg-white text-black hover:bg-gray-100 active:scale-95"
                )}
              >
                <span>{option.text}</span>
                {interacted && story.type === 'quiz' && (
                  option.isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />
                )}
                {interacted && story.type === 'poll' && (
                  <span className="text-sm bg-black/20 px-2 py-1 rounded-md">{option.votes}%</span>
                )}
              </button>
            ))}
          </motion.div>
        )}

        {/* Actual Video Player */}
        {story.type === 'video' && story.videoUrl && (
          <VideoPlayer 
            story={story} 
            isPaused={isPaused} 
            setIsPaused={setIsPaused} 
            handleNext={handleNext} 
            setProgress={setProgress} 
          />
        )}

        {/* Continue Button if interacted */}
        {interacted && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="mt-8 px-8 py-3 bg-white text-black rounded-full font-bold text-lg shadow-lg active:scale-95 transition-transform"
          >
            متابعة
          </motion.button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full mb-8" dir="rtl">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-xl font-black">حالات اليوم 🔥</h2>
        <span className="text-sm font-bold text-gray-500">جديد</span>
      </div>

      {/* Story Tray (Horizontal Scroll) */}
      <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide snap-x">
        {groups.map((group, index) => (
          <div 
            key={group.id} 
            className="flex flex-col items-center gap-2 cursor-pointer snap-start shrink-0"
            onClick={() => openStory(index)}
          >
            <div className={cn(
              "w-20 h-20 rounded-full p-1 transition-transform hover:scale-105",
              group.isViewed ? "bg-gray-300" : "bg-gradient-to-tr from-red-500 via-pink-500 to-amber-500"
            )}>
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
                <img src={group.avatar} alt={group.author} className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-xs font-bold text-center w-20 truncate">{group.author}</span>
          </div>
        ))}
      </div>

      {/* Story Viewer (Full Screen Modal) */}
      <AnimatePresence>
        {activeGroupIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center sm:p-4"
            dir="rtl"
          >
            {/* Mobile-like container */}
            <div className="w-full h-full sm:w-[400px] sm:h-[800px] sm:max-h-[90vh] bg-zinc-900 sm:rounded-3xl relative overflow-hidden shadow-2xl">
              
              {/* Background Gradient */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-80 transition-colors duration-500",
                groups[activeGroupIndex].stories[activeStoryIndex].bgGradient
              )} />

              {/* Progress Bars */}
              <div className="absolute top-0 left-0 right-0 p-4 flex gap-1 z-20">
                {groups[activeGroupIndex].stories.map((_, idx) => (
                  <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-100 ease-linear"
                      style={{ 
                        width: idx === activeStoryIndex ? `${progress}%` : idx < activeStoryIndex ? '100%' : '0%' 
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Header */}
              <div className="absolute top-6 left-0 right-0 p-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white border-2 border-white/50">
                    <img src={groups[activeGroupIndex].avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-white font-bold text-shadow-sm">{groups[activeGroupIndex].author}</span>
                </div>
                <button 
                  onClick={closeStories}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Tap Areas for Navigation */}
              <div className="absolute inset-0 z-0 flex">
                <div 
                  className="w-1/3 h-full" 
                  onClick={handleNext} // RTL: Right side goes next
                  onPointerDown={() => setIsPaused(true)}
                  onPointerUp={() => setIsPaused(false)}
                  onPointerLeave={() => setIsPaused(false)}
                />
                <div 
                  className="w-1/3 h-full" 
                  onPointerDown={() => setIsPaused(true)}
                  onPointerUp={() => setIsPaused(false)}
                  onPointerLeave={() => setIsPaused(false)}
                />
                <div 
                  className="w-1/3 h-full" 
                  onClick={handlePrev} // RTL: Left side goes prev
                  onPointerDown={() => setIsPaused(true)}
                  onPointerUp={() => setIsPaused(false)}
                  onPointerLeave={() => setIsPaused(false)}
                />
              </div>

              {/* Content */}
              {renderStoryContent(groups[activeGroupIndex].stories[activeStoryIndex])}

              {/* Bottom Actions */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end z-20 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex gap-4">
                  <button className="flex flex-col items-center gap-1 text-white hover:text-red-400 transition-colors">
                    <Heart size={28} />
                    <span className="text-xs font-bold">إعجاب</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 text-white hover:text-blue-400 transition-colors">
                    <MessageCircle size={28} />
                    <span className="text-xs font-bold">تعليق</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 text-white hover:text-green-400 transition-colors">
                    <Share2 size={28} />
                    <span className="text-xs font-bold">مشاركة</span>
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
