<script lang="ts">
    import type { PageData } from "./$types.js";
    import LoginForm from "./LoginForm.svelte";
    import { ModeWatcher } from "mode-watcher";

    let { data }: { data: PageData } = $props();
</script>

<div>
    <!-- Header -->
    <div class="bg-black/60 text-white flex flex-row font-serif p-5 z-10 m-5">
        <div class="font-bold grow text-center">QUIXCOUT</div>
    </div>
    <div class="mx-4 md:mx-52 my-8">
        <LoginForm {data} />
    </div>
</div>
