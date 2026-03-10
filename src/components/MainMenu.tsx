import React from "react";
import { motion } from "framer-motion";
import { User, Cpu, Globe } from "lucide-react";

interface MainMenuProps {
  onSelectMode: (mode: "local" | "ai" | "online") => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectMode }) => {

  const menuItems = [
    {
      icon: <User size={48} />,
      title: "Local 1vs1",
      description: "Battle a friend on the same device",
      mode: "local" as const
    },
    {
      icon: <Cpu size={48} />,
      title: "Play vs AI",
      description: "Test your strategy against the machine",
      mode: "ai" as const
    },
    {
      icon: <Globe size={48} />,
      title: "Online Play",
      description: "Play with players around the world",
      mode: "online" as const
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">

      {/* TITLE */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <h1 className="text-7xl font-bold tracking-widest text-white">
          XIANGQI
        </h1>

        <h2 className="text-2xl tracking-[0.4em] text-red-500 mt-2">
          MASTER
        </h2>
      </motion.div>

      {/* MENU */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">

        {menuItems.map((item, index) => (
          <MenuCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            description={item.description}
            delay={index * 0.2}
            onClick={() => onSelectMode(item.mode)}
          />
        ))}

      </div>

    </div>
  );
};


interface MenuCardProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
  delay: number
}

const MenuCard: React.FC<MenuCardProps> = ({
  icon,
  title,
  description,
  onClick,
  delay
}) => {

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center shadow-xl hover:border-red-500 transition-all"
    >

      <div className="flex justify-center mb-6 text-red-500">
        {icon}
      </div>

      <h3 className="text-xl font-bold mb-2">{title}</h3>

      <p className="text-gray-400 text-sm">
        {description}
      </p>

    </motion.div>
  )
}