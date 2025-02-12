import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate, setError } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { eventFormSchema } from "./schema";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  let { data: events } = await supabase.from("events").select("event_name");
  return {
    form: await superValidate(zod(eventFormSchema)),
    events: events ?? [],
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
