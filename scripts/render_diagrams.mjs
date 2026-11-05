// Renders every Mermaid source using one headless browser. No app code generation.
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const toolRoot = process.env.DIAGRAM_TOOL_ROOT || root;
const require = createRequire(join(toolRoot, 'package.json'));
const { renderMermaid } = await import(pathToFileURL(require.resolve('@mermaid-js/mermaid-cli')).href);
const { default: puppeteer } = await import(pathToFileURL(require.resolve('puppeteer')).href);
const design = join(root, 'docs/part2/design');
const output = process.env.DIAGRAM_OUTPUT || join(design, 'rendered');
const index = JSON.parse(await readFile(join(design, 'diagram-index.json'), 'utf8'));
const browser = await puppeteer.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
});
const results = [];
try {
  for (const [source, [title]] of Object.entries(index)) {
    const definition = await readFile(join(design, 'diagrams', source), 'utf8');
    const target = join(output, source.replace(/\.mmd$/, '.svg'));
    await mkdir(dirname(target), { recursive: true });
    const options = {
      viewport: { width: 1800, height: 1200, deviceScaleFactor: 1 },
      mermaidConfig: {
        theme: 'default', fontFamily: 'Arial',
        flowchart: { htmlLabels: false, useMaxWidth: false },
        sequence: { useMaxWidth: false, wrap: true, width: 180, noteMargin: 20 },
        class: { useMaxWidth: false },
      },
      fontEmbed: false,
    };
    try {
      const rendered = await renderMermaid(browser, definition, 'svg', options);
      await writeFile(target, rendered.data);
      if (process.argv.includes('--png')) {
        const png = await renderMermaid(browser, definition, 'png', options);
        await writeFile(target.replace(/\.svg$/, '.png'), png.data);
      }
      results.push({ source, title, status: 'rendered' });
      console.log(`PASS ${source}`);
    } catch (error) {
      results.push({ source, title, status: 'failed', message: String(error) });
      console.error(`FAIL ${source}: ${error.message}`);
    }
  }
} finally {
  await browser.close();
}
await writeFile(join(output, 'render-results.json'), JSON.stringify(results, null, 2) + '\n');
if (results.some(item => item.status === 'failed')) process.exitCode = 1;
else console.log(`Rendered all ${results.length} diagrams into ${output}`);
