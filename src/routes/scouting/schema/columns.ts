import { renderComponent } from "$lib/components/ui/data-table";
import AutonButton from "../sorting/AutonButton.svelte";
import EndgameButton from "../sorting/EndgameButton.svelte";
import HighSampleButton from "../sorting/HighSampleButton.svelte";
import HighSpecimenButton from "../sorting/HighSpecimenButton.svelte";
import LowSampleButton from "../sorting/LowSampleButton.svelte";
import LowSpecimenButton from "../sorting/LowSpecimenButton.svelte";
import MatchesButton from "../sorting/MatchesButton.svelte";
import TeamButton from "../sorting/TeamButton.svelte";
import TeleOpButton from "../sorting/TeleOpButton.svelte";
import type { ColumnDef } from "@tanstack/table-core";

export type Team = {
  teamNumber: number;
  teamName: string;
  matchesPlayed: number;
  autonAverage: number;
  teleopAverage: number;
  endgameAverage: number;
  lowSampleAverage: number;
  highSampleAverage: number;
  lowSpecimenAverage: number;
  highSpecimenAverage: number;
};

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "teamNumber",
    header: ({ column }) =>
      renderComponent(TeamButton, {
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
  },
  {
    accessorKey: "teamName",
    header: "Team Name",
  },
  {
    accessorKey: "matchesPlayed",
    header: ({ column }) =>
      renderComponent(MatchesButton, {
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
  },
  {
    accessorKey: "autonAverage",
    header: ({ column }) =>
      renderComponent(AutonButton, {
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
  },
  {
    accessorKey: "teleopAverage",
    header: ({ column }) =>
      renderComponent(TeleOpButton, {
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
  },
  {
    accessorKey: "endgameAverage",
    header: ({ column }) =>
      renderComponent(EndgameButton, {
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
  },
  {
    accessorKey: "lowSampleAverage",
    header: ({ column }) =>
      renderComponent(LowSampleButton, {
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
  },
  {
    accessorKey: "highSampleAverage",
    header: ({ column }) =>
      renderComponent(HighSampleButton, {
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
  },
  {
    accessorKey: "lowSpecimenAverage",
    header: ({ column }) =>
      renderComponent(LowSpecimenButton, {
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
  },
  {
    accessorKey: "highSpecimenAverage",
    header: ({ column }) =>
      renderComponent(HighSpecimenButton, {
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
  },
];
