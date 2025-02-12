<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import EventForm from "./EventForm.svelte";
  import type { PageData } from "./$types.js";

  let { data }: { data: PageData } = $props();

  // update selector to show selected value
  let selectedEvent = $state("");
</script>

<div>
  <!-- Header -->
  <div class="bg-slate-500 flex flex-row font-serif p-5 z-10">
    <a href="/" class="font-bold">QUIXCOUT</a>
  </div>

  <div class="flex flex-col mt-2">
    <div class="flex flex-row justify-center">
      <div>Event</div>
    </div>
    <div class="flex flex-row justify-center mt-2 gap-2">
      <!-- Event Picker -->
      <Select.Root type="single" bind:value={selectedEvent}>
        <Select.Trigger class="w-[180px] truncate">{selectedEvent}</Select.Trigger>
        <Select.Content>
          {#each data.events as event}
            <Select.Item value={event.event_name}
              >{event.event_name}</Select.Item
            >
          {/each}
        </Select.Content>
      </Select.Root>

      <!-- Add New Event -->
      <Dialog.Root>
        <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
          Add
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Add Event</Dialog.Title>
          <Dialog.Description
            >Add new events with the FTCScout event code</Dialog.Description
          >
          <EventForm {data} />
        </Dialog.Content>
      </Dialog.Root>
    </div>
  </div>
</div>
