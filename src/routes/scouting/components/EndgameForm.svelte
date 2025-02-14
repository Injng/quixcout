<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { endgameSchema, type EndgameSchema } from "../schema/schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  let { data }: { data: { form: SuperValidated<Infer<EndgameSchema>> } } =
    $props();

  const form = superForm(data.form, {
    validators: zodClient(endgameSchema),
  });

  const { form: formData, enhance } = form;
</script>

<form method="POST" action="?/endgame" use:enhance>
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

  <Form.Field {form} name="dc">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Disconnected</Form.Label>
        <Checkbox {...props} bind:checked={$formData.dc} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="overall_performance">
    <Form.Control>
      {#snippet children()}
        <Form.Label>Overall Performance</Form.Label>
        <Select.Root type="single" bind:value={$formData.overall_performance}>
          <Select.Trigger class="w-[180px] truncate"
            >{$formData.overall_performance}</Select.Trigger
          >
          <Select.Content>
            <Select.Item value="Amazing">Amazing</Select.Item>
            <Select.Item value="Mid">Mid</Select.Item>
            <Select.Item value="Cooked">Cooked</Select.Item>
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
