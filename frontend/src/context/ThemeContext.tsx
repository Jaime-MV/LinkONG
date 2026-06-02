/* LinkONG Global Styling Dynamic Palette Context */
import React, { createContext, useContext, useState, useEffect } from 'react';

export type PaletteType = 'palette-1' | 'palette-2' | 'palette-3';

interface ThemeContextType {
  palette: PaletteType;
  setPalette: (palette: PaletteType) => void;
  paletteName: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [palette, setPaletteState] = useState<PaletteType>(() => {
    const saved = localStorage.getItem('lk_palette') as PaletteType;
    return (saved === 'palette-1' || saved === 'palette-2' || saved === 'palette-3') 
      ? saved 
      : 'palette-2'; // Default: Comunidad y Empatía
  });

  useEffect(() => {
    // Sync class on document.body
    document.body.classList.remove('palette-1', 'palette-2', 'palette-3');
    document.body.classList.add(palette);
    localStorage.setItem('lk_palette', palette);
  }, [palette]);

  const setPalette = (newPalette: PaletteType) => {
    setPaletteState(newPalette);
  };

  const getPaletteName = () => {
    switch (palette) {
      case 'palette-1': return 'Confianza y Cuidado';
      case 'palette-2': return 'Comunidad y Empatía';
      case 'palette-3': return 'Neutral y Autoritaria';
      default: return 'Comunidad y Empatía';
    }
  };

  return (
    <ThemeContext.Provider value={{ palette, setPalette, paletteName: getPaletteName() }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe utilizarse dentro de un ThemeProvider');
  }
  return context;
};
