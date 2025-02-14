<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import {
    teamMetadataSchema,
    type TeamMetadataSchema,
  } from "../schema/schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  let { data }: { data: { form: SuperValidated<Infer<TeamMetadataSchema>> } } =
    $props();

  const form = superForm(data.form, {
    validators: zodClient(teamMetadataSchema),
  });

  const { form: formData, enhance } = form;
</script>

<form method="POST" action="?/metadata" use:enhance>
  <Form.Field {form} name="match_id">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Match Number</Form.Label>
        <Input {...props} bind:value={$formData.match_id} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="team_id">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Team Number</Form.Label>
        <Input {...props} bind:value={$formData.team_id} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="auton_park">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Auton Park</Form.Label>
        <Checkbox {...props} bind:checked={$formData.auton_park} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="auton_high_basket_sample">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Auton High Basket Sample</Form.Label>
        <Input {...props} bind:value={$formData.auton_high_basket_sample} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="auton_high_chamber_specimen">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Auton High Chamber Specimen</Form.Label>
        <Input {...props} bind:value={$formData.auton_high_chamber_specimen} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="total_push_samples">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Total Push Samples</Form.Label>
        <Input {...props} bind:value={$formData.total_push_samples} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="total_low_basket_samples">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Total Low Basket Samples</Form.Label>
        <Input {...props} bind:value={$formData.total_low_basket_samples} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="total_high_basket_samples">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Total High Basket Samples</Form.Label>
        <Input {...props} bind:value={$formData.total_high_basket_samples} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="total_low_chamber_specimen">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Total Low Chamber Specimen</Form.Label>
        <Input {...props} bind:value={$formData.total_low_chamber_specimen} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="total_high_chamber_specimen">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Total High Chamber Specimen</Form.Label>
        <Input {...props} bind:value={$formData.total_high_chamber_specimen} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="endgame_location">
    <Form.Control>
      {#snippet children()}
        <Form.Label>Endgame Location</Form.Label>
        <Select.Root type="single" bind:value={$formData.endgame_location}>
          <Select.Trigger class="w-[180px] truncate"
            >{$formData.endgame_location}</Select.Trigger
          >
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
      {#snippet children()}
        <Form.Label>Consistent At</Form.Label>
        <Select.Root type="single" bind:value={$formData.consistent_at}>
          <Select.Trigger class="w-[180px] truncate"
            >{$formData.consistent_at}</Select.Trigger
          >
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
      {#snippet children()}
        <Form.Label>Game Strategy</Form.Label>
        <Select.Root type="single" bind:value={$formData.game_strategy}>
          <Select.Trigger class="w-[180px] truncate"
            >{$formData.game_strategy}</Select.Trigger
          >
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
      {#snippet children()}
        <Form.Label>Specimen Strategy</Form.Label>
        <Select.Root type="single" bind:value={$formData.specimen_strategy}>
          <Select.Trigger class="w-[180px] truncate"
            >{$formData.specimen_strategy}</Select.Trigger
          >
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
      {#snippet children()}
        <Form.Label>Synergy</Form.Label>
        <Select.Root type="single" bind:value={$formData.synergy}>
          <Select.Trigger class="w-[180px] truncate"
            >{$formData.synergy}</Select.Trigger
          >
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

  <Form.Field {form} name="other_notes">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Other Notes</Form.Label>
        <Input {...props} bind:value={$formData.other_notes} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
</form>
