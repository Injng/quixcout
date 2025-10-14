<script lang="ts">
    import * as Form from "$lib/components/ui/form/index.js";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import {
        preScoutingSchema,
        type PreScoutingSchema,
    } from "../schema/schema";
    import type { FsSuperForm } from "formsnap";
    import { type Writable } from "svelte/store";
    import type { Team } from "../schema/columns";
    import type { SupabaseClient } from "@supabase/supabase-js";
    import {
        type SuperValidated,
        type Infer,
        superForm,
    } from "sveltekit-superforms";
    import { toast } from "svelte-sonner";
    import { zodClient } from "sveltekit-superforms/adapters";

    let {
        dataForm,
        teamNum,
        teamName,
        supabase,
        eventId,
    }: {
        dataForm: SuperValidated<Infer<PreScoutingSchema>>;
        teamNum: number;
        teamName: string;
        supabase: SupabaseClient;
        eventId: string;
    } = $props();

    const form = superForm(dataForm, {
        validators: zodClient(preScoutingSchema),
        onUpdated({ form }) {
            if (form.valid && form.message?.alertType == "success") {
                toast.success("Save successful!");
            } else {
                toast.error("Save failed!");
            }
        },
        resetForm: false,
    });

    const { form: formData, enhance, submitting } = form;

    // fetch and populate team metadata
    async function getMetadata() {
        const { data: metadata } = await supabase
            .from("event_team_metadata")
            .select("*")
            .eq("team_id", teamNum)
            .eq("event_id", eventId)
            .single();

        if (metadata) {
            $formData.pre_auton_leave = metadata.auton_leave;
            $formData.pre_auton_classified_artifacts = metadata.auton_classified_artifacts;
            $formData.pre_auton_overflow_artifacts = metadata.auton_overflow_artifacts;
            $formData.pre_auton_patterns = metadata.auton_patterns;
            $formData.pre_teleop_classified_artifacts = metadata.teleop_classified_artifacts;
            $formData.pre_teleop_overflow_artifacts = metadata.teleop_overflow_artifacts;
            $formData.pre_teleop_depot_artifacts = metadata.teleop_depot_artifacts;
            $formData.pre_teleop_patterns = metadata.teleop_patterns;
            $formData.pre_endgame_location = metadata.endgame_location;
            $formData.consistent_at = metadata.consistent_at;
            $formData.game_strategy = metadata.game_strategy;
            $formData.artifact_strategy = metadata.artifact_strategy;
            $formData.intake_type = metadata.intake_type;
            $formData.synergy = metadata.synergy;
            $formData.pre_other_notes = metadata.other_notes ?? "";
        }
    }
    getMetadata();
</script>

