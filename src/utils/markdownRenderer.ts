// Markdown-to-HTML parser for blog articles
export function renderMarkdown(md: string): string {
  if (!md) return '';

  // If the article is already HTML (e.g. from the recent HTML content packs)
  if (md.includes('<h2>') || md.includes('<p>') || md.includes('<section>')) {
    return md;
  }

  // Pre-process inline formatting
  const inlineFormat = (text: string): string => {
    return text
      // Bold with parentheses/italics inside: **The Secure Transparent Window (*Fenêtre Sécurisée*):**
      .replace(/\*\*([^*]+)\*([^*]+)\*([^*]+)\*\*/g, '<strong class="font-bold text-[var(--color-text-primary)]">$1<em class="italic">$2</em>$3</strong>')
      // Standard Bold + Italic: ***text***
      .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em class="italic">$1</em></strong>')
      // Standard Bold: **text**
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-[var(--color-text-primary)]">$1</strong>')
      // Italic: *text*
      .replace(/\*([^*]+)\*/g, '<em class="italic text-[var(--color-text-primary)]/90">$1</em>')
      // Italic: _text_
      .replace(/\b_([^_]+)_\b/g, '<em class="italic text-[var(--color-text-primary)]/90">$1</em>')
      // Links: [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[var(--color-accent-500)] underline hover:text-[var(--color-accent-400)] transition-colors font-medium">$1</a>');
  };

  const lines = md.split('\n');
  const out: string[] = [];
  let inUl = false;
  let inOl = false;
  let inTable = false;
  let tableRows: string[] = [];

  const flushList = () => {
    if (inUl) {
      out.push('</ul>');
      inUl = false;
    }
    if (inOl) {
      out.push('</ol>');
      inOl = false;
    }
  };

  const flushTable = () => {
    if (inTable) {
      if (tableRows.length > 0) {
        let tableHtml = '<div class="overflow-x-auto my-6 rounded-xl border border-[var(--color-border)]"><table class="w-full text-left border-collapse text-xs sm:text-sm">';
        tableRows.forEach((row, idx) => {
          const cells = row.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
          if (idx === 0) {
            tableHtml += '<thead><tr class="bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)]">';
            cells.forEach(c => {
              tableHtml += `<th class="p-3 font-bold text-[var(--color-text-primary)]">${inlineFormat(c)}</th>`;
            });
            tableHtml += '</tr></thead><tbody>';
          } else if (idx === 1 && row.includes('---')) {
            // separator row, skip
          } else {
            tableHtml += '<tr class="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-bg-secondary)] transition-colors">';
            cells.forEach(c => {
              tableHtml += `<td class="p-3 text-[var(--color-text-secondary)]">${inlineFormat(c)}</td>`;
            });
            tableHtml += '</tr>';
          }
        });
        tableHtml += '</tbody></table></div>';
        out.push(tableHtml);
      }
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushTable();
      continue;
    }

    // Horizontal Rule
    if (/^---$|^___$|^\*\*\*$/.test(line)) {
      flushList();
      flushTable();
      out.push('<hr class="border-[var(--color-border)] my-6" />');
      continue;
    }

    // Markdown Table row
    if (line.startsWith('|') && line.endsWith('|')) {
      flushList();
      inTable = true;
      tableRows.push(line);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headings
    if (line.startsWith('#### ')) {
      flushList();
      out.push(`<h4 class="text-sm sm:text-base font-bold text-[var(--color-text-primary)] font-display mt-6 mb-2">${inlineFormat(line.slice(5))}</h4>`);
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      out.push(`<h3 class="text-base sm:text-lg font-bold text-[var(--color-text-primary)] font-display mt-8 mb-3">${inlineFormat(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      out.push(`<h2 class="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] font-display mt-8 mb-4">${inlineFormat(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith('# ')) {
      flushList();
      out.push(`<h1 class="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] font-display mt-8 mb-4">${inlineFormat(line.slice(2))}</h1>`);
      continue;
    }

    // Unordered List: * or -
    const ulMatch = line.match(/^[\*\-]\s+(.*)$/);
    if (ulMatch) {
      if (inOl) flushList();
      if (!inUl) {
        out.push('<ul class="list-disc list-inside space-y-1.5 my-3 text-[var(--color-text-secondary)]">');
        inUl = true;
      }
      out.push(`<li class="leading-relaxed pl-1">${inlineFormat(ulMatch[1])}</li>`);
      continue;
    }

    // Ordered List: 1. or 2.
    const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      if (inUl) flushList();
      if (!inOl) {
        out.push('<ol class="list-decimal list-inside space-y-2.5 my-3 text-[var(--color-text-secondary)]">');
        inOl = true;
      }
      out.push(`<li class="leading-relaxed pl-1">${inlineFormat(olMatch[2])}</li>`);
      continue;
    }

    // Indented continuation line of list item
    if ((inUl || inOl) && (rawLine.startsWith('   ') || rawLine.startsWith('\t'))) {
      out.push(`<div class="pl-6 text-[var(--color-text-muted)] text-xs sm:text-sm my-1 leading-relaxed">${inlineFormat(line)}</div>`);
      continue;
    }

    // Standard paragraph
    flushList();
    out.push(`<p class="leading-relaxed text-[var(--color-text-secondary)] my-3">${inlineFormat(line)}</p>`);
  }

  flushList();
  flushTable();

  return out.join('\n');
}
