<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as Form from "$lib/components/ui/form/index.js";
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
    import { scoutingSchema } from "./schema/schema";
    import { superForm } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { toast } from "svelte-sonner";
    import { page } from "$app/state";
    import PreForm from "./components/PreForm.svelte";

    let { data }: { data: PageData } = $props();

    // setup form data for scouting
    const form = superForm(data.scoutingForm, {
        validators: zodClient(scoutingSchema),
        onUpdated({ form }) {
            if (form.valid && form.message?.alertType == "success") {
                toast.success("Submit successful!");
            } else {
                toast.error("Submit failed!");
            }
        },
    });
    const { form: formData, enhance } = form;

    // update selector to show selected value
    let selectedEvent = $state(page.url.searchParams.get("event") ?? "");

    // watch for changes to the selected event and set url
    $effect(() => {
        if (selectedEvent) {
            selectedTeam = "";
            goto(`?event=${selectedEvent}`);
        }
    });

    // state to track what the page is showing
    // 0 = data table, 1 = scouting forms, 2 = team metadata details
    let pageState = $state(0);

    // if a team is selected, show team metadata details
    let selectedTeam = $state("");
    let selectedName = $state("");
    $effect(() => {
        if (selectedTeam !== "") {
            (async () => {
                pageState = 2;
                selectedName = await getTeamName(Number(selectedTeam));
            })();
        }
    });

    // function to get a team's name from their number
    async function getTeamName(teamNum: number) {
        const { data: teamName } = await data.supabase
            .from("teams")
            .select("team_name")
            .eq("team_id", teamNum)
            .single();
        return teamName?.team_name;
    }
</script>

<div>
    <!-- Header -->
    <div class="bg-black/60 text-white flex flex-row font-serif p-5 z-10 m-5">
        <button
            onclick={() => {
                pageState = 0;
                selectedTeam = "";
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
                    <Dialog.Trigger
                        class={buttonVariants({ variant: "outline" })}
                    >
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
            <DataTable
                data={data.team_data ?? []}
                {columns}
                event={selectedEvent}
                bind:selectedTeam
            />
        </div>
    {:else if pageState == 1}
        <!-- Scouting Form Tabs -->
        <div class="p-2">
            <form method="POST" action="?/scouting" use:enhance>
                <input type="hidden" name="event_id" value={selectedEvent} />
                <div class="flex justify-center mt-2 mb-2">
                    <Tabs.Root value="team" class="w-[400px]">
                        <Tabs.List class="grid w-full grid-cols-4">
                            <Tabs.Trigger value="team">Team</Tabs.Trigger>
                            <Tabs.Trigger value="auton">Auton</Tabs.Trigger>
                            <Tabs.Trigger value="teleop">TeleOp</Tabs.Trigger>
                            <Tabs.Trigger value="endgame">Endgame</Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content value="team">
                            <MetadataForm
                                {form}
                                {formData}
                                teams={data.team_data}
                                supabase={data.supabase}
                                event_id={selectedEvent}
                            />
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
                    <button
                        class="ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-5"
                        type="submit">Submit All</button
                    >
                </div>
            </form>
        </div>
    {:else if pageState == 2}
        <Card.Root>
            <Card.Header>
                <Card.Title>Team {selectedTeam}</Card.Title>
                <Card.Description>{selectedName}</Card.Description>
            </Card.Header>
            <Card.Content>
                <PreForm
                    dataForm={data.preForm}
                    teamNum={Number(selectedTeam)}
                    teamName={selectedName}
                    supabase={data.supabase}
                    eventId={selectedEvent}
                />
            </Card.Content>
        </Card.Root>
    {/if}
</div>
