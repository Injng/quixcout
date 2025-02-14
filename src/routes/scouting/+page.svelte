<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import EventForm from "./components/EventForm.svelte";
  import EndgameForm from "./components/EndgameForm.svelte";
  import type { PageData } from "./$types.js";
  import { goto } from "$app/navigation";
  import DataTable from "./components/DataTable.svelte";
  import { columns } from "./schema/columns";
  import MetadataForm from "./components/MetadataForm.svelte";
  import AutonForm from "./components/AutonForm.svelte";
  import TeleOpForm from "./components/TeleOpForm.svelte";
  import FormButton from "$lib/components/ui/form/form-button.svelte";
  import { scoutingSchema } from "./schema/schema";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  let { data }: { data: PageData } = $props();

  // setup form data
  const form = superForm(data.scoutingForm, {
    validators: zodClient(scoutingSchema),
  });
  const { form: formData, enhance } = form;

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
    <form method="POST" action="?/scouting" use:enhance>
      <div class="flex justify-center mt-2 mb-2">
        <Tabs.Root value="team" class="w-[400px]">
          <Tabs.List class="grid w-full grid-cols-4">
            <Tabs.Trigger value="team">Team</Tabs.Trigger>
            <Tabs.Trigger value="auton">Auton</Tabs.Trigger>
            <Tabs.Trigger value="teleop">TeleOp</Tabs.Trigger>
            <Tabs.Trigger value="endgame">Endgame</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="team">
            <MetadataForm {form} {formData} />
          </Tabs.Content>
          <Tabs.Content value="auton">
            <AutonForm {form} {formData} />
          </Tabs.Content>
          <Tabs.Content value="teleop">
            <TeleOpForm {form} {formData} />
          </Tabs.Content>
          <Tabs.Content value="endgame">
            <EndgameForm {form} {formData} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
      <div class="flex justify-center mb-2">
        <FormButton class="mt-5">Submit All</FormButton>
      </div>
    </form>
  {/if}
</div>
