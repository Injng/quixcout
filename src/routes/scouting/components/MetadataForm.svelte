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

  let {
    form,
    formData,
    teams,
  }: {
    form: FsSuperForm<Infer<ScoutingSchema>>;
    formData: Writable<Infer<ScoutingSchema>>;
    teams: Team[];
  } = $props();

  $effect(() => {
    console.log("team id: " + $formData.team_id);
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
      <Select.Root type="single" name={props.name} bind:value={$formData.alliance}>
        <Select.Trigger {...props} class="w-[180px] truncate">
          {$formData.alliance || 'Select alliance'}
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
      <Select.Root type="single" name={props.name} bind:value={$formData.team_id}>
        <Select.Trigger { ...props } class="w-[180px] truncate">
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

<Form.Field {form} name="pre_auton_park">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Auton Park</Form.Label>
      <Checkbox {...props} bind:checked={$formData.pre_auton_park} />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="pre_auton_high_basket_samples">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Auton High Basket Sample</Form.Label>
      <Input
        {...props}
        type="number"
        bind:value={$formData.pre_auton_high_basket_samples}
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="pre_auton_high_chamber_specimen">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Auton High Chamber Specimen</Form.Label>
      <Input
        {...props}
        type="number"
        bind:value={$formData.pre_auton_high_chamber_specimen}
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="pre_total_push_samples">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Total Push Samples</Form.Label>
      <Input
        {...props}
        type="number"
        bind:value={$formData.pre_total_push_samples}
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="pre_total_low_basket_samples">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Total Low Basket Samples</Form.Label>
      <Input
        {...props}
        type="number"
        bind:value={$formData.pre_total_low_basket_samples}
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="pre_total_high_basket_samples">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Total High Basket Samples</Form.Label>
      <Input
        {...props}
        type="number"
        bind:value={$formData.pre_total_high_basket_samples}
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="pre_total_low_chamber_specimen">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Total Low Chamber Specimen</Form.Label>
      <Input
        {...props}
        type="number"
        bind:value={$formData.pre_total_low_chamber_specimen}
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="pre_total_high_chamber_specimen">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Total High Chamber Specimen</Form.Label>
      <Input
        {...props}
        type="number"
        bind:value={$formData.pre_total_high_chamber_specimen}
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="pre_endgame_location">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Endgame Location</Form.Label>
      <Select.Root type="single" name={props.name} bind:value={$formData.pre_endgame_location}>
        <Select.Trigger {...props} class="w-[180px] truncate">
          {$formData.pre_endgame_location || 'Select location'}
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="park">Park</Select.Item>
          <Select.Item value="level_2_ascent">Level 2 Ascent</Select.Item>
          <Select.Item value="level_3_ascent">Level 3 Ascent</Select.Item>
          <Select.Item value="none">None</Select.Item>
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
      <Select.Root type="single" name={props.name} bind:value={$formData.consistent_at}>
        <Select.Trigger {...props} class="w-[180px] truncate">
          {$formData.consistent_at || 'Select consistency'}
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="Sample">Sample</Select.Item>
          <Select.Item value="Specimen">Specimen</Select.Item>
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
      <Select.Root type="single" name={props.name} bind:value={$formData.game_strategy}>
        <Select.Trigger {...props} class="w-[180px] truncate">
          {$formData.game_strategy || 'Select strategy'}
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="Pushbot">Pushbot</Select.Item>
          <Select.Item value="Sample">Sample</Select.Item>
          <Select.Item value="Specimen">Specimen</Select.Item>
          <Select.Item value="Both">Both</Select.Item>
        </Select.Content>
      </Select.Root>
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="specimen_strategy">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Specimen Strategy</Form.Label>
      <Select.Root type="single" name={props.name} bind:value={$formData.specimen_strategy}>
        <Select.Trigger {...props} class="w-[180px] truncate">
          {$formData.specimen_strategy || 'Select strategy'}
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

<Form.Field {form} name="synergy">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Synergy</Form.Label>
      <Select.Root type="single" name={props.name} bind:value={$formData.synergy}>
        <Select.Trigger {...props} class="w-[180px] truncate">
          {$formData.synergy || 'Select synergy'}
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="Good Synergy and Good Team">Good Synergy and Good Team</Select.Item>
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
