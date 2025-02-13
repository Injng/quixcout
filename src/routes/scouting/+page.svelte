<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import EventForm from "./components/EventForm.svelte";
  import type { PageData } from "./$types.js";
  import { goto } from "$app/navigation";
  import DataTable from "./components/DataTable.svelte";
  import { columns } from "./schema/columns";
  import MetadataForm from "./components/MetadataForm.svelte";
  import AutonForm from "./components/AutonForm.svelte";

  let { data }: { data: PageData } = $props();

  // update selector to show selected value
  let selectedEvent = $state("");

  // watch for changes to the selected event and set url
  $effect(() => {
    if (selectedEvent) {
      goto(`?event=${selectedEvent}`);
    }
  });

  // state to track what the page is showing
  // 0 = data table, 1 = scouting forms
  let pageState = $state(0);
  $effect(() => {
    console.log(pageState);
  });
</script>

<div>
  <!-- Header -->
  <div class="bg-black/60 text-white flex flex-row font-serif p-5 z-10 m-5">
    <button
      onclick={() => {
        pageState = 0;
      }}>Dashboard</button
    >
    <div class="font-bold grow text-center">QUIXCOUT</div>
    <button
      onclick={() => {
        pageState = 1;
      }}>Scout</button
    >
  </div>

  {#if pageState == 0}
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
                form: data.eventForm ?? {
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
  {:else if pageState == 1}
    <!-- Scouting Form Tabs -->
    <div class="flex justify-center mt-2 mb-2">
      <Tabs.Root value="team" class="w-[400px]">
        <Tabs.List class="grid w-full grid-cols-4">
          <Tabs.Trigger value="team">Team</Tabs.Trigger>
          <Tabs.Trigger value="auton">Auton</Tabs.Trigger>
          <Tabs.Trigger value="teleop">TeleOp</Tabs.Trigger>
          <Tabs.Trigger value="endgame">Endgame</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="team">
          <MetadataForm data={{ form: data.metadataForm }} />
        </Tabs.Content>
        <Tabs.Content value="auton">
          <AutonForm data={{ form: data.autonForm }} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  {/if}
</div>
