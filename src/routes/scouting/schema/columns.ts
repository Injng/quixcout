import { renderComponent } from "$lib/components/ui/data-table";
import AutonButton from "../sorting/AutonButton.svelte";
import EndgameButton from "../sorting/EndgameButton.svelte";
import MatchesButton from "../sorting/MatchesButton.svelte";
import TeamButton from "../sorting/TeamButton.svelte";
import TeleOpButton from "../sorting/TeleOpButton.svelte";
import PatternsButton from "../sorting/PatternsButton.svelte";
import DepotArtifactsButton from "../sorting/DepotArtifactsButton.svelte";
import ClassifiedArtifactsButton from "../sorting/ClassifiedArtifactsButton.svelte";
import OverflowArtifactsButton from "../sorting/OverflowArtifactsButton.svelte";
import RankingPointsButton from "../sorting/RankingPointsButton.svelte";
import type { ColumnDef } from "@tanstack/table-core";

export type Team = {
  teamNumber: number;
  teamName: string;
  matchesPlayed: number;
  autonAverage: number;
  teleopAverage: number;
  endgameAverage: number;
  totalPatternsAverage: number;
  totalDepotArtifactsAverage: number;
  totalClassifiedArtifactsAverage: number;
  totalOverflowArtifactsAverage: number;
  rankingPointsAverage: number;
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
    accessorKey: "rankingPoints",
    header: ({ column }) =>
      renderComponent(RankingPointsButton, {
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
    accessorKey: "totalPatternsAverage",
    header: ({ column }) =>
      renderComponent(PatternsButton, {
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
  },
  {
    accessorKey: "totalDepotArtifactsAverage",
    header: ({ column }) =>
      renderComponent(DepotArtifactsButton, {
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
  },
  {
    accessorKey: "totalClassifiedArtifactsAverage",
    header: ({ column }) =>
      renderComponent(ClassifiedArtifactsButton, {
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
  },
  {
    accessorKey: "totalOverflowArtifactsAverage",
    header: ({ column }) =>
      renderComponent(OverflowArtifactsButton, {
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
  },
];
