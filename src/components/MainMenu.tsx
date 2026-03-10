import React from 'react';
import { motion } from 'motion/react';
import { User, Cpu, Globe } from 'lucide-react';

interface MainMenuProps {
  onSelectMode: (mode: 'local' | 'ai' | 'online') => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectMode }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Particles */}
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Cinematic Title */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center mb-20 z-10"
      >
        <h1 className="text-8xl font-display font-black tracking-[0.2em] text-white glow-red mb-2">
          XIANGQI
        </h1>
        <h2 className="text-3xl font-display font-bold tracking-[0.5em] text-game-red opacity-80">
          MASTER
        </h2>
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-game-red to-transparent mx-auto mt-6" />
      </motion.div>

      {/* Menu Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl z-10">
        <MenuCard
          icon={<User size={48} />}
          title="Local 1vs1"
          description="Battle a friend on a single device"
          onClick={() => onSelectMode('local')}
          delay={0.2}
        />
        <MenuCard
          icon={<Cpu size={48} />}
          title="Play vs AI"
          description="Test your skills against the machine"
          onClick={() => onSelectMode('ai')}
          delay={0.4}
        />
        <MenuCard
          icon={<Globe size={48} />}
          title="Online Play"
          description="Conquer opponents across the world"
          onClick={() => onSelectMode('online')}
          delay={0.6}
        />
      </div>

      {/* Footer Decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 text-xs tracking-[0.3em] font-display uppercase"
      >
        Modern Strategy Experience • 2026
      </motion.div>
    </div>
  );
};

interface MenuCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  delay: number;
}

const MenuCard: React.FC<MenuCardProps> = ({ icon, title, description, onClick, delay }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.8 }}
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-8 transition-all duration-500 cursor-pointer relative overflow-hidden group"
    >
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-game-red group-hover:text-white group-hover:bg-game-red transition-all duration-500 shadow-lg">
          {icon}
        </div>
        <h3 className="text-2xl font-display font-bold mb-3 tracking-wider group-hover:text-game-red transition-colors">
          {title}
        </h3>
        <p className="text-stone-400 text-sm leading-relaxed max-w-[200px]">
          {description}
        </p>
      </div>
      
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-game-red/0 via-game-red/0 to-game-red/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};
