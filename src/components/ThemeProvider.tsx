import { ReactNode, useEffect } from 'react';
import useColorSettings from '../utils/useColorSettings';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider injects CSS variables based on the current theme settings from settings.yaml
 */
export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { colors, special, getColorWithOpacity } = useColorSettings();
  
  useEffect(() => {
    // Add CSS variables to the document root
    const root = document.documentElement;
    
    // Main colors
    root.style.setProperty('--color-background', colors.background_color);
    root.style.setProperty('--color-text', colors.text_color);
    root.style.setProperty('--color-accent', colors.accent_color);
    root.style.setProperty('--color-title', colors.title_color);
    root.style.setProperty('--color-subtitle', colors.subtitle_color);
    root.style.setProperty('--color-description', colors.description_color);
    
    // Component colors
    root.style.setProperty('--color-block', colors.block_background);
    root.style.setProperty('--color-block-alpha', getColorWithOpacity(colors.block_background, colors.block_opacity));
    root.style.setProperty('--color-border', colors.border_color);
    root.style.setProperty('--color-border-alpha', getColorWithOpacity(colors.border_color, colors.border_opacity));
    
    // Interactive elements
    root.style.setProperty('--color-button', colors.button_color);
    root.style.setProperty('--color-button-text', colors.button_text_color);
    root.style.setProperty('--color-button-hover', colors.button_hover_color);
    root.style.setProperty('--color-button-hover-alpha', getColorWithOpacity(colors.button_hover_color, colors.button_hover_opacity));
    
    // Links
    root.style.setProperty('--color-link', colors.link_color);
    root.style.setProperty('--color-link-hover', colors.link_hover_color);
    root.style.setProperty('--color-link-hover-alpha', getColorWithOpacity(colors.link_hover_color, colors.link_hover_opacity));
    
    // Navigation
    root.style.setProperty('--color-nav-bg', colors.nav_background);
    root.style.setProperty('--color-nav-text', colors.nav_text);
    root.style.setProperty('--color-nav-active', colors.nav_active);
    root.style.setProperty('--color-nav-active-text', colors.nav_active_text);
    
    // Code blocks
    root.style.setProperty('--color-code-bg', colors.code_background);
    root.style.setProperty('--color-code-text', colors.code_text);
    root.style.setProperty('--color-code-header', colors.code_header);
    
    // Special elements
    root.style.setProperty('--color-skill-bars', special.skill_bars);
    root.style.setProperty('--color-social-icons', special.social_icons);
    root.style.setProperty('--color-error', special.error_message);
    root.style.setProperty('--color-success', special.success_message);
    root.style.setProperty('--color-info', special.info_message);
    root.style.setProperty('--color-math-text', special.math_text);
    
  }, [colors, special, getColorWithOpacity]);
  
  return <>{children}</>;
} 