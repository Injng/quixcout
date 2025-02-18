<script lang="ts">
    import * as Form from "$lib/components/ui/form/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { eventFormSchema, type EventFormSchema } from "../schema/schema";
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

    const { form: formData, enhance, submitting } = form;
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
    <Form.Button class="mt-5" disabled={$submitting}>
        {#if $submitting}
            <span class="spinner" aria-label="Loading"></span>
            Adding...
        {:else}
            Add Event
        {/if}
    </Form.Button>
</form>

<style>
    .spinner {
        vertical-align: middle;
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-left-color: #000;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        animation: spin 1s linear infinite;
        display: inline-block;
        margin-right: 0.5rem;
    }
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>
