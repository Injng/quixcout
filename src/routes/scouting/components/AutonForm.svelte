<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { type Infer } from "sveltekit-superforms";
  import { type ScoutingSchema } from "../schema/schema";
  import type { FsSuperForm } from "formsnap";
  import type { Writable } from "svelte/store";

  export let form: FsSuperForm<Infer<ScoutingSchema>>;
  export let formData: Writable<Infer<ScoutingSchema>>;
</script>

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
      <div class="flex items-center">
        <button
          type="button"
          onclick={() => $formData.auton_push_samples--}
          class="m-2">-</button
        >
        <Input
          {...props}
          bind:value={$formData.auton_push_samples}
          type="number"
          class="text-center w-12 mx-2"
        />
        <button
          type="button"
          onclick={() => $formData.auton_push_samples++}
          class="m-2">+</button
        >
      </div>
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="auton_low_basket_samples">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Auton Low Basket Samples</Form.Label>
      <div class="flex items-center">
        <button
          type="button"
          onclick={() => $formData.auton_low_basket_samples--}
          class="m-2">-</button
        >
        <Input
          {...props}
          bind:value={$formData.auton_low_basket_samples}
          type="number"
          class="text-center w-12 mx-2"
        />
        <button
          type="button"
          onclick={() => $formData.auton_low_basket_samples++}
          class="m-2">+</button
        >
      </div>
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="auton_high_basket_samples">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Auton High Basket Samples</Form.Label>
      <div class="flex items-center">
        <button
          type="button"
          onclick={() => $formData.auton_high_basket_samples--}
          class="m-2">-</button
        >
        <Input
          {...props}
          bind:value={$formData.auton_high_basket_samples}
          type="number"
          class="text-center w-12 mx-2"
        />
        <button
          type="button"
          onclick={() => $formData.auton_high_basket_samples++}
          class="m-2">+</button
        >
      </div>
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="auton_low_chamber_specimen">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Auton Low Chamber Specimen</Form.Label>
      <div class="flex items-center">
        <button
          type="button"
          onclick={() => $formData.auton_low_chamber_specimen--}
          class="m-2">-</button
        >
        <Input
          {...props}
          bind:value={$formData.auton_low_chamber_specimen}
          type="number"
          class="text-center w-12 mx-2"
        />
        <button
          type="button"
          onclick={() => $formData.auton_low_chamber_specimen++}
          class="m-2">+</button
        >
      </div>
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="auton_high_chamber_specimen">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Auton High Chamber Specimen</Form.Label>
      <div class="flex items-center">
        <button
          type="button"
          onclick={() => $formData.auton_high_chamber_specimen--}
          class="m-2">-</button
        >
        <Input
          {...props}
          bind:value={$formData.auton_high_chamber_specimen}
          type="number"
          class="text-center w-12 mx-2"
        />
        <button
          type="button"
          onclick={() => $formData.auton_high_chamber_specimen++}
          class="m-2">+</button
        >
      </div>
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
