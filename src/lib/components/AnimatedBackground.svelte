<script lang="ts">
	import { wavelengthToRgb } from '$lib';
	import { onMount } from 'svelte';

	const BACKGROUND_COLOR = '#030712'; // gray-950
	const POINT_COLOR = '#f3f4f6'; // gray-100

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

	let canvas: HTMLCanvasElement;
	let points: Point[] = [];
	let waves: Wave[] = [];
	let interval: ReturnType<typeof setInterval> | undefined;

	function clamp(num: number, min: number, max: number) {
		return Math.min(max, Math.max(num, min));
	}

	function init() {
		points = [];
		waves = [];
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.fillStyle = BACKGROUND_COLOR;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.imageSmoothingEnabled = false;

		const count = (window.innerWidth * window.innerHeight) / 10000;
		for (let i = 0; i < count; ++i) {
			points.push({
				x: Math.floor(Math.random() * canvas.width),
				y: Math.floor(Math.random() * canvas.height),
				dx: 0,
				dy: 0
			});
		}

		if (interval) clearInterval(interval);
		interval = setInterval(() => update(ctx), 1000 / 60);
	}

	function update(ctx: CanvasRenderingContext2D) {
		spawnWave();
		updatePoints(ctx);
		updateWaves();
		drawPoints(ctx);
		drawWaves(ctx);
	}

	function spawnWave() {
		if (Math.floor(Math.random() * 100) !== 0) return;

		const goingRight = Math.random() < 0.5;
		waves.push({
			dx: goingRight ? 0.5 : -0.5,
			dy: Math.random() * (goingRight ? 0.3 : 0.5) - (goingRight ? 0.15 : 0.25),
			freq: Math.floor(Math.random() * 370) + 380,
			x: goingRight ? 0 : window.innerWidth,
			y: Math.floor(Math.random() * window.innerHeight)
		});
	}

	function updatePoints(ctx: CanvasRenderingContext2D) {
		const now = new Date();
		const time = now.getSeconds() + now.getMilliseconds() / 1000;
		const xoff = Math.cos(((time % 10) / 5) * Math.PI) / 5;

		for (const point of points) {
			// Erase old position
			ctx.fillStyle = BACKGROUND_COLOR;
			ctx.beginPath();
			ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
			ctx.fill();

			// Update velocity
			point.dx = clamp(point.dx + (Math.floor(Math.random() * 3) - 1) / 100, -0.25, 0.25);
			point.dy = clamp(point.dy + (Math.floor(Math.random() * 3) - 1) / 100, -0.25, 0.25);

			// Update position with breeze effect
			point.x += point.dx + xoff;
			point.y += point.dy;

			// Bounce off edges
			if (point.x !== clamp(point.x, 0, window.innerWidth)) point.dx *= -1;
			if (point.y !== clamp(point.y, 0, window.innerHeight)) point.dy *= -1;
		}
	}

	function updateWaves() {
		for (const wave of waves) {
			wave.x += wave.dx;
			wave.y += wave.dy;
		}
	}

	function drawPoints(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = POINT_COLOR;
		for (const point of points) {
			ctx.beginPath();
			ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
			ctx.fill();
		}
	}

	function drawWaves(ctx: CanvasRenderingContext2D) {
		for (let i = waves.length - 1; i >= 0; i--) {
			const wave = waves[i];
			const waveY = wave.y + 5 * Math.sin((wave.x * wave.freq) / 2000);

			// Draw wave head
			ctx.fillStyle = wavelengthToRgb(wave.freq);
			ctx.beginPath();
			ctx.arc(wave.x, waveY, 1, 0, 2 * Math.PI);
			ctx.fill();

			// Erase wave tail
			const tailOffset = 3 * ((4000 * Math.PI) / wave.freq);
			const tailX = wave.dx < 0 ? wave.x + tailOffset : wave.x - tailOffset;
			const tailY = waveY - (wave.x - tailX) * (wave.dy / wave.dx);

			ctx.fillStyle = BACKGROUND_COLOR;
			ctx.beginPath();
			ctx.arc(tailX, tailY, 2, 0, 2 * Math.PI);
			ctx.fill();

			// Remove off-screen waves
			if (wave.x < -window.innerWidth * 0.5 || wave.x > window.innerWidth * 1.5) {
				waves.splice(i, 1);
			}
		}
	}

	onMount(() => {
		init();
		window.addEventListener('resize', init);
		return () => {
			if (interval) clearInterval(interval);
			window.removeEventListener('resize', init);
		};
	});
</script>

<canvas bind:this={canvas} class="absolute -z-30 h-full w-full"></canvas>
