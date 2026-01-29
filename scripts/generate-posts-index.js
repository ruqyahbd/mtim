import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDir = path.join(__dirname, '..', 'public');
const outputDir = path.join(__dirname, '..', 'src', 'data');
const outputFile = path.join(outputDir, 'posts.json');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function stripMarkdownAndHTML(text) {
    // Remove metadata lines
    let clean = text.replace(/^\[.*\](?::\/)?$/gm, '');

    // Remove the specific legacy nav block
    clean = clean.replace(/<div id="nav"[\s\S]*?<\/div>/g, '');

    // Remove HTML tags
    clean = clean.replace(/<[^>]*>?/gm, '');

    // Remove Markdown headers
    clean = clean.replace(/^#+.*$/gm, '');

    // Remove Markdown links [text](url) -> text
    clean = clean.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    // Remove other common markdown bolds/italics
    clean = clean.replace(/[*_]{1,3}/g, '');

    // Collapse whitespace
    return clean.replace(/\s+/g, ' ').trim();
}

function extractMetadata(content) {
    const metadata = {};
    const lines = content.split('\n');
    let contentStartLine = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const match = line.match(/^\[(.*?):\s*(.*?)\](?::\/)?$/);
        if (match) {
            metadata[match[1]] = match[2];
            contentStartLine = i + 1;
        } else if (line === '' && i < 15) {
            continue;
        } else {
            break;
        }
    }

    if (!metadata.title) {
        for (let i = contentStartLine; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('# ')) {
                metadata.title = line.replace('# ', '').trim();
                break;
            }
        }
    }

    return { metadata, contentStartLine };
}

const files = fs.readdirSync(postsDir);
const posts = [];

files.forEach(file => {
    if (file.endsWith('.md') && file !== 'README.md' && file !== '_Footer.md') {
        const filePath = path.join(postsDir, file);
        const stats = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { metadata } = extractMetadata(content);

        // Default date for legacy posts if metadata is missing
        const DEFAULT_LEGACY_DATE = new Date('2014-05-23');
        let postDate = DEFAULT_LEGACY_DATE;

        if (metadata.date) {
            const parsedDate = new Date(metadata.date);
            if (!isNaN(parsedDate.getTime())) {
                postDate = parsedDate;
            }
        }

        // Title Cleanup
        let postTitle = metadata.title || file.replace('.md', '').replace(/-/g, ' ');
        postTitle = postTitle.replace(/\s*-\s*muhammadtim\.com/gi, '');
        postTitle = postTitle.replace(/\s*-\s*Notes from Muhammad Tim's Lectures/gi, ' - Lecture Notes');

        const cleanContent = stripMarkdownAndHTML(content);
        const excerpt = cleanContent.substring(0, 160).trim() + (cleanContent.length > 160 ? '...' : '');

        posts.push({
            id: file.replace('.md', ''),
            filename: file,
            title: postTitle,
            slug: metadata.path || `/${file.replace('.md', '').toLowerCase()}`,
            menu: metadata.menu || null,
            order: parseInt(metadata.order) || 100,
            date: postDate,
            excerpt: excerpt
        });
    }
});

posts.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return new Date(b.date) - new Date(a.date);
});

fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
console.log(`Generated ${posts.length} posts in ${outputFile}`);
