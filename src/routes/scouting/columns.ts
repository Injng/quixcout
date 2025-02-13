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
    header: "Team Number",
  },
  {
    accessorKey: "teamName",
    header: "Team Name",
  },
  {
    accessorKey: "matchesPlayed",
    header: "Matches Played",
  },
  {
    accessorKey: "autonAverage",
    header: "Auton Average",
  },
  {
    accessorKey: "teleopAverage",
    header: "Teleop Average",
  },
  {
    accessorKey: "endgameAverage",
    header: "Endgame Average",
  },
  {
    accessorKey: "lowSampleAverage",
    header: "Low Basket Sample Average",
  },
  {
    accessorKey: "highSampleAverage",
    header: "High Basket Sample Average",
  },
  {
    accessorKey: "lowSpecimenAverage",
    header: "Low Chamber Specimen Average",
  },
  {
    accessorKey: "highSpecimenAverage",
    header: "High Chamber Specimen Average",
  },
];
