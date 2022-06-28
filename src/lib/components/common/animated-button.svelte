<script lang="ts">
	import { conClasses } from '$lib/utils';
	import { ripple } from '$lib/directives';

	export let type: 'a' | 'button' = 'a';
	export let active = false;
	export let itemClasses: string[] = ['button-5'];
	export let color = 'var(--link)';
	export let hoverColor = 'var(--linkHover)';
	export let activeColor = 'var(--linkHover)';
	export let textColor = 'var(--linkText)';
	export let link = '';
	// export let clickRipple = false;

	$: className = conClasses(['button', ...itemClasses]);
</script>

{#if type == 'a'}
	<a
		sveltekit:prefetch
		sveltekit:noscroll
		role="button"
		href={link}
		on:click
		class={className}
		class:active
		style:--item-color={color}
		style:--hover-color={hoverColor}
		style:--active-color={activeColor}
		style:--text-color={textColor}
		use:ripple={{ active }}
	>
		<slot />
	</a>
{:else}
	<button
		type="button"
		on:click
		class={className}
		class:active
		style:--item-color={color}
		style:--hover-color={hoverColor}
		style:--active-color={activeColor}
		style:--text-color={textColor}
		use:ripple={{ active }}
	>
		<slot />
	</button>
{/if}

<style lang="scss">
	.button {
		@apply relative py-4 px-6 no-underline uppercase duration-200 ease-linear select-none;
		color: var(--text-color);
		text-shadow: 1px 1px 1px rgb(var(--background));
	}

	.button-1 {
		border-radius: 0.5rem;
		box-shadow: 0 0 0 #0ca;
		overflow: hidden;
		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			width: 0;
			height: 3px;
			background: var(--item-color);
			transition: 0.25s linear;
		}
		&.active {
			background: var(--active-color);
		}
		&:hover {
			background: var(--hover-color);
			box-shadow: 0 0 10px var(--item-color);
		}
		&:hover,
		&.active,
		&:focus {
			&::after {
				width: 100%;
			}
		}
	}

	.button-2 {
		border-radius: 0.5rem;
		box-shadow: 0 0 0 var(--item-color);
		overflow: hidden;
		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 50%;
			width: 0;
			height: 3px;
			background: var(--item-color);
			transition: 0.25s linear;
		}
		&.active {
			background: var(--active-color);
		}
		&:hover {
			background: var(--hover-color);
			box-shadow: 0 0 10px var(--item-color);
		}
		&:hover,
		&.active,
		&:focus {
			&::after {
				left: 0;
				width: 100%;
			}
		}
	}

	.button-3 {
		&::before,
		&::after {
			content: '';
			position: absolute;
			width: 0; // 1rem
			height: 0; // 1rem
			transition: 0.3s linear;
		}
		&::before {
			top: 0;
			left: 0;
			border-color: transparent;
			border-top: 0 solid var(--item-color);
			border-left: 0 solid var(--item-color);
		}
		&::after {
			bottom: 0;
			right: 0;
			border-color: transparent;
			border-bottom: 0 solid var(--item-color);
			border-right: 0 solid var(--item-color);
		}
		&.active {
			background: var(--active-color);
		}
		&:hover {
			background: var(--hover-color);
			box-shadow: 0 0 10px var(--item-color);
		}
		&:hover,
		&.active,
		&:focus {
			&::before,
			&::after {
				width: 100%;
				height: 100%;
				border-width: 3px;
			}
		}
	}

	.button-4 {
		&::before,
		&::after {
			content: '';
			position: absolute;
			width: 1rem;
			height: 1rem;
			transition: 0.3s linear;
		}
		&::before {
			top: 0;
			left: 0;
			border-color: transparent;
			border-top: 3px solid var(--item-color);
			border-left: 3px solid var(--item-color);
		}
		&::after {
			bottom: 0;
			right: 0;
			border-color: transparent;
			border-bottom: 3px solid var(--item-color);
			border-right: 3px solid var(--item-color);
		}
		&.active {
			background: var(--active-color);
		}
		&:hover {
			background: var(--hover-color);
			box-shadow: 0 0 10px var(--item-color);
		}
		&:hover,
		&.active,
		&:focus {
			&::before,
			&::after {
				width: 100%;
				height: 100%;
				border-width: 3px;
			}
		}
	}

	.button-5 {
		&::before,
		&::after {
			transition: 0.35s linear;
			content: '';
			border: 1px solid var(--item-color);
			position: absolute;
			top: 0;
			left: 0;
			width: calc(100% - 2px);
			height: calc(100% - 2px);
			opacity: 0;
		}
		&.active {
			// background: var(--active-color);
		}
		&:hover:not(.active) {
			background: var(--hover-color);
			// box-shadow: 0 0 10px var(--item-color);
		}
		&:hover,
		&:focus,
		&.active {
			&::before,
			&::after {
				opacity: 1;
			}
			&::before {
				transform: translate(-3px, -3px);
			}
			&::after {
				transform: translate(3px, 3px);
			}
		}
	}

	.button-6 {
		&::before,
		&::after {
			transition: 0.35s linear;
			content: '';
			border: 1px solid var(--item-color);
			position: absolute;
			top: 0;
			left: 0;
			width: calc(100% - 2px);
			height: calc(100% - 2px);
			opacity: 0;
		}
		&.active {
			background: var(--active-color);
		}
		&:hover:not(.active) {
			background: var(--hover-color);
		}
		&:hover,
		&:focus,
		&.active {
			&::before,
			&::after {
				opacity: 1;
				box-shadow: 0 0 10px var(--item-color);
			}
			&::before {
				transform: translate(-3px, -3px);
			}
			&::after {
				transform: translate(3px, 3px);
			}
		}
	}
</style>
