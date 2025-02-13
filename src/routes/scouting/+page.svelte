<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import EventForm from "./EventForm.svelte";
  import type { PageData } from "./$types.js";
  import { goto } from "$app/navigation";
  import DataTable from "./DataTable.svelte";
  import { columns } from "./columns";

  let { data }: { data: PageData } = $props();

  // update selector to show selected value
  let selectedEvent = $state("");

  // watch for changes to the selected event and set url
  $effect(() => {
    if (selectedEvent) {
      console.log(selectedEvent);
      goto(`?event=${selectedEvent}`);
    }
  });
</script>

<div>
  <!-- Header -->
  <div class="bg-black/60 text-white flex flex-row font-serif p-5 z-10 m-5">
    <a href={`/scouting?event=${selectedEvent}`}>Dashboard</a>
    <a href="/" class="font-bold grow text-center">QUIXCOUT</a>
    <a href="/scouting/form">Scout</a>
  </div>

  <div class="flex flex-col mt-2">
    <div class="flex flex-row justify-center">
      <div>Event</div>
    </div>
    <div class="flex flex-row justify-center mt-2 gap-2">
      <!-- Event Picker -->
      <Select.Root type="single" bind:value={selectedEvent}>
        <Select.Trigger class="w-[180px] truncate"
          >{selectedEvent}</Select.Trigger
        >
        <Select.Content>
          {#if data.events}
            {#each data.events as event}
              <Select.Item value={event.event_id}
                >{event.event_name}</Select.Item
              >
            {/each}
          {/if}
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
          <EventForm
            data={{
              form: data.form ?? {
                id: "",
                valid: false,
                posted: false,
                errors: {},
                data: { event: "" },
              },
            }}
          />
        </Dialog.Content>
      </Dialog.Root>
    </div>
  </div>

  <!-- Data Table -->
   <div class="mt-2">
  <DataTable data={data.team_data ?? []} {columns} />
   </div> 
</div>
