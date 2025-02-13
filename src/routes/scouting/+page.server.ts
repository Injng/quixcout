import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate, setError } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { eventFormSchema } from "./schema";
import type { Team } from "./columns.js";

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
  const selectedEvent = url.searchParams.get("event");
  let team_data: Team[] = [];
  if (selectedEvent != null) {
    // get team statistics for event
    let { data: teams } = await supabase
      .from("team_statistics")
      .select("*")
      .eq("event_id", selectedEvent);
    teams = teams ?? [];

    // populate team data with statistics
    for (const team of teams) {
      // get team name
      let { data: teamData } = await supabase
        .from("teams")
        .select("team_name")
        .eq("team_id", team.team_id);
      teamData = teamData ?? [];
      const teamName = teamData[0].team_name as string;

      // count number of matches played
      let { data: matches } = await supabase
        .from("match_performances")
        .select("match_id")
        .eq("team_id", team.team_id)
        .eq("event_id", selectedEvent);
      matches = matches ?? [];
      const matchesPlayed = matches.length;

      // get other fields from table
      const teamNumber = team.team_id;
      const avgAutonPoints = team.average_auton_points;
      const avgTeleopPoints = team.average_teleop_points;
      const avgEndgamePoints = team.average_endgame_points;
      const avgLowSamples = team.average_low_basket_samples;
      const avgHighSamples = team.average_high_basket_samples;
      const avgLowSpecimens = team.average_low_chamber_specimens;
      const avgHighSpecimens = team.average_high_chamber_specimens;

      // create the team object
      team_data.push({
        teamNumber,
        teamName: teamName,
        matchesPlayed,
        autonAverage: avgAutonPoints,
        teleopAverage: avgTeleopPoints,
        endgameAverage: avgEndgamePoints,
        lowSampleAverage: avgLowSamples,
        highSampleAverage: avgHighSamples,
        lowSpecimenAverage: avgLowSpecimens,
        highSpecimenAverage: avgHighSpecimens,
      });
    }
  }

  let { data: events } = await supabase
    .from("events")
    .select("event_name,event_id");

  return {
    form: await superValidate(zod(eventFormSchema)),
    events: events ?? [],
    team_data,
  };
};

export const actions: Actions = {
  event: async (event) => {
    // validate the submitted form data against our schema
    const form = await superValidate(event, zod(eventFormSchema));

    // if validation fails, return 400 with form errors
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    // ensure event does not already exist
    let { data: events } = await event.locals.supabase
      .from("events")
      .select("*")
      .eq("event_id", form.data.event);
    if (events != null && events.length > 0) {
      return setError(form, "event", "Event already exists.");
    }

    // get event data from FTCScout API
    let response = await fetch(
      `https://api.ftcscout.org/rest/v1/events/2024/${form.data.event}`
    );
    if (!response.ok) {
      return setError(form, "event", "Failed to fetch data for event code.");
    }
    const eventData = await response.json();

    // get team data from FTCScout API
    response = await fetch(
      `https://api.ftcscout.org/rest/v1/events/2024/${form.data.event}/teams`
    );
    if (!response.ok) {
      return setError(form, "event", "Failed to fetch data for teams.");
    }
    const teamData = await response.json();

    // get pertinent fields for event
    const { code, name, type, venue, start } = eventData;

    // insert into events table
    const { error } = await event.locals.supabase
      .from("events")
      .insert([
        {
          event_id: code,
          event_name: name,
          event_location: venue,
          event_date: start,
          event_type: type,
        },
      ])
      .select();
    if (error) {
      return setError(form, "event", "Failed to insert event into database.");
    }

    // for each team at the event, insert number into appropriate tables
    for (const team of teamData) {
      // check if team already exists in teams table
      const { teamNumber } = team;
      let { data: teams } = await event.locals.supabase
        .from("teams")
        .select("*")
        .eq("team_id", teamNumber);

      // if doesn't already exist, insert into teams database
      if (teams == null || teams.length === 0) {
        // get the team name from FTCScout
        response = await fetch(
          `https://api.ftcscout.org/rest/v1/teams/${teamNumber}`
        );
        if (!response.ok) {
          return setError(form, "event", "Failed to fetch data for team name.");
        }
        const teamNameData = await response.json();
        const teamName = teamNameData.name;

        // insert team information into the table
        const { error: teamsError } = await event.locals.supabase
          .from("teams")
          .insert([
            {
              team_id: teamNumber,
              team_name: teamName,
            },
          ])
          .select();
        if (teamsError) {
          console.log(teamsError);
          return setError(
            form,
            "event",
            "Failed to insert teams into database."
          );
        }
      }

      // insert team into event_team_metadata
      const { error: eventTeamMetadataError } = await event.locals.supabase
        .from("event_team_metadata")
        .insert([{ event_id: code, team_id: teamNumber }])
        .select();
      if (eventTeamMetadataError) {
        return setError(
          form,
          "event",
          "Failed to insert event_team_metadata into database."
        );
      }

      // insert team into team_statistics
      const { error: teamStatisticsError } = await event.locals.supabase
        .from("team_statistics")
        .insert([{ team_id: teamNumber, event_id: code }])
        .select();
      if (teamStatisticsError) {
        return setError(
          form,
          "event",
          "Failed to insert team_statistics into database."
        );
      }
    }
  },
};
