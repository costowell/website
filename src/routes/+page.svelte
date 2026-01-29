<script lang="ts">
	import { wavelengthToRgb } from '$lib';
	import { onMount } from 'svelte';
	import colors from 'tailwindcss/colors';

	type Point = {
		x: number;
		y: number;
		dx: number;
		dy: number;
	};

	type Wave = {
		x: number;
		y: number;
		dx: number;
		dy: number;
		freq: number;
	};

	let c: HTMLCanvasElement;
	let points: Point[] = [];
	let waves: Wave[] = [];
	let interval: NodeJS.Timeout | undefined;

	let init = () => {
		points = [];
		waves = [];
		c.width = window.innerWidth;
		c.height = window.innerHeight;
		let ctx = c.getContext('2d');
		if (!ctx) {
			return;
		}
		ctx.fillStyle = colors.gray['900'];
		ctx.fillRect(0, 0, c.width, c.height);
		ctx.imageSmoothingEnabled = false;

		let count = (window.innerWidth * window.innerHeight) / 10000;
		for (let i = 0; i < count; ++i) {
			let x = Math.floor(Math.random() * c.width);
			let y = Math.floor(Math.random() * c.height);
			points.push({
				x,
				y,
				dx: 0,
				dy: 0
			});
		}

		let update = () => {
			let normalize = (num: number, min: number, max: number) => {
				return Math.min(max, Math.max(num, min));
			};

			// Randomly spawn wave
			if (Math.floor(Math.random() * 300) == 0) {
				if (Math.floor(Math.random() * 2) == 0) {
					waves.push({
						dx: 0.5,
						dy: Math.random() * 0.3 - 0.15,
						freq: Math.floor(Math.random() * 370) + 380,
						x: 0,
						y: Math.floor(Math.random() * window.innerHeight)
					});
				} else {
					waves.push({
						dx: -0.5,
						dy: Math.random() * 0.5 - 0.25,
						freq: Math.floor(Math.random() * 370) + 380,
						x: window.innerWidth,
						y: Math.floor(Math.random() * window.innerHeight)
					});
				}
			}

			// Update and erase points
			for (let point of points) {
				ctx.fillStyle = colors.gray['900'];
				ctx.beginPath();
				ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI, false);
				ctx.fill();

				// Change speed
				point.dx += (Math.floor(Math.random() * 3) - 1) / 100;
				point.dy += (Math.floor(Math.random() * 3) - 1) / 100;

				// Don't go tooooo fast
				point.dx = normalize(point.dx, -0.25, 0.25);
				point.dy = normalize(point.dy, -0.25, 0.25);

				// Update position
				/// xoff is like a breeze blowing from left to right
				const now = new Date();
				const time = now.getSeconds() + now.getMilliseconds() / 1000;
				const xoff = Math.cos(((time % 10) / 5) * Math.PI) / 5;
				point.x += point.dx + xoff;
				point.y += point.dy;
				if (point.x != normalize(point.x, 0, window.innerWidth)) {
					point.dx *= -1;
				}
				if (point.y != normalize(point.y, 0, window.innerHeight)) {
					point.dy *= -1;
				}
			}

			// Update
			for (let wave of waves) {
				wave.x += wave.dx;
				wave.y += wave.dy;
			}

			// Draw points
			for (let point of points) {
				ctx.fillStyle = colors.gray['100'];
				ctx.strokeStyle = colors.gray['100'];
				ctx.beginPath();
				ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI, false);
				ctx.fill();
			}
			// Draw and erase wave
			for (let [i, wave] of waves.entries()) {
				ctx.fillStyle = wavelengthToRgb(wave.freq);
				ctx.strokeStyle = ctx.fillStyle;
				ctx.beginPath();
				let y = wave.y + 5 * Math.sin((wave.x * wave.freq) / 2000);
				ctx.arc(wave.x, y, 1, 0, 2 * Math.PI, false);
				ctx.fill();

				ctx.beginPath();
				ctx.fillStyle = colors.gray['900'];
				ctx.strokeStyle = colors.gray['900'];
				let relx = 3 * ((4000 * Math.PI) / wave.freq);
				let xi;
				if (wave.dx < 0) {
					xi = wave.x + relx;
				} else {
					xi = wave.x - relx;
				}

				let yi = y - (wave.x - xi) * (wave.dy / wave.dx);
				ctx.arc(xi, yi, 2, 0, 2 * Math.PI, false);
				ctx.fill();

				if (wave.x > window.innerWidth * 1.5) {
					waves.splice(i, 1);
				}
			}
		};
		if (interval) {
			clearInterval(interval);
		}
		interval = setInterval(() => {
			update();
		}, 10);
	};
	onMount(() => {
		init();
		window.addEventListener('resize', () => {
			init();
		});
	});
</script>

<canvas bind:this={c} class="absolute h-full w-full" width="500"></canvas>

<!-- <div class="flex h-dvh items-center justify-center">
	<Card class="p-4">
		<Sidebar>
			<SidebarItem label="Projects">
				{#snippet icon()}
					<HammerSolid />
				{/snippet}
			</SidebarItem>
		</Sidebar>
	</Card>
</div> -->

<!-- <div class="flex h-dvh flex-col bg-white dark:bg-gray-900">
	<Navbar class="bg-white dark:bg-gray-900">
		<NavBrand href="/">
			<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
				Your Name
			</span>
		</NavBrand>
		<NavHamburger />
		<NavUl>
			<NavLi href="/">Home</NavLi>
			<NavLi href="/about">About</NavLi>
			<NavLi href="/projects">Projects</NavLi>
			<NavLi href="/contact">Contact</NavLi>
		</NavUl>
	</Navbar>

	<main class="flex flex-1 items-center justify-center">
		<div class="px-4 text-center">
			<h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">Welcome</h1>
			<p class="text-lg text-gray-600 dark:text-gray-400">A simple personal website</p>
		</div>
	</main>
</div> -->
