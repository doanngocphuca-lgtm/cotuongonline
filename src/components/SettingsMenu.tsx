import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, VolumeX, Monitor, Palette, Zap } from 'lucide-react';
import { soundManager, GameSettings } from '../services/soundManager';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: GameSettings) => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, onClose, onSettingsChange }) => {
  const [settings, setSettings] = React.useState<GameSettings>(soundManager.getSettings());

  const update = (patch: Partial<GameSettings>) => {
    const newSettings = { ...settings, ...patch };
    setSettings(newSettings);
    soundManager.updateSettings(patch);
    onSettingsChange(newSettings);
    soundManager.play('click');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="backdrop-blur-xl bg-stone-900/90 border border-white/10 shadow-2xl rounded-[32px] w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="text-game-gold" size={20} />
                <h2 className="text-xl font-display font-bold tracking-widest uppercase">Settings</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-stone-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Sound Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-stone-400">
                    {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  </div>
                  <div>
                    <div className="text-sm font-bold">Sound Effects</div>
                    <div className="text-xs text-stone-500">Enable in-game audio</div>
                  </div>
                </div>
                <button
                  onClick={() => update({ soundEnabled: !settings.soundEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.soundEnabled ? 'bg-game-red' : 'bg-stone-700'}`}
                >
                  <motion.div
                    animate={{ x: settings.soundEnabled ? 26 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold text-stone-500 uppercase tracking-widest">
                  <span>Volume</span>
                  <span>{Math.round(settings.volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={settings.volume}
                  onChange={(e) => update({ volume: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-game-red"
                />
              </div>

              {/* Animations Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-stone-400">
                    <Monitor size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Visual Effects</div>
                    <div className="text-xs text-stone-500">Smooth piece animations</div>
                  </div>
                </div>
                <button
                  onClick={() => update({ animationsEnabled: !settings.animationsEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.animationsEnabled ? 'bg-game-red' : 'bg-stone-700'}`}
                >
                  <motion.div
                    animate={{ x: settings.animationsEnabled ? 26 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>

              {/* Board Theme */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-stone-400">
                    <Palette size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Board Theme</div>
                    <div className="text-xs text-stone-500">Choose your visual style</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(['dark', 'light'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => update({ boardTheme: t })}
                      className={`py-3 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${
                        settings.boardTheme === t
                          ? 'bg-game-red border-game-red text-white'
                          : 'bg-white/5 border-white/10 text-stone-500 hover:border-white/20'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-black/20 text-center">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold tracking-widest uppercase transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
