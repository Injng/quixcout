<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import {
    autonSchema,
    type AutonSchema,
  } from "../schema/schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  let { data }: { data: { form: SuperValidated<Infer<AutonSchema>> } } =
    $props();

  const form = superForm(data.form, {
    validators: zodClient(autonSchema),
  });

  const { form: formData, enhance } = form;
</script>

<form method="POST" action="?/auton" use:enhance>
  <Form.Field {form} name="auton_parking">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Auton Parking</Form.Label>
        <Checkbox {...props} bind:checked={$formData.auton_parking} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="auton_push_samples">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Auton Push Samples</Form.Label>
        <Input {...props} bind:value={$formData.auton_push_samples} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="auton_low_basket_samples">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Auton Low Basket Samples</Form.Label>
        <Input {...props} bind:value={$formData.auton_low_basket_samples} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="auton_high_basket_samples">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Auton High Basket Samples</Form.Label>
        <Input {...props} bind:value={$formData.auton_high_basket_samples} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="auton_low_chamber_specimen">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Auton Low Chamber Specimen</Form.Label>
        <Input {...props} bind:value={$formData.auton_low_chamber_specimen} />
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

  <Form.Button class="mt-5">Save</Form.Button>
</form>
