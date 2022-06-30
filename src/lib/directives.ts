import { getCursorPosition, wait } from '$lib/utils';

type RippleParams = { enabled?: boolean; duration?: number; easing?: string; color?: string };
const defaultRippleParams = { enabled: true, duration: 800, easing: 'linear', color: '#ffffff22' };

export function ripple(el: HTMLElement, params?: RippleParams) {
	const ripples: HTMLElement[] = [];

	const createMouseHandler = (params?: RippleParams) => {
		const enabled = params?.enabled ?? defaultRippleParams.enabled;
		const duration = params?.duration || defaultRippleParams.duration;
		const color = params?.color || defaultRippleParams.color;
		const easing = params?.easing || defaultRippleParams.easing;

		return (e: any) => {
			if (!enabled) return;
			const ripple = document.createElement('div');
			const span = document.createElement('span');
			const cursor = getCursorPosition(el, e);

			ripple.className = 'ripple';
			ripple.setAttribute(
				'style',
				[
					`--x: ${cursor.x}px;`,
					`--y: ${cursor.y}px;`,
					`--diameter: ${Math.max(cursor.rect.width, cursor.rect.height) * 4}px;`,
					`--duration: ${duration}ms;`,
					`--easing: ${easing};`,
					`--color: ${color};`
				].join(' ')
			);
			ripple.appendChild(span);

			el.appendChild(ripple);
			ripples.push(ripple);

			wait(
				() => {
					ripples.forEach((r) => r.remove());
					ripples.splice(0, ripples.length);
				},
				'ripples',
				duration
			);
		};
	};

	let mouseHandler = createMouseHandler(params);
	el.addEventListener('pointerdown', mouseHandler);

	return {
		update(params?: RippleParams) {
			el.removeEventListener('pointerdown', mouseHandler);
			mouseHandler = createMouseHandler(params);
			el.addEventListener('pointerdown', mouseHandler);
		}
	};
}
