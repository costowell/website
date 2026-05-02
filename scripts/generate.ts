import Handlebars from 'handlebars';
import { readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const rl = createInterface({ input: stdin, output: stdout });
const id = await rl.question('ID: ');
const title = await rl.question('Title: ');
const summary = await rl.question('Summary: ');

const template_content = readFileSync('content/templates/blog.md').toString();
const template = Handlebars.compile(template_content);

const out = template({
	id,
	title,
	summary
});

const pad = (n: number) => String(n).padStart(2, '0');
const date = new Date();
const filename = `content/blog/${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}-${id}.md`;
writeFileSync(filename, out);
rl.close();
