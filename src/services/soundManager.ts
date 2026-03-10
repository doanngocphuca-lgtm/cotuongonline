export interface GameSettings {
  soundEnabled: boolean;
  volume: number;
  animationsEnabled: boolean;
  boardTheme: 'dark' | 'light';
}

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  volume: 0.5,
  animationsEnabled: true,
  boardTheme: 'dark',
};

class SoundManager {
  private settings: GameSettings;
  private sounds: Record<string, HTMLAudioElement> = {};

  constructor() {
    const saved = localStorage.getItem('xiangqi_settings');
    this.settings = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    
    // Preload sounds
    this.preload();
  }

  private preload() {
    const soundUrls = {
      move: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
      capture: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
      win: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3',
      click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
      start: 'https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3',
    };

    Object.entries(soundUrls).forEach(([name, url]) => {
      this.sounds[name] = new Audio(url);
    });
  }

  public play(type: 'move' | 'capture' | 'win' | 'click' | 'start') {
    if (!this.settings.soundEnabled) return;
    
    const sound = this.sounds[type];
    if (sound) {
      sound.currentTime = 0;
      sound.volume = this.settings.volume;
      sound.play().catch(() => {});
    }
  }

  public getSettings(): GameSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<GameSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('xiangqi_settings', JSON.stringify(this.settings));
  }
}

export const soundManager = new SoundManager();
