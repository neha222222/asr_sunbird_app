import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  language: string;
  availableLanguages: Array<{
    code: string;
    name: string;
  }>;
}

const initialState: SettingsState = {
  language: 'en-US',
  availableLanguages: [
    { code: 'en-US', name: 'English (US)' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'es-ES', name: 'Spanish' },
  ],
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setAvailableLanguages: (
      state,
      action: PayloadAction<Array<{ code: string; name: string }>>
    ) => {
      state.availableLanguages = action.payload;
    },
  },
});

export const { setLanguage, setAvailableLanguages } = settingsSlice.actions;
export default settingsSlice.reducer; 