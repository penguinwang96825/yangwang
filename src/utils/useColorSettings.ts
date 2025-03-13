import { useState, useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import yaml from 'js-yaml';

// Define types for our color settings
interface ColorSettings {
  background_color: string;
  text_color: string;
  accent_color: string;
  title_color: string;
  subtitle_color: string;
  description_color: string;
  block_background: string;
  block_opacity: number;
  border_color: string;
  border_opacity: number;
  button_color: string;
  button_text_color: string;
  button_hover_color: string;
  button_hover_opacity: number;
  link_color: string;
  link_hover_color: string;
  link_hover_opacity: number;
  nav_background: string;
  nav_text: string;
  nav_active: string;
  nav_active_text: string;
  code_background: string;
  code_text: string;
  code_header: string;
}

interface SpecialColorSettings {
  skill_bars: string;
  social_icons: string;
  error_message: string;
  success_message: string;
  info_message: string;
  math_text: string;
}

export interface ThemeColors {
  colors: ColorSettings;
  special: SpecialColorSettings;
  // Helper function to get a color with opacity
  getColorWithOpacity: (color: string, opacity: number) => string;
  loading: boolean;
}

// Default colors in case the settings file fails to load
const defaultDarkColors: ColorSettings = {
  background_color: "#000000",
  text_color: "#D5B495",        // Complementary to Chathams Blue
  accent_color: "#D5B495",      // Complementary to Chathams Blue
  title_color: "#FFFFFF",
  subtitle_color: "#D5B495",    // Complementary to Chathams Blue
  description_color: "#D5B495", // Complementary to Chathams Blue
  block_background: "#000000",
  block_opacity: 0.7,
  border_color: "#000000",
  border_opacity: 0.4,
  button_color: "#D5B495",      // Complementary to Chathams Blue
  button_text_color: "#000000",
  button_hover_color: "#D5B495",// Complementary to Chathams Blue
  button_hover_opacity: 0.8,
  link_color: "#D5B495",        // Complementary to Chathams Blue
  link_hover_color: "#D5B495",  // Complementary to Chathams Blue
  link_hover_opacity: 0.8,
  nav_background: "#000000",
  nav_text: "#FFFFFF",          // White navigation text
  nav_active: "#000000",
  nav_active_text: "#FFFFFF",   // White active navigation text
  code_background: "#000000",
  code_text: "#D5B495",         // Complementary to Chathams Blue
  code_header: "#000000"
};

const defaultDarkSpecial: SpecialColorSettings = {
  skill_bars: "#D5B495",        // Complementary to Chathams Blue
  social_icons: "#D5B495",      // Complementary to Chathams Blue
  error_message: "#EF4444",
  success_message: "#10B981",
  info_message: "#3B82F6",
  math_text: "#D5B495"          // Complementary to Chathams Blue
};

const defaultLightColors: ColorSettings = {
  background_color: "#FFFFFF",
  text_color: "#1F2937",
  accent_color: "#2A4B6A",      // Chathams Blue
  title_color: "#111827",
  subtitle_color: "#2A4B6A",    // Chathams Blue
  description_color: "#4B5563",
  block_background: "#FFFFFF",
  block_opacity: 0.7,
  border_color: "#E5E7EB",
  border_opacity: 1.0,
  button_color: "#2A4B6A",      // Chathams Blue
  button_text_color: "#FFFFFF",
  button_hover_color: "#2A4B6A",// Chathams Blue
  button_hover_opacity: 0.8,
  link_color: "#2A4B6A",        // Chathams Blue
  link_hover_color: "#2A4B6A",  // Chathams Blue
  link_hover_opacity: 0.8,
  nav_background: "#FFFFFF",
  nav_text: "#4B5563",
  nav_active: "#2A4B6A",        // Chathams Blue
  nav_active_text: "#FFFFFF",
  code_background: "#F3F4F6",
  code_text: "#1F2937",
  code_header: "#2A4B6A"        // Chathams Blue
};

const defaultLightSpecial: SpecialColorSettings = {
  skill_bars: "#2A4B6A",        // Chathams Blue
  social_icons: "#2A4B6A",      // Chathams Blue
  error_message: "#EF4444",
  success_message: "#10B981",
  info_message: "#3B82F6",
  math_text: "#111827"
};

/**
 * Custom hook to get the current theme colors based on the settings.yaml file
 */
export function useColorSettings(): ThemeColors {
  const { theme } = useTheme();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/src/config/settings.yaml');
        
        if (!response.ok) {
          throw new Error('Failed to load settings file');
        }
        
        const yamlText = await response.text();
        const parsedSettings = yaml.load(yamlText);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error loading color settings:', error);
        // Use default settings on error
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  // Return the appropriate colors based on the current theme
  const colors = theme === 'dark' 
    ? (settings?.dark_mode || defaultDarkColors)
    : (settings?.light_mode || defaultLightColors);
    
  const special = theme === 'dark'
    ? (settings?.dark_mode_special || defaultDarkSpecial)
    : (settings?.light_mode_special || defaultLightSpecial);
  
  // Helper function to get a color with opacity
  const getColorWithOpacity = (color: string, opacity: number): string => {
    // Convert hex to rgb
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  
  return { colors, special, getColorWithOpacity, loading };
}

export default useColorSettings; 