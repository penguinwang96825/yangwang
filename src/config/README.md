# Color Theme Configuration

This directory contains configuration files that allow you to customize the color scheme of your website without modifying the codebase.

## settings.yaml

The `settings.yaml` file is the central place to define your website's color scheme for both dark and light modes. You can edit this file to change colors across the entire site.

### File Structure

The file is organized into several sections:

1. **Dark Mode Colors**: Colors used when the site is in dark mode
2. **Light Mode Colors**: Colors used when the site is in light mode
3. **Special Elements**: Additional colors for specific UI components

### How to Use

1. Edit the `settings.yaml` file using any text editor.
2. Modify color values using hex codes (e.g., `#3C435B`).
3. Save the file and restart the development server to see changes.

### Color Properties

#### Main Colors

- `background_color`: Main background color for the site
- `text_color`: Default text color
- `accent_color`: Primary accent color used for buttons and highlights

#### UI Elements

- `title_color`: Color for headings and titles
- `subtitle_color`: Color for subtitles (like your position/title)
- `description_color`: Color for paragraph text

#### Component Colors

- `block_background`: Background color for cards and content blocks
- `block_opacity`: Opacity level for block backgrounds (0.0 to 1.0)
- `border_color`: Color for borders
- `border_opacity`: Opacity level for borders (0.0 to 1.0)

#### Interactive Elements

- `button_color`: Background color for primary buttons
- `button_text_color`: Text color for buttons
- `button_hover_color`: Button color on hover
- `button_hover_opacity`: Button opacity on hover (0.0 to 1.0)

#### Links

- `link_color`: Color for links and interactive elements
- `link_hover_color`: Color for links on hover
- `link_hover_opacity`: Link opacity on hover (0.0 to 1.0)

#### Navigation

- `nav_background`: Navigation background color
- `nav_text`: Navigation text color
- `nav_active`: Active navigation item background
- `nav_active_text`: Active navigation item text color

#### Code Blocks

- `code_background`: Background color for code blocks
- `code_text`: Text color for code
- `code_header`: Header background color for code blocks

#### Special Elements

- `skill_bars`: Color for skill progress bars
- `social_icons`: Color for social media icons
- `error_message`: Color for error messages
- `success_message`: Color for success messages
- `info_message`: Color for info messages
- `math_text`: Color for math formulas

## Example

To change the accent color in dark mode to a purple shade:

```yaml
dark_mode:
  # Main Colors
  accent_color: "#6D28D9"  # Purple-600
  
  # Interactive Elements
  button_color: "#6D28D9"  # Match accent color
  button_hover_color: "#6D28D9"
  
  # Links
  link_color: "#6D28D9"
  link_hover_color: "#6D28D9"
```

## Technical Notes

- The colors are loaded when the app starts and converted to CSS variables
- If the file cannot be loaded, the site will use default colors
- You can use the browser's developer tools to preview color changes before editing the file
- For the best accessibility, ensure there's enough contrast between text and background colors 