<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
</script>

<div>
  <!-- Header -->
  <div class="bg-slate-500 flex flex-row font-serif p-5 z-10">
    <a href="/" class="font-bold">QUIXCOUT</a>
  </div>

  <!-- Event Picker -->
  <div class="flex flex-col mt-2">
    <div class="flex flex-row justify-center">
      <div>Event</div>
    </div>
    <div class="flex flex-row justify-center mt-2 gap-2">
      <Select.Root type="single">
        <Select.Trigger class="w-[180px]"></Select.Trigger>
        <Select.Content>
          <Select.Item value="event1">Event 1</Select.Item>
          <Select.Item value="event2">Event 2</Select.Item>
        </Select.Content>
      </Select.Root>
      <Dialog.Root>
        <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
          Add
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Add Event</Dialog.Title>
          <Dialog.Description>Add a new event</Dialog.Description>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  </div>
</div>
