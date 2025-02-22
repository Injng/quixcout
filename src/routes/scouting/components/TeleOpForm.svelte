<script lang="ts">
    import * as Form from "$lib/components/ui/form/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { type Infer } from "sveltekit-superforms";
    import { type ScoutingSchema } from "../schema/schema";
    import type { FsSuperForm } from "formsnap";
    import type { Writable } from "svelte/store";

    export let form: FsSuperForm<Infer<ScoutingSchema>>;
    export let formData: Writable<Infer<ScoutingSchema>>;
</script>

<Form.Field {form} name="total_push_samples">
    <Form.Control>
        {#snippet children({ props })}
            <Form.Label>Total Push Samples</Form.Label>
            <div class="flex items-center">
                <button
                    type="button"
                    onclick={() => $formData.total_push_samples--}
                    class="w-10 h-10 text-2xl rounded-lg m-4 outline outline-2"
                    >&minus;</button
                >
                <Input
                    {...props}
                    type="number"
                    bind:value={$formData.total_push_samples}
                    class="text-center w-12 mx-2"
                />
                <button
                    type="button"
                    onclick={() => $formData.total_push_samples++}
                    class="w-10 h-10 text-2xl rounded-lg m-4 outline outline-2"
                    >&plus;</button
                >
            </div>
        {/snippet}
    </Form.Control>
    <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="total_low_basket_samples">
    <Form.Control>
        {#snippet children({ props })}
            <Form.Label>Total Low Basket Samples</Form.Label>
            <div class="flex items-center">
                <button
                    type="button"
                    onclick={() => $formData.total_low_basket_samples--}
                    class="w-10 h-10 text-2xl rounded-lg m-4 outline outline-2"
                    >&minus;</button
                >
                <Input
                    {...props}
                    type="number"
                    bind:value={$formData.total_low_basket_samples}
                    class="text-center w-12 mx-2"
                />
                <button
                    type="button"
                    onclick={() => $formData.total_low_basket_samples++}
                    class="w-10 h-10 text-2xl rounded-lg m-4 outline outline-2"
                    >&plus;</button
                >
            </div>
        {/snippet}
    </Form.Control>
    <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="total_high_basket_samples">
    <Form.Control>
        {#snippet children({ props })}
            <Form.Label>Total High Basket Samples</Form.Label>
            <div class="flex items-center">
                <button
                    type="button"
                    onclick={() => $formData.total_high_basket_samples--}
                    class="w-10 h-10 text-2xl rounded-lg m-4 outline outline-2"
                    >&minus;</button
                >
                <Input
                    {...props}
                    bind:value={$formData.total_high_basket_samples}
                    type="number"
                    class="text-center w-12 mx-2"
                />
                <button
                    type="button"
                    onclick={() => $formData.total_high_basket_samples++}
                    class="w-10 h-10 text-2xl rounded-lg m-4 outline outline-2"
                    >&plus;</button
                >
            </div>
        {/snippet}
    </Form.Control>
    <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="total_low_chamber_specimen">
    <Form.Control>
        {#snippet children({ props })}
            <Form.Label>Total Low Chamber Specimen</Form.Label>
            <div class="flex items-center">
                <button
                    type="button"
                    onclick={() => $formData.total_low_chamber_specimen--}
                    class="w-10 h-10 text-2xl rounded-lg m-4 outline outline-2"
                    >&minus;</button
                >
                <Input
                    {...props}
                    type="number"
                    bind:value={$formData.total_low_chamber_specimen}
                    class="text-center w-12 mx-2"
                />
                <button
                    type="button"
                    onclick={() => $formData.total_low_chamber_specimen++}
                    class="w-10 h-10 text-2xl rounded-lg m-4 outline outline-2"
                    >&plus;</button
                >
            </div>
        {/snippet}
    </Form.Control>
    <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="total_high_chamber_specimen">
    <Form.Control>
        {#snippet children({ props })}
            <Form.Label>Total High Chamber Specimen</Form.Label>
            <div class="flex items-center">
                <button
                    type="button"
                    onclick={() => $formData.total_high_chamber_specimen--}
                    class="w-10 h-10 text-2xl rounded-lg m-4 outline outline-2"
                    >&minus;</button
                >
                <Input
                    {...props}
                    bind:value={$formData.total_high_chamber_specimen}
                    type="number"
                    class="text-center w-12 mx-2"
                />
                <button
                    type="button"
                    onclick={() => $formData.total_high_chamber_specimen++}
                    class="w-10 h-10 text-2xl rounded-lg m-4 outline outline-2"
                    >&plus;</button
                >
            </div>
        {/snippet}
    </Form.Control>
    <Form.FieldErrors />
</Form.Field>
