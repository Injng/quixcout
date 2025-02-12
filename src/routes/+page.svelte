<script lang="ts">
  import type { PageData } from "./$types.js";
  import LoginForm from "./LoginForm.svelte";
  import { ModeWatcher } from "mode-watcher";
  
  let { data }: { data: PageData } = $props();
</script>

<div>
  <!-- Header -->
  <div class="bg-slate-500 flex flex-row font-serif p-5 z-10">
    <a href="/" class="font-bold">QUIXCOUT</a>
  </div>
  <div class="m-52">
    <LoginForm {data} />
  </div>
</div>

