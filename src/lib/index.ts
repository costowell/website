// place files you want to import through the `$lib` alias in this folder.

// Tailwind colors as RGB
const violet = {
	400: { r: 167, g: 139, b: 250 },
	500: { r: 139, g: 92, b: 246 }
};

const sky = {
	400: { r: 56, g: 189, b: 248 },
	500: { r: 14, g: 165, b: 233 }
};

const emerald = {
	400: { r: 52, g: 211, b: 153 },
	500: { r: 16, g: 185, b: 129 }
};

const orange = {
	400: { r: 251, g: 146, b: 60 },
	500: { r: 249, g: 115, b: 22 }
};

const red = {
	500: { r: 239, g: 68, b: 68 },
	600: { r: 220, g: 38, b: 38 }
};

function lerp(
	from: { r: number; g: number; b: number },
	to: { r: number; g: number; b: number },
	t: number
) {
	return {
		r: from.r + (to.r - from.r) * t,
		g: from.g + (to.g - from.g) * t,
		b: from.b + (to.b - from.b) * t
	};
}

/**
 * Converts a light wavelength in nanometers to an RGB color string.
 * Maps the visible spectrum to vibrant Tailwind colors.
 *
 * @param wavelength - Wavelength in nanometers (380-780 nm for visible light)
 * @returns RGB color string in format "rgb(R,G,B)"
 */
export function wavelengthToRgb(wavelength: number): string {
	if (wavelength < 380 || wavelength > 780) {
		return 'rgb(0,0,0)';
	}

	let rgb: { r: number; g: number; b: number };

	if (wavelength < 450) {
		// Violet
		const t = (wavelength - 380) / (450 - 380);
		rgb = lerp(violet[400], violet[500], t);
	} else if (wavelength < 495) {
		// Blue/Sky
		const t = (wavelength - 450) / (495 - 450);
		rgb = lerp(sky[400], sky[500], t);
	} else if (wavelength < 570) {
		// Green
		const t = (wavelength - 495) / (570 - 495);
		rgb = lerp(emerald[400], emerald[500], t);
	} else if (wavelength < 620) {
		// Orange
		const t = (wavelength - 570) / (620 - 570);
		rgb = lerp(orange[400], orange[500], t);
	} else {
		// Red
		const t = (wavelength - 620) / (780 - 620);
		rgb = lerp(red[500], red[600], t);
	}

	let intensity = 1;
	if (wavelength < 420) {
		intensity = 0.3 + (0.7 * (wavelength - 380)) / 40;
	} else if (wavelength > 700) {
		intensity = 0.3 + (0.7 * (780 - wavelength)) / 80;
	}

	return `rgb(${Math.round(rgb.r * intensity)},${Math.round(rgb.g * intensity)},${Math.round(rgb.b * intensity)})`;
}
