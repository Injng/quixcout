<script lang="ts">
    import * as Form from "$lib/components/ui/form/index.js";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import { type Infer } from "sveltekit-superforms";
    import { type ScoutingSchema } from "../schema/schema";
    import type { FsSuperForm } from "formsnap";
    import { type Writable } from "svelte/store";
    import type { Team } from "../schema/columns";
    import type { SupabaseClient } from "@supabase/supabase-js";

    let {
        form,
        formData,
        teams,
        supabase,
        event_id,
    }: {
        form: FsSuperForm<Infer<ScoutingSchema>>;
        formData: Writable<Infer<ScoutingSchema>>;
        teams: Team[];
        supabase: SupabaseClient;
        event_id: string;
    } = $props();

    // fetch and populate team metadata when team_id changes
    let filledId = "";
    $effect(() => {
        (async () => {
            console.log("filling metadata");
            if (filledId !== $formData.team_id) {
                const { data: metadata } = await supabase
                    .from("event_team_metadata")
                    .select("*")
                    .eq("team_id", $formData.team_id)
                    .eq("event_id", event_id)
                    .single();

                if (metadata) {
                    $formData.pre_auton_leave = metadata.auton_leave;
                    $formData.pre_auton_classified_artifacts =
                        metadata.auton_classified_artifacts;
                    $formData.pre_auton_overflow_artifacts =
                        metadata.auton_overflow_artifacts;
                    $formData.pre_auton_patterns = metadata.auton_patterns;
                    $formData.pre_teleop_classified_artifacts =
                        metadata.teleop_classified_artifacts;
                    $formData.pre_teleop_overflow_artifacts =
                        metadata.teleop_overflow_artifacts;
                    $formData.pre_teleop_depot_artifacts =
                        metadata.teleop_depot_artifacts;
                    $formData.pre_teleop_patterns = metadata.teleop_patterns;
                    $formData.pre_endgame_location = metadata.endgame_location;
                    $formData.consistent_at = metadata.consistent_at;
                    $formData.game_strategy = metadata.game_strategy;
                    $formData.artifact_strategy = metadata.artifact_strategy;
                    $formData.intake_type = metadata.intake_type;
                    $formData.synergy = metadata.synergy;
                    $formData.pre_other_notes = metadata.other_notes ?? "";
                    filledId = $formData.team_id;
                }
            }
        })();
    });
</script>

<Form.Field {form} name="match_num">
    <Form.Control>
        {#snippet children({ props })}
            <Form.Label>Match Number</Form.Label>
            <Input {...props} type="number" bind:value={$formData.match_num} />
        {/snippet}
    </Form.Control>
    <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="alliance">
    <Form.Control>
        {#snippet children({ props })}
            <Form.Label>Alliance</Form.Label>
            <Select.Root
                type="single"
                name={props.name}
                bind:value={$formData.alliance}
            >
                <Select.Trigger {...props} class="w-[180px] truncate">
                    {$formData.alliance || "Select alliance"}
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="red">Red</Select.Item>
                    <Select.Item value="blue">Blue</Select.Item>
                </Select.Content>
            </Select.Root>
        {/snippet}
    </Form.Control>
    <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="team_id">
    <Form.Control>
        {#snippet children({ props })}
            <Form.Label>Team</Form.Label>
            <Select.Root
                type="single"
                name={props.name}
                bind:value={$formData.team_id}
            >
                <Select.Trigger {...props} class="w-[180px] truncate">
                    {#if $formData.team_id}
                        {$formData.team_id}
                    {:else}
                        Select a team
                    {/if}
                </Select.Trigger>
                <Select.Content>
                    {#each teams as team}
                        <Select.Item value={team.teamNumber.toString()}
                            >{team.teamNumber}</Select.Item
                        >
                    {/each}
                </Select.Content>
            </Select.Root>
        {/snippet}
    </Form.Control>
    <Form.FieldErrors />
</Form.Field>

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
