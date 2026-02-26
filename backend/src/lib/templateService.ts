import fs from 'fs/promises';
import path from 'path';

/**
 * Service for rendering email templates and converting them to plain text.
 */

/**
 * Renders a template from the src/templates directory by replacing placeholders.
 * @param templateName - The name of the template file (without extension if .html).
 * @param replacements - A record of key-value pairs to replace in the template.
 */
export async function renderTemplate(templateName: string, replacements: Record<string, string>): Promise<string> {
    const filename = templateName.endsWith('.html') ? templateName : `${templateName}.html`;
    const templatePath = path.join(__dirname, '../templates', filename);

    try {
        let content = await fs.readFile(templatePath, 'utf8');

        for (const [key, value] of Object.entries(replacements)) {
            // Support both {{key}} and {{ key }} formats
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
            content = content.replace(regex, value);
        }

        return content;
    } catch (error) {
        console.error(`Error reading template ${templateName}:`, error);
        throw new Error(`Template ${templateName} not found or unreadable.`);
    }
}

/**
 * Strips HTML tags from a string to create a plain text version.
 * @param html - The HTML content to strip.
 */
export function stripHtml(html: string): string {
    return html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove style blocks
        .replace(/<[^>]+>/g, ' ') // Replace tags with space
        .replace(/\s+/g, ' ') // Collapse whitespace
        .trim();
}
