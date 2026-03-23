import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center"
    >
      <div className="text-center space-y-6 p-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.6,
            ease: "easeOut"
          }}
        >
          <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Heart className="h-10 w-10 text-white fill-current" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-white">
            Ashram Connect
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-white/90 text-lg"
        >
          Connecting Hearts to Hope
        </motion.p>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex justify-center gap-1 mt-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="h-2 w-2 bg-white rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
