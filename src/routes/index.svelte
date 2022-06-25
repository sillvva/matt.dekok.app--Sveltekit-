<script lang="ts">
	import { pageProps } from '../store';
  import Image from '../components/image.svelte';
  import Me from '../assets/images/me3x.webp'

	pageProps.set({
		bodyClass: 'mt-20'
	});
</script>

<div class="me">
  <Image src={Me} id="me" container="cover-img" />
  <div class="intro">
    <div class="intro-subject">
      <h2 class="intro-name">Matt DeKok</h2>
      <h4 class="intro-title">Full&nbsp;Stack Web&nbsp;Developer</h4>
    </div>
    <div class="menu-container hidden flex-col items-end lg:flex mt-8">
      <a href="/about">About Me</a>
      <a href="/skills">Skills</a>
      <!-- <HexMenu items={items} maxLength={3} classes={["lg:scale-100"]} itemClasses={["Bounce"]} rotated={true} /> -->
    </div>
  </div>
</div>

<style lang="scss">
	.me {
		@apply fixed inset-0 grid grid-cols-12 grid-rows-6;
		@apply bg-left-bottom bg-no-repeat bg-cover;
	}

	.intro {
		@apply col-start-6 col-span-6 row-start-2 row-span-3 2xl:col-start-5;
    @apply relative z-[2];
	}

	.intro-subject {
		@apply mt-0 fixed bottom-12 left-0 right-0 z-10 text-center lg:relative lg:text-right lg:bottom-0;
		font-family: 'Montserrat', sans-serif;
		text-shadow: 2px 2px rgb(var(--background)), 1px 1px 5px rgb(var(--background));
	}

	.intro-name {
		@apply text-3xl sm:text-5xl lg:text-5xl font-semibold tracking-widest;
		font-family: 'Montserrat', sans-serif;
	}

	.intro-title {
		@apply text-xl sm:text-3xl xl:text-4xl font-medium tracking-normal;
	}
</style>
