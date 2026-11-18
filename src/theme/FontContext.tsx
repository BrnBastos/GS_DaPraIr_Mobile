import { createContext, useContext } from 'react';

// A falha no carregamento de Inter não deve impedir o uso do aplicativo.
export const FontContext = createContext(false);

export function useCustomFonts() {
  return useContext(FontContext);
}
