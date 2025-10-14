<script lang="ts">
    import * as Form from "$lib/components/ui/form/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { type Infer } from "sveltekit-superforms";
    import { type ScoutingSchema } from "../schema/schema";
    import type { FsSuperForm } from "formsnap";
    import type { Writable } from "svelte/store";
    import { get } from "svelte/store";
    import { rampSlots as autonRampSlots } from "./rampStore";

    export let form: FsSuperForm<Infer<ScoutingSchema>>;
    export let formData: Writable<Infer<ScoutingSchema>>;

    // Ramp slots selection for classified artifacts (Green/Purple/None)
    let rampSlots: ("N" | "G" | "P")[] = Array(9).fill("N");
    let prevClassified = 0;
    function updateClassifiedCount() {
        $formData.teleop_classified_artifacts = prevClassified + rampSlots.filter((s) => s !== "N").length;
    }
    function setSlot(idx: number, value: "N" | "G" | "P") {
        rampSlots[idx] = value;
        updateClassifiedCount();
        updatePatternCount();
    }
    function clearSlot(idx: number) {
        setSlot(idx, "N");
        updatePatternCount();
    }
    function clearRamp() {
        rampSlots = Array(9).fill("N");
        prevClassified = $formData.teleop_classified_artifacts;
        updateClassifiedCount();
        updatePatternCount();
    }
    function copyAutonRamp() {
        const src = get(autonRampSlots);
        rampSlots = [...src];
        updatePatternCount();
    }

    // Count patterns based on motif
    let patternCount = $formData.auton_patterns;
    function updatePatternCount() {
        patternCount = 0;
        let currPattern = "";
        for (let i = 0; i <= 6; i += 3) {
            currPattern += rampSlots[i] + rampSlots[i + 1] + rampSlots[i + 2];
            if (currPattern == $formData.motif) {
                patternCount++;
            }
            currPattern = "";
        }
        $formData.teleop_patterns = patternCount;
    }
</script>

<Form.Field {form} name="teleop_classified_artifacts" class="mb-5">
    <Form.Control>
        {#snippet children({ props })}
            <Form.Label>Auton Ramp</Form.Label>
            <div class="flex items-center mb-2 gap-2">
                <span class="text-sm opacity-80">Classified Count:</span>
                <span class="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-sm">{$formData.teleop_classified_artifacts ?? 0}</span>
                <Button type="button" variant="secondary" size="sm" onclick={clearRamp}>Open Gate</Button>
                <Button type="button" variant="secondary" size="sm" onclick={copyAutonRamp}>Copy Auton Ramp</Button>
            </div>
            <div class="flex items-center mb-2 gap-2">
                <span class="text-sm opacity-80">Pattern Count:</span>
                <span class="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-sm">{$formData.teleop_patterns}</span>
            </div>
            <div class="flex flex-wrap gap-3">
                {#each rampSlots as slot, i (i)}
                    <div class="flex flex-col items-center gap-2">
                        <div class="text-xs mb-1">Slot {i + 1}</div>
                        <div class="grid grid-rows-3 items-center gap-1">
                            <button type="button" class={`w-8 h-8 rounded-full border ${slot === "G" ? "bg-green-600 text-white" : "bg-transparent"}`} onclick={() => setSlot(i, "G")}>G</button>
                            <button type="button" class={`w-8 h-8 rounded-full border ${slot === "P" ? "bg-purple-600 text-white" : "bg-transparent"}`} onclick={() => setSlot(i, "P")}>P</button>
                            <button type="button" class="w-8 h-8 rounded-full border" title="Clear" onclick={() => clearSlot(i)}>&times;</button>
                        </div>
                    </div>
                {/each}
            </div>
        {/snippet}
    </Form.Control>
    <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="teleop_overflow_artifacts">
    <Form.Control>
        {#snippet children({ props })}
            <Form.Label>Teleop Overflow Artifacts</Form.Label>
            <div class="flex items-center">
                <button
                    type="button"
                    onclick={() => $formData.teleop_overflow_artifacts--}
                    class="w-10 h-10 text-2xl rounded-lg m-4 outline outline-2"
                    >&minus;</button
                >
                <Input
                    {...props}
                    type="number"
                    bind:value={$formData.teleop_overflow_artifacts}
                    class="text-center w-12 mx-2"
                />
                <button
                    type="button"
                    onclick={() => $formData.teleop_overflow_artifacts++}
                    class="w-10 h-10 text-2xl rounded-lg m-4 outline outline-2"
                    >&plus;</button
                >
            </div>
        {/snippet}
    </Form.Control>
    <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="teleop_depot_artifacts">
    <Form.Control>
        {#snippet children({ props })}
            <Form.Label>Teleop Depot Artifacts</Form.Label>
            <div class="flex items-center">
                <button
                    type="button"
                    onclick={() => $formData.teleop_depot_artifacts--}
                    class="w-10 h-10 text-2xl rounded-lg m-4 outline outline-2"
                    >&minus;</button
                >
                <Input
                    {...props}
                    bind:value={$formData.teleop_depot_artifacts}
                    type="number"
                    class="text-center w-12 mx-2"
                />
                <button
                    type="button"
                    onclick={() => $formData.teleop_depot_artifacts++}
                    class="w-10 h-10 text-2xl rounded-lg m-4 outline outline-2"
                    >&plus;</button
                >
            </div>
        {/snippet}
    </Form.Control>
    <Form.FieldErrors />
</Form.Field>
