<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { eventFormSchema, type EventFormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  
  let { data }: { data: { form: SuperValidated<Infer<EventFormSchema>> } } =
      $props();
  
  const form = superForm(data.form, {
    validators: zodClient(eventFormSchema),
  });
  
  const { form: formData, enhance } = form;
</script>

<form method="POST" action="?/event" use:enhance>
  <Form.Field {form} name="event">
    <Form.Control>
      {#snippet children({ props })}
      <Form.Label>Event Code</Form.Label>
      <Input {...props} bind:value={$formData.event} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button class="mt-5">Add Event</Form.Button>
</form>
