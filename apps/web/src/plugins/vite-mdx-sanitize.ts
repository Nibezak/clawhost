import fs from 'fs';

/**
 * Vite plugin to sanitize MDX files BEFORE MDX processing
 * 
 * Uses load hook to intercept file loading and sanitize content
 * before the MDX parser sees it.
 */

function sanitizeYAML(content: string): string {
  // Remove/replace problematic Unicode characters
  let sanitized = content;
  
  // Replace em-dashes with regular hyphens
  sanitized = sanitized.replace(/—/g, '-');
  
  // Replace smart quotes with regular quotes
  sanitized = sanitized.replace(/[""]/g, '"');
  sanitized = sanitized.replace(/['']/g, "'");
  
  // Remove all other non-ASCII characters except whitespace
  sanitized = sanitized.replace(/[^\x00-\x7F\n\r\t ]/g, '');
  
  // Clean up the frontmatter specifically
  const frontmatterMatch = sanitized.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    let frontmatter = frontmatterMatch[1];
    
    // Process each line to fix common YAML issues
    frontmatter = frontmatter
      .split('\n')
      .map((line: string) => {
        // Fix list items with quoted strings containing spaces
        // Convert "- ' voice'" to "- voice"
        if (line.match(/^\s*-\s+['"`]/)) {
          const match = line.match(/^\s*(-\s+)['"`]\s*(.+?)\s*['"`]/);
          if (match) {
            return `${match[1]}${match[2]}`;
          }
        }
        
        // Fix any lines that look like they might have numbers where YAML keys should be
        // Skip lines that start with just digits
        if (/^\s*\d+\s*:/.test(line)) {
          return '# ' + line; // Comment out invalid lines
        }
        
        return line;
      })
      .join('\n');
    
    // Replace the frontmatter block with cleaned version
    sanitized = sanitized.replace(
      /^---\n[\s\S]*?\n---/,
      `---\n${frontmatter}\n---`
    );
  }
  
  return sanitized;
}

export function viteMdxSanitize(): any {
  return {
    name: 'vite-mdx-sanitize',
    enforce: 'pre', // Run before other plugins
    
    async load(id: string) {
      // Only process .mdx files
      if (!id.endsWith('.mdx')) {
        return null;
      }
      
      try {
        // Read the file directly
        const content = fs.readFileSync(id, 'utf-8');
        
        // Sanitize the content
        const sanitized = sanitizeYAML(content);
        
        // Return the sanitized content
        return {
          code: sanitized,
          map: null
        };
      } catch (error) {
        console.error(`Error loading MDX file ${id}:`, error);
        return null;
      }
    }
  };
}
