<script lang="ts">
	export let path: string;
	export let size: number | string = 1;
	export let color: string | null = null;
	export let flip: boolean | string | null = null;
	export let rotate = 0;
	export let spin: number | boolean = false;
	export let title = '';

	// SPIN properties
	$: inverse = typeof spin !== 'boolean' && spin < 0 ? true : false;
	$: spintime = Math.abs(spin === true ? 2 : spin || 0);
	$: spinfunc = inverse ? 'spin-inverse' : 'spin';

	// size
	if (Number(size)) size = Number(size);

	const getStyles = (
		asize: typeof size,
		acolor: typeof color = null,
		aflip: typeof flip = null,
		arotate: typeof rotate = 0
	) => {
		const transform = [];
		const styles = [];

		if (asize !== null) {
			const width = typeof asize === 'string' ? asize : `${asize * 1.5}rem`;
			styles.push(['width', width]);
			styles.push(['height', width]);
		}

		styles.push(['fill', acolor !== null ? acolor : 'currentColor']);

		if (aflip === true || aflip === 'h') {
			transform.push('scaleX(-1)');
		}

		if (aflip === true || aflip === 'v') {
			transform.push('scaleY(-1)');
		}

		if (arotate != 0) {
			transform.push(`rotate(${arotate}deg)`);
		}

		if (transform.length > 0) {
			styles.push(['transform', transform.join(' ')]);
			styles.push(['transform-origin', 'center']);
		}

		return styles.reduce((cur, item) => {
			return `${cur} ${item[0]}:${item[1]};`;
		}, '');
	};

	$: style = getStyles(size, color, flip, rotate);
</script>

<svg viewBox="0 0 24 24" {style}>
	{#if title}<title>{title}</title>{/if}
	{#if spin !== false}
		{#if inverse}
			<style>
				@keyframes spin-inverse {
					to {
						transform: rotate(-360deg);
					}
				}
			</style>
		{:else}
			<style>
				@keyframes spin {
					to {
						transform: rotate(360deg);
					}
				}
			</style>
		{/if}
		<g style={`animation: ${spinfunc} linear ${spintime}s infinite; transform-origin: center`}>
			<path d={path} />
		</g>
	{:else}
		<path d={path} />
	{/if}
</svg>

<style lang="scss">
	svg {
		@apply align-middle transition-all duration-500;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	}
</style>
