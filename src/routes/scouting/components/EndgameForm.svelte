<script lang="ts">
  import * as Select from "$lib/components/ui/select";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { type Infer } from "sveltekit-superforms";
  import { type ScoutingSchema } from "../schema/schema";
  import type { FsSuperForm } from "formsnap";
  import type { Writable } from "svelte/store";

  export let form: FsSuperForm<Infer<ScoutingSchema>>;
  export let formData: Writable<Infer<ScoutingSchema>>;
</script>

<Form.Field {form} name="endgame_location">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Endgame Location</Form.Label>
      <Select.Root type="single" name={props.name} bind:value={$formData.endgame_location}>
        <Select.Trigger { ...props } class="w-[180px] truncate"
          >{$formData.endgame_location}</Select.Trigger
        >
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

<Form.Field {form} name="dc">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Disconnected</Form.Label>
      <Checkbox {...props} bind:checked={$formData.dc} />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="win">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Win</Form.Label>
      <Checkbox {...props} bind:checked={$formData.win} />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="tie">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Tie</Form.Label>
      <Checkbox {...props} bind:checked={$formData.tie} />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="overall_performance">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Overall Performance</Form.Label>
      <Select.Root type="single" name={props.name} bind:value={$formData.overall_performance}>
        <Select.Trigger { ...props } class="w-[180px] truncate"
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
