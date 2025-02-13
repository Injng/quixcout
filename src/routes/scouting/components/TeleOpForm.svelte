<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { teleopSchema, type TeleopSchema } from "../schema/schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  let { data }: { data: { form: SuperValidated<Infer<TeleopSchema>> } } =
    $props();

  const form = superForm(data.form, {
    validators: zodClient(teleopSchema),
  });

  const { form: formData, enhance } = form;
</script>

<form method="POST" action="?/teleop" use:enhance>
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

  <Form.Button class="mt-5">Save</Form.Button>
</form>
