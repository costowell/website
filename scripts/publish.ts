import { exec } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { argv, exit } from 'node:process';

function formatDate(d: Date) {
	const pad = (n: number) => String(n).padStart(2, '0');
	const offsetHours = -5;
	const shifted = new Date(d.getTime() + offsetHours * 3600 * 1000);

	const sign = offsetHours >= 0 ? '+' : '-';
	const offset = `${sign}${pad(Math.abs(offsetHours))}:00`;

	return (
		`${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}` +
		`T${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}:${pad(shifted.getUTCSeconds())}` +
		offset
	);
}

function run(command: string) {
	return new Promise<void>((res, rej) => {
		exec(command, function (error) {
			if (error !== null) {
				return rej(error);
			}
			res();
		});
	});
}

function usage() {
	console.log('usage: bun run publish-post [content/blog/post.md]');
}

if (argv.length != 3) {
	usage();
	exit();
}

const filename = argv[2];

if (!existsSync(filename)) {
	console.error("error: File doesn't exist :(");
	exit();
}

const content = readFileSync(filename).toString().split('---\n');

const frontmatter = content[1].trim();
const meta: Record<string, string> = {};

for (const line of frontmatter.split('\n')) {
	const t = line.split(': ');
	meta[t[0]] = t[1].trim();
}
const isRevision = meta.published != '0';

const today = new Date();
meta.revised = formatDate(today); // Always change revised date,
if (!isRevision) {
	meta.published = formatDate(today);
}

let new_frontmatter = '';
for (const key in meta) {
	new_frontmatter += `${key}: ${meta[key]}\n`;
}
content[1] = new_frontmatter;

writeFileSync(filename, content.join('---\n'));

await run(`git add ${filename}`);

let commitAction;
if (isRevision) {
	commitAction = 'revise';
} else {
	commitAction = 'post';
}
await run(`git commit -m "${commitAction}: ${meta.title.replaceAll("'", '')}"`);
