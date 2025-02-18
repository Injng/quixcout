<script>
    import { ModeWatcher } from "mode-watcher";
    import { Toaster } from "$lib/components/ui/sonner/index.js";
    import { invalidate } from "$app/navigation";
    import { onMount } from "svelte";
    import "../app.css";

    let { data, children } = $props();
    let { session, supabase } = $derived(data);

    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
            if (newSession?.expires_at !== session?.expires_at) {
                invalidate("supabase:auth");
            }
        });

        return () => data.subscription.unsubscribe();
    });
</script>

<Toaster />
<ModeWatcher />

{@render children()}
