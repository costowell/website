<script lang="ts">
	import { onMount } from 'svelte';
	import colors from 'tailwindcss/colors';

	type Point = {
		x: number;
		y: number;
		dx: number;
		dy: number;
	};

	let c: HTMLCanvasElement;
	let points: Point[] = [];

	let init = () => {
		points = [];
		c.width = window.innerWidth;
		c.height = window.innerHeight;
		let ctx = c.getContext('2d');
		if (!ctx) {
			return;
		}
		ctx.fillStyle = colors.gray['900'];
		ctx.fillRect(0, 0, c.width, c.height);

		for (let i = 0; i < 100; ++i) {
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
			// Update and erase
			for (let i = 0; i < points.length; ++i) {
				let point = points[i];
				ctx.fillStyle = colors.gray['900'];
				ctx.beginPath();
				ctx.arc(points[i].x, points[i].y, 3, 0, 2 * Math.PI, false);
				ctx.fill();
				point.dx += (Math.floor(Math.random() * 3) - 1) / 100;
				point.dy += (Math.floor(Math.random() * 3) - 1) / 100;
				point.dx = normalize(point.dx, -0.5, 0.5);
				point.dy = normalize(point.dy, -0.5, 0.5);
				point.x += points[i].dx;
				point.y += points[i].dy;
				if (point.x != normalize(point.x, 0, c.width)) {
					point.dx *= -0.25;
				}
				if (point.y != normalize(point.y, 0, c.height)) {
					point.dy *= -0.25;
				}
			}

			// Draw
			for (let point of points) {
				ctx.fillStyle = colors.gray['100'];
				ctx.strokeStyle = colors.gray['100'];
				ctx.beginPath();
				ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI, false);
				ctx.fill();
			}
			setTimeout(() => {
				update();
			}, 10);
		};
		update();
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
