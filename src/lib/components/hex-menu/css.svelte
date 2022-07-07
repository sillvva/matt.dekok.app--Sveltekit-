<script lang="ts">
	import { page } from '$app/stores';
	import { conClasses } from '$lib/utils';
	import type { Item } from '$lib/types/hex-menu';

	$: pathname = $page.url.pathname;

	export let items: (Item | null)[] = [];
	export let maxLength: number;
	export let classes: string[];
	export let rotated: boolean;
	export let color: string = 'var(--menu)';
	export let hoverColor: string = 'var(--menuActive)';
	export let activeColor: string = 'var(--menuActive)';
	export let textColor: string = 'var(--menuText)';
	export let itemClasses: string[];

	let menuRows: Item[][] = [[]];
	items.forEach((item, i) => {
		const rowIndex = menuRows.length - 1;
		if (item)
			menuRows[rowIndex].push({
				...item,
				...(item.link === pathname && { active: true })
			});
		else menuRows[rowIndex].push({ link: '', label: '' });
		const rotDiff = !rotated && menuRows.length % 2 === 0 ? 1 : 0;
		if (
			maxLength >= 0 &&
			menuRows[rowIndex].length === maxLength - rotDiff &&
			items.length - 1 > i
		) {
			menuRows.push([]);
		}
	});
</script>

<div class={conClasses(['hex-wrapper', rotated && 'rotated', ...classes])}>
	{#each menuRows as row, r}
		<div class="hex-row" class:shift={r % 2 === 1 && !rotated}>
			{#each row as item}
				{#if item.label}
					<svelte:element
						this={item.link ? 'a' : 'span'}
						href={item.link}
						class={conClasses(['hex-item', ...itemClasses])}
						class:active={item.active}
						class:rotated
						style:--item-color={color}
						style:--hover-color={hoverColor}
						style:--active-color={activeColor}
						style:--text-color={textColor}
					>
						<span class="label">{item.label}</span>
						<div class="face backface face1" />
						<div class="face backface face2" />
						<div class="face backface face3" />
						<div class="face face1" />
						<div class="face face2" />
						<div class="face face3" />
					</svelte:element>
				{:else}
					<span class="hex-item empty" class:rotated />
				{/if}
			{/each}
		</div>
	{/each}
</div>

<style lang="scss">
	.hex-wrapper {
		display: inline-block;
		--scale: 0.8;
		margin: 50px 0;
		@media (max-width: 1264px) {
			--scale: 0.6;
		}
		@media (max-width: 359px) {
			--scale: 0.4;
		}
		&.rotated {
			margin: 20px 0 calc(120px * var(--tw-scale-y) * var(--scale));
		}
		.hex-row {
			display: flex;
			&.shift {
				margin-left: calc(98px * var(--tw-scale-y) * var(--scale));
			}
		}
	}

	.hex-item {
		--baseYMargin: 172px;
		--baseXMargin: 4px;
		--item-color: var(--menu);
		--active-color: var(--menuActive);
		--hover-color: var(--menuActive);
		--text-color: var(--menuText);
		position: relative;
		margin: 0 calc(var(--baseXMargin) * var(--scale)) calc(var(--baseYMargin) * var(--scale));
		width: calc(190px * var(--scale));
		height: 0;
		z-index: 1;
		text-decoration: none;
		text-align: center;
		&.active,
		&.empty {
			cursor: default;
		}
		&.empty {
			.face {
				background-color: transparent;
			}
		}
		&.active {
			.face {
				background-color: var(--active-color);
			}
		}
		&:hover,
		&:focus {
			&:not(.Empty) {
				z-index: 2;
				.face {
					background: var(--hover-color);
					transition: background-color 500ms ease, -webkit-transform 1s ease-in-out;
				}
				&:active {
					.face {
						&::after {
							opacity: 1;
						}
					}
				}
			}
		}
		.label {
			line-height: calc(110px * var(--scale));
			font-family: sans-serif;
			white-space: nowrap;
			font-size: calc(1.8em * var(--scale));
			font-weight: 600;
			text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
			color: var(--text-color);
			letter-spacing: 1px;
		}
		.face {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: calc(110px * var(--scale));
			overflow: hidden;
			background: inherit;
			background: var(--item-color);
			transition: background 0.5s linear;
			z-index: -1;
			backface-visibility: hidden;
			&::after {
				content: '';
				position: absolute;
				background-color: rgba(0, 0, 0, 0.4);
				opacity: 0;
				transition: opacity 500ms ease;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
		}
		.backface {
			transition: all;
			box-shadow: 0 0 3px rgb(var(--color-bg-body)), 0 0 8px rgb(var(--color-bg-body));
		}
		.face1 {
			transform: rotate(60deg);
		}
		.face2 {
			transform: rotate(0);
		}
		.face3 {
			transform: rotate(-60deg);
		}
		&.rotated {
			--baseYMargin: 200px;
			--baseXMargin: -8px;
			&:nth-child(2n) {
				top: calc(100px * var(--scale));
			}
			.face1 {
				transform: rotate(30deg);
			}
			.face2 {
				transform: rotate(90deg);
			}
			.face3 {
				transform: rotate(-30deg);
			}
		}
	}

	.bounce:hover:not(.active):not(.empty) {
		animation: bounce 500ms ease-in-out forwards;
		stroke: rgb(var(--color-bg-body));
		stroke-width: 0;
		.backface {
			box-shadow: none;
		}
	}
	@keyframes bounce {
		40% {
			transform: scale(1.1);
			stroke-width: 2;
		}
		60% {
			transform: scale(1);
		}
		80% {
			transform: scale(1.05);
			stroke-width: 2;
		}
		100% {
			transform: scale(1);
		}
	}
</style>
