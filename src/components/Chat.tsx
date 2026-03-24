import * as React from 'react';
import { useAuth } from '../hooks/useAuth';
import { db, collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, handleFirestoreError, OperationType } from '../lib/firebase';
import { ChatMessage } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Send, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Chat() {
  const { profile } = useAuth();
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ChatMessage));
      setMessages(msgs);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'messages');
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !profile) return;

    try {
      await addDoc(collection(db, 'messages'), {
        userId: profile.uid,
        userName: profile.displayName,
        text: newMessage,
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'messages');
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col" dir="rtl">
      <Card className="flex-1 flex flex-col overflow-hidden border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="bg-black text-white border-b-4 border-black">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            الدردشة الجماعية المباشرة 💬
          </CardTitle>
        </CardHeader>
        
        <CardContent 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.userId === profile?.uid ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black opacity-50">{msg.userName}</span>
                </div>
                <div 
                  className={`max-w-[80%] p-4 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                    msg.userId === profile?.uid 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-black'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>

        <div className="p-6 bg-white border-t-4 border-black">
          <form onSubmit={handleSendMessage} className="flex gap-4">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 border-4 border-black font-bold text-lg"
            />
            <Button 
              type="submit" 
              className="bg-black text-white px-8 hover:bg-zinc-800"
            >
              <Send size={24} />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