<form method="POST" action="?/pre" use:enhance>
    <input type="hidden" name="event_id" value={eventId} />
    <input type="hidden" name="team_id" value={teamNum} />
    <Form.Field {form} name="pre_auton_leave">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Auton Leave</Form.Label>
                <Checkbox {...props} bind:checked={$formData.pre_auton_leave} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="pre_auton_classified_artifacts">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Auton Classified Artifacts</Form.Label>
                <Input
                    {...props}
                    type="number"
                    bind:value={$formData.pre_auton_classified_artifacts}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="pre_auton_overflow_artifacts">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Auton Overflow Artifacts</Form.Label>
                <Input
                    {...props}
                    type="number"
                    bind:value={$formData.pre_auton_overflow_artifacts}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="pre_auton_patterns">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Auton Patterns</Form.Label>
                <Input
                    {...props}
                    type="number"
                    bind:value={$formData.pre_auton_patterns}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="pre_teleop_classified_artifacts">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Teleop Classified Artifacts</Form.Label>
                <Input
                    {...props}
                    type="number"
                    bind:value={$formData.pre_teleop_classified_artifacts}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="pre_teleop_overflow_artifacts">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Teleop Overflow Artifacts</Form.Label>
                <Input
                    {...props}
                    type="number"
                    bind:value={$formData.pre_teleop_overflow_artifacts}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="pre_teleop_depot_artifacts">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Teleop Depot Artifacts</Form.Label>
                <Input
                    {...props}
                    type="number"
                    bind:value={$formData.pre_teleop_depot_artifacts}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="pre_teleop_patterns">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Teleop Patterns</Form.Label>
                <Input
                    {...props}
                    type="number"
                    bind:value={$formData.pre_teleop_patterns}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="pre_endgame_location">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Endgame Location</Form.Label>
                <Select.Root
                    type="single"
                    name={props.name}
                    bind:value={$formData.pre_endgame_location}
                >
                    <Select.Trigger {...props} class="w-[180px] truncate">
                        {$formData.pre_endgame_location || "Select location"}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Item value="Partial Base">Partial Base</Select.Item>
                        <Select.Item value="Full Base">Full Base</Select.Item>
                        <Select.Item value="Both Base">Both Base</Select.Item>
                        <Select.Item value="None">None</Select.Item>
                    </Select.Content>
                </Select.Root>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="consistent_at">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Consistent At</Form.Label>
                <Select.Root
                    type="single"
                    name={props.name}
                    bind:value={$formData.consistent_at}
                >
                    <Select.Trigger {...props} class="w-[180px] truncate">
                        {$formData.consistent_at || "Select consistency"}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Item value="Artifacts">Artifacts</Select.Item>
                        <Select.Item value="Patterns">Patterns</Select.Item>
                        <Select.Item value="Both">Both</Select.Item>
                    </Select.Content>
                </Select.Root>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="game_strategy">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Game Strategy</Form.Label>
                <Select.Root
                    type="single"
                    name={props.name}
                    bind:value={$formData.game_strategy}
                >
                    <Select.Trigger {...props} class="w-[180px] truncate">
                        {$formData.game_strategy || "Select strategy"}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Item value="Pushbot">Pushbot</Select.Item>
                        <Select.Item value="Artifacts">Artifacts</Select.Item>
                        <Select.Item value="Patterns">Patterns</Select.Item>
                        <Select.Item value="Both">Both</Select.Item>
                    </Select.Content>
                </Select.Root>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="artifact_strategy">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Artifact Strategy</Form.Label>
                <Select.Root
                    type="single"
                    name={props.name}
                    bind:value={$formData.artifact_strategy}
                >
                    <Select.Trigger {...props} class="w-[180px] truncate">
                        {$formData.artifact_strategy || "Select strategy"}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Item value="Stockpile">Stockpile</Select.Item>
                        <Select.Item value="Cycling">Cycling</Select.Item>
                        <Select.Item value="N/A">N/A</Select.Item>
                        <Select.Item value="Both">Both</Select.Item>
                    </Select.Content>
                </Select.Root>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="intake_type">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Intake Type</Form.Label>
                <Select.Root
                    type="single"
                    name={props.name}
                    bind:value={$formData.intake_type}
                >
                    <Select.Trigger {...props} class="w-[180px] truncate">
                        {$formData.intake_type || "Select intake type"}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Item value="Claw">Claw</Select.Item>
                        <Select.Item value="Active">Active</Select.Item>
                        <Select.Item value="Other">Other</Select.Item>
                    </Select.Content>
                </Select.Root>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <!-- Removed deprecated fields: far_extension, has_sweeper, active_room -->

    <Form.Field {form} name="synergy">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Synergy</Form.Label>
                <Select.Root
                    type="single"
                    name={props.name}
                    bind:value={$formData.synergy}
                >
                    <Select.Trigger {...props} class="w-[180px] truncate">
                        {$formData.synergy || "Select synergy"}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Item value="Good Synergy and Good Team"
                            >Good Synergy and Good Team</Select.Item
                        >
                        <Select.Item value="Good Team">Good Team</Select.Item>
                        <Select.Item value="Mid Team">Mid Team</Select.Item>
                        <Select.Item value="Bad">Bad</Select.Item>
                    </Select.Content>
                </Select.Root>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="pre_other_notes">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Other Notes</Form.Label>
                <Input {...props} bind:value={$formData.pre_other_notes} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Button class="mt-5 mb-16" disabled={$submitting}>
        {#if $submitting}
            <span class="spinner" aria-label="Loading"></span>
            Saving...
        {:else}
            Save
        {/if}
    </Form.Button>

    <div
        class="fixed bottom-0 left-0 right-0 p-4 z-50 bg-gradient-to-r from-zinc-900 to-slate-900 text-white font-semibold text-base shadow-lg backdrop-blur-sm border-t border-white/10"
    >
        <div
            class="container mx-auto flex items-center justify-center space-x-2"
        >
            <span class="animate-pulse">✨</span>
            <p>Don't forget to be GP!</p>
            <span class="animate-pulse">✨</span>
        </div>
    </div>
</form>

<style>
    .spinner {
        vertical-align: middle;
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-left-color: #000;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        animation: spin 1s linear infinite;
        display: inline-block;
        margin-right: 0.5rem;
    }
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>
