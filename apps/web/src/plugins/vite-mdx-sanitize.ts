/**
 * Vite plugin to sanitize MDX files BEFORE MDX processing
 * 
 * Runs at import time to clean frontmatter and content
 * before the MDX parser sees it.
 */

export function viteMdxSanitize(): any {
  return {
    name: 'vite-mdx-sanitize',
    resolveId(id: string) {
      // Process .mdx files
      if (id.endsWith('.mdx')) {
        return id;
      }
    },
    transform(code: string, id: string) {
      // Only process .mdx files
      if (!id.endsWith('.mdx')) {
        return;
      }

      // Sanitize the MDX file content
      let sanitized = code;

      // Remove/replace problematic Unicode characters
      // Replace em-dashes with regular hyphens
      sanitized = sanitized.replace(/—/g, '-');
      
      // Replace smart quotes with regular quotes
      sanitized = sanitized.replace(/[""]/g, '"');
      sanitized = sanitized.replace(/['']/g, "'");
      
      // Remove all other non-ASCII characters except whitespace
      sanitized = sanitized.replace(/[^\x00-\x7F\n\r\t ]/g, '');
      
      // Clean up the frontmatter specifically
      // Find the frontmatter block
      const frontmatterMatch = sanitized.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        let frontmatter = frontmatterMatch[1];
        
        // Fix tagged list items with leading/trailing spaces
        // Convert "- ' voice'" to "- voice"
        frontmatter = frontmatter
          .split('\n')
          .map((line: string) => {
            // Fix list items with quoted strings containing spaces
            if (line.match(/^\s*-\s+['"`]/)) {
              // Extract just the value without surrounding quotes and spaces
              const match = line.match(/^\s*(-\s+)['"`]\s*(.+?)\s*['"`]/);
              if (match) {
                return `${match[1]}${match[2]}`;
              }
            }
            return line;
          })
          .filter((line: string) => {
            // Skip lines that are just numbers or start with digits in a way that would break YAML
            if (/^\s*\d+\s*:/.test(line)) {
              return false;
            }
            return true;
          })
          .join('\n');
        
        // Replace the frontmatter block with cleaned version
        sanitized = sanitized.replace(
          /^---\n[\s\S]*?\n---/,
          `---\n${frontmatter}\n---`
        );
      }
      
      return {
        code: sanitized,
        map: null
      };
    }
  };
}
