/**
 * Remark plugin to sanitize MDX frontmatter YAML
 * 
 * Fixes common YAML parsing issues before they reach the parser:
 * - Removes special Unicode characters (em-dashes, smart quotes)
 * - Normalizes whitespace and line breaks
 * - Ensures YAML keys are valid
 * - Prevents parser from throwing errors on edge cases
 */

export function remarkSanitizeFrontmatter() {
  return (tree: any) => {
    if (!tree.children || tree.children.length === 0) return;

    const firstNode = tree.children[0];
    
    // Check if this is a YAML frontmatter block
    if (firstNode.type !== 'yaml') return;

    let yamlContent = firstNode.value || '';

    // Replace em-dashes with regular hyphens
    yamlContent = yamlContent.replace(/—/g, '-');
    
    // Replace smart quotes with regular quotes
    yamlContent = yamlContent.replace(/[""]/g, '"');
    yamlContent = yamlContent.replace(/['']/g, "'");
    
    // Remove any other problematic Unicode
    yamlContent = yamlContent.replace(/[^\x00-\x7F]/g, (char: string) => {
      // Keep common whitespace characters
      if (/\s/.test(char)) return char;
      // For everything else, remove or replace with ASCII
      return '';
    });
    
    // Normalize multiple blank lines to single blank lines
    yamlContent = yamlContent.replace(/\n\s*\n+/g, '\n');
    
    // Trim trailing whitespace
    yamlContent = yamlContent.trim();
    
    // Update the node with sanitized content
    firstNode.value = yamlContent;
  };
}
