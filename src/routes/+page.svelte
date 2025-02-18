<script lang="ts">
    import type { PageData } from "./$types.js";
    import LoginForm from "./LoginForm.svelte";
    import Sun from "lucide-svelte/icons/sun";
    import Moon from "lucide-svelte/icons/moon";
    import { toggleMode } from "mode-watcher";
    import { Button } from "$lib/components/ui/button/index.js";

    let { data }: { data: PageData } = $props();
</script>

<div>
    <!-- Header -->
    <header
        class="outline m-4 px-8 py-4 grid grid-cols-3 items-center top-0 z-10"
    >
        <div></div>

        <div class="text-xl font-bold tracking-wide text-center">QUIXCOUT</div>

        <div class="flex justify-end">
            <Button onclick={toggleMode} variant="outline" size="icon">
                <Sun
                    class="h-5 w-5 transition-opacity duration-300 dark:opacity-0"
                />
                <Moon
                    class="h-5 w-5 absolute transition-opacity duration-300 dark:opacity-100"
                />
                <span class="sr-only">Toggle theme</span>
            </Button>
        </div>
    </header>
    <div class="mx-4 md:mx-52 my-8">
        <LoginForm {data} />
    </div>
</div>
