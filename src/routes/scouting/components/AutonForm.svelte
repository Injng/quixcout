<script lang="ts">
    import * as Form from "$lib/components/ui/form/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { type Infer } from "sveltekit-superforms";
    import { type ScoutingSchema } from "../schema/schema";
    import type { FsSuperForm } from "formsnap";
    import type { Writable } from "svelte/store";
    import { rampSlots, type RampSlot } from "./rampStore";

    export let form: FsSuperForm<Infer<ScoutingSchema>>;
    export let formData: Writable<Infer<ScoutingSchema>>;

    // Ramp slots selection for classified artifacts (Green/Purple/None)
    let prevClassified = 0;
    function updateClassifiedCount() {
        $formData.auton_classified_artifacts = prevClassified + $rampSlots.filter((s) => s !== "N").length;
    }
    function setSlot(idx: number, value: RampSlot) {
        rampSlots.update((slots) => {
            const next = [...slots];
            next[idx] = value;
            return next;
        });
        updateClassifiedCount();
        updatePatternCount();
    }
    function clearSlot(idx: number) {
        setSlot(idx, "N");
        updatePatternCount();
    }
    function clearRamp() {
        rampSlots.set(Array(9).fill("N"));
        prevClassified = $formData.auton_classified_artifacts;
        updateClassifiedCount();
        updatePatternCount();
    }

    // Count patterns based on motif
    let patternCount = 0;
    function updatePatternCount() {
        patternCount = 0;
        let currPattern = "";
        for (let i = 0; i <= 6; i += 3) {
            currPattern += $rampSlots[i] + $rampSlots[i + 1] + $rampSlots[i + 2];
            if (currPattern == $formData.motif) {
                patternCount++;
            }
            currPattern = "";
        }
        $formData.auton_patterns = patternCount;
    }
</script>

<Form.Field {form} name="motif">
    <Form.Control>
        {#snippet children({ props })}
            <Form.Label>Motif</Form.Label>
            <Select.Root
                type="single"
                name={props.name}
                bind:value={$formData.motif as unknown as string | undefined}
            >
                <Select.Trigger {...props} class="w-[180px] truncate">
                    {$formData.motif || "Select motif"}
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="GPP">GPP</Select.Item>
                    <Select.Item value="PGP">PGP</Select.Item>
                    <Select.Item value="PPG">PPG</Select.Item>
                </Select.Content>
            </Select.Root>
        {/snippet}
    </Form.Control>
    <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="auton_classified_artifacts" class="mb-5">
    <Form.Control>
        {#snippet children({ props })}
            <Form.Label>Auton Ramp</Form.Label>
            <div class="flex items-center mb-2 gap-2">
                <span class="text-sm opacity-80">Classified Count:</span>
                <span class="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-sm">{$formData.auton_classified_artifacts ?? 0}</span>
                <Button type="button" variant="secondary" size="sm" onclick={clearRamp}>Open Gate</Button>
            </div>
            <div class="flex items-center mb-2 gap-2">
                <span class="text-sm opacity-80">Pattern Count:</span>
                <span class="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-sm">{$formData.auton_patterns}</span>
            </div>
            <div class="flex flex-wrap gap-3">
                {#each $rampSlots as slot, i (i)}
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

<Form.Field {form} name="auton_overflow_artifacts">
    <Form.Control>
        {#snippet children({ props })}
            <Form.Label>Auton Overflow Artifacts</Form.Label>
            <div class="flex items-center">
                <button
                    type="button"
                    onclick={() => $formData.auton_overflow_artifacts--}
                    class="w-10 h-10 text-2xl rounded-lg m-4 outline outline-2"
                    >&minus;</button
                >
                <Input
                    {...props}
                    bind:value={$formData.auton_overflow_artifacts}
                    type="number"
                    class="text-center w-12 mx-2"
                />
                <button
                    type="button"
                    onclick={() => $formData.auton_overflow_artifacts++}
                    class="w-10 h-10 text-2xl rounded-lg m-4 outline outline-2"
                    >&plus;</button
                >
            </div>
        {/snippet}
    </Form.Control>
    <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="auton_leave">
    <Form.Control>
        {#snippet children({ props })}
            <Form.Label>Auton Leave</Form.Label>
            <Checkbox {...props} bind:checked={$formData.auton_leave} />
        {/snippet}
    </Form.Control>
    <Form.FieldErrors />
</Form.Field>
