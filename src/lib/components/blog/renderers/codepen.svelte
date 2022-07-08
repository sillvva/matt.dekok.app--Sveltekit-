<script lang="ts">
import { onDestroy, onMount } from "svelte";
import { browser } from "$app/env";
import Message from "$lib/components/page/message.svelte";

const SCRIPT_URL = "https://static.codepen.io/assets/embed/ei.js"; // new embed
const LOAD_STATE = {
  BOOTING: "__booting__",
  ERROR: "__error__",
  LOADING: "__loading__",
  LOADED: "__loaded__"
};

export let hash: string;
export let user: string;
export let title: string = "";
export let defaultTab: string = "result";
export let height: number = 500;
export let preview: boolean = true;
export let editable: boolean = false;
export let themeId: string = "dark";
export let version: number = 2;

let _loadState = LOAD_STATE.BOOTING;
let _error = "";
let _isMounted = false;
let _isMobile = false;
const scriptId = "codepen-script";

if (browser) {
  _isMobile = !!navigator.userAgent.match(/Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i);
}

onMount(() => {
  if (!_isMounted) _isMounted = true;
  if (_isMobile) return;
  if (!browser) return;

  const codepenScript = document.getElementById(scriptId);
  if (codepenScript) return;

  const script = document.createElement("script");
  script.src = SCRIPT_URL;
  script.async = true;
  script.id = scriptId;
  script.onload = () => {
    if (!_isMounted) return;
    _loadState = LOAD_STATE.LOADED;
  };
  script.onerror = () => {
    if (!_isMounted) return;
    _loadState = LOAD_STATE.ERROR;
    _error = "Failed to load the pen";
  };

  _loadState = LOAD_STATE.LOADING;
  document.body.appendChild(script);
});

onDestroy(() => {
  if (!browser) return;
  document.getElementById(scriptId)?.remove();
});

$: penLink = `https://codepen.io/${user}/pen/${hash}/`;
$: userProfileLink = `https://codepen.io/${user}`;
</script>

<div class="codepen-container">
  {#if _loadState == LOAD_STATE.LOADING}
    <Message>Loading...</Message>
  {:else if _loadState == LOAD_STATE.ERROR}
    <Message>{_error}</Message>
  {/if}
  <div
    data-height={height}
    data-theme-id={themeId}
    data-slug-hash={hash}
    data-default-tab={defaultTab}
    data-user={user}
    data-embed-version={version}
    data-pen-title={title}
    data-preview={preview}
    data-editable={editable}
    class="codepen">
    See the <a href={penLink}>{title}</a> Pen by <a href={userProfileLink}>@{user}</a> on
    <a href="https://codepen.io">CodePen</a>.
  </div>
</div>
