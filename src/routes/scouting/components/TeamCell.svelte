<script lang="ts">
    import AlertTriangle from "lucide-svelte/icons/alert-triangle";

    type Props = {
        teamNumber: number;
        rpUpdated: boolean;
        matchesPlayed: number;
        team?: string;
        selected?: string;
    };

    let {
        teamNumber,
        rpUpdated,
        matchesPlayed,
        team = "",
        selected = $bindable(""),
    }: Props = $props();

    function selectTeam() {
        selected = String(teamNumber);
    }
</script>

<button class="flex items-center gap-2" onclick={selectTeam} title={rpUpdated ? `Team ${teamNumber}` : `Team ${teamNumber} — teammate not submitted yet`}>
    {#if matchesPlayed > 0 && !rpUpdated}
        <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white">
            <AlertTriangle size={14} />
        </span>
    {/if}
    <span class="font-medium">{teamNumber}</span>
</button>

<style>
    button:hover {
        text-decoration: underline;
    }
</style>


