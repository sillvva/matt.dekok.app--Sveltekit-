import { wait } from '$lib/utils';

type RippleParams = { enabled?: boolean; duration?: number };
const defaultRippleParams = { enabled: true, duration: 800, active: false };

export function ripple(el: HTMLElement, params?: RippleParams) {
	const duration = params?.duration || defaultRippleParams.duration;
	const ripples: HTMLElement[] = [];

	const rippleUnload = () => {
		wait(
			() => {
				ripples.forEach((r) => r.remove());
				ripples.splice(0, ripples.length);
			},
			'ripples',
			duration
		);
	};

	const createMouseHandler = (params?: RippleParams) => {
		const enabled = params?.enabled || defaultRippleParams.enabled;
		return (e: any) => {
			if (!enabled) return;
			const key = ripples.length;

			const ripple = document.createElement('div');
			const span = document.createElement('span');
			const bcr = el.getBoundingClientRect();
			const style = `--x: ${e.layerX}px; --y: ${e.layerY}px; --d: ${Math.max(bcr.width, bcr.height) * 4}px;`;

			ripple.className = 'rip-el';
			ripple.setAttribute('style', style);
			ripple.dataset.key = key.toString();
			ripple.appendChild(span);

			el.appendChild(ripple);
			ripples.push(ripple);

			rippleUnload();
		};
	};

	let mouseHandler = createMouseHandler(params);
	if (!el.classList.contains('ripple')) el.classList.add('ripple');
	el.addEventListener('pointerdown', mouseHandler);

	return {
		update(params?: RippleParams) {
			el.removeEventListener('pointerdown', mouseHandler);
			mouseHandler = createMouseHandler(params);
			el.addEventListener('pointerdown', mouseHandler);
		}
	};
}
