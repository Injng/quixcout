import type { PageServerLoad, Actions } from "./$types.js";
import { superValidate, setError, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import {
  eventFormSchema,
  preScoutingSchema,
  scoutingSchema,
} from "./schema/schema.js";
import type { Team } from "./schema/columns.js";
import { fail } from "@sveltejs/kit";
import { on } from "svelte/events";

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
    eventForm: await superValidate(zod(eventFormSchema)),
    scoutingForm: await superValidate(zod(scoutingSchema)),
    preForm: await superValidate(zod(preScoutingSchema)),
    events: events ?? [],
    team_data,
  };
};

export const actions: Actions = {
  pre: async (event) => {
    // validate the submitted form data against our schema
    const form = await superValidate(event, zod(preScoutingSchema));

    // if validation fails, return 400 with form errors
    if (!form.valid) {
      console.log("Form validation failed:", form.errors);
      return setError(form, "", "Form validation failed");
    }

    // get event id from form
    const eventId = form.data.event_id;
    if (!eventId) {
      console.log("Missing event ID");
      return fail(400, { form, message: "Missing event id." });
    }

    // upsert into event_team_metadata table with key performance metrics
    const { error: metadataError } = await event.locals.supabase
      .from("event_team_metadata")
      .upsert({
        event_id: eventId,
        team_id: form.data.team_id,
        auton_park: form.data.pre_auton_park,
        auton_high_basket_sample: form.data.pre_auton_high_basket_samples,
        auton_high_chamber_specimen: form.data.pre_auton_high_chamber_specimen,
        total_push_samples: form.data.pre_total_push_samples,
        total_low_basket_samples: form.data.pre_total_low_basket_samples,
        total_high_basket_samples: form.data.pre_total_high_basket_samples,
        total_low_chamber_specimen: form.data.pre_total_low_chamber_specimen,
        total_high_chamber_specimen: form.data.pre_total_high_chamber_specimen,
        endgame_location: form.data.pre_endgame_location,
        consistent_at: form.data.consistent_at,
        game_strategy: form.data.game_strategy,
        specimen_strategy: form.data.specimen_strategy,
        synergy: form.data.synergy,
        other_notes: form.data.pre_other_notes,
      });
    if (metadataError) {
      console.log("Event team metadata upsert error:", metadataError);
      return fail(500, {
        form,
        message: "Failed to upsert event team metadata",
      });
    }

    // return success message
    return message(form, {
      alertType: "success",
      alertText: "Form submitted successfully!",
    });
  },

  scouting: async (event) => {
    // validate the submitted form data against our schema
    const form = await superValidate(event, zod(scoutingSchema));

    // if validation fails, return 400 with form errors
    if (!form.valid) {
      console.log("Form validation failed:", form.errors);
      return setError(form, "", "Form validation failed");
    }

    // get event id from form
    const eventId = form.data.event_id;
    if (!eventId) {
      console.log("Missing event ID");
      return fail(400, { form, message: "Missing event id." });
    }

    // check if match has already been inserted
    const { data: matches } = await event.locals.supabase
      .from("matches")
      .select("*")
      .eq("event_id", eventId)
      .eq("match_number", form.data.match_num);

    // upsert into matches table with a default match type ("Qualification") if it doesn't exist
    let matchId;
    if (matches == null || matches.length === 0) {
      const { data: matchData, error: matchError } = await event.locals.supabase
        .from("matches")
        .insert({
          match_number: form.data.match_num,
          event_id: eventId,
          match_type: "Qualification",
        })
        .select();
      if (matchError || !matchData || matchData.length === 0) {
        console.log("Match insert error:", matchError);
        return fail(500, { form, message: "Failed to insert match" });
      }
      matchId = matchData[0].match_id;
    } else {
      matchId = matches[0].match_id;
    }

    // insert into match_alliances table
    const { error: allianceError } = await event.locals.supabase
      .from("match_alliances")
      .insert({
        match_id: matchId,
        team_id: Number(form.data.team_id),
        alliance_color: form.data.alliance,
      });
    if (allianceError) {
      console.log("Match alliance insert error:", allianceError);
      return fail(500, { form, message: "Failed to insert match alliance" });
    }

    // insert into match_performances table with performance metrics
    const { error: performanceError } = await event.locals.supabase
      .from("match_performances")
      .insert({
        match_id: matchId,
        event_id: eventId,
        team_id: form.data.team_id,
        auton_parking: form.data.auton_parking,
        auton_push_samples: form.data.auton_push_samples,
        auton_low_basket_samples: form.data.auton_low_basket_samples,
        auton_high_basket_samples: form.data.auton_high_basket_samples,
        auton_low_chamber_specimen: form.data.auton_low_chamber_specimen,
        auton_high_chamber_specimen: form.data.auton_high_chamber_specimen,
        total_push_samples: form.data.total_push_samples,
        total_low_basket_samples: form.data.total_low_basket_samples,
        total_high_basket_samples: form.data.total_high_basket_samples,
        total_low_chamber_specimen: form.data.total_low_chamber_specimen,
        total_high_chamber_specimen: form.data.total_high_chamber_specimen,
        endgame_location: form.data.endgame_location,
        dc: form.data.dc,
        overall_performance: form.data.overall_performance,
        other_notes: form.data.other_notes,
      });
    if (performanceError) {
      console.log("Match performance insert error:", performanceError);
      return fail(500, { form, message: "Failed to insert match performance" });
    }

    // upsert into event_team_metadata table with key performance metrics
    const { error: metadataError } = await event.locals.supabase
      .from("event_team_metadata")
      .upsert({
        event_id: eventId,
        team_id: form.data.team_id,
        auton_park: form.data.pre_auton_park,
        auton_high_basket_sample: form.data.pre_auton_high_basket_samples,
        auton_high_chamber_specimen: form.data.pre_auton_high_chamber_specimen,
        total_push_samples: form.data.pre_total_push_samples,
        total_low_basket_samples: form.data.pre_total_low_basket_samples,
        total_high_basket_samples: form.data.pre_total_high_basket_samples,
        total_low_chamber_specimen: form.data.pre_total_low_chamber_specimen,
        total_high_chamber_specimen: form.data.pre_total_high_chamber_specimen,
        endgame_location: form.data.pre_endgame_location,
        consistent_at: form.data.consistent_at,
        game_strategy: form.data.game_strategy,
        specimen_strategy: form.data.specimen_strategy,
        synergy: form.data.synergy,
        other_notes: form.data.pre_other_notes,
      });
    if (metadataError) {
      console.log("Event team metadata upsert error:", metadataError);
      return fail(500, {
        form,
        message: "Failed to upsert event team metadata",
      });
    }

    // calculate auton points
    const autonPushSamplePoints = form.data.auton_push_samples * 2;
    const autonLowSamplePoints = form.data.auton_low_basket_samples * 4;
    const autonHighSamplePoints = form.data.auton_high_basket_samples * 8;
    const autonLowSpecimenPoints = form.data.auton_low_chamber_specimen * 6;
    const autonHighSpecimenPoints = form.data.auton_high_chamber_specimen * 10;
    const autonParkingPoints = form.data.auton_parking ? 3 : 0;
    const totalAutonPoints =
      autonPushSamplePoints +
      autonLowSamplePoints +
      autonHighSamplePoints +
      autonLowSpecimenPoints +
      autonHighSpecimenPoints +
      autonParkingPoints;

    // calculate teleop points
    const teleopPushSamplePoints = form.data.total_push_samples * 2;
    const teleopLowSamplePoints = form.data.total_low_basket_samples * 4;
    const teleopHighSamplePoints = form.data.total_high_basket_samples * 8;
    const teleopLowSpecimenPoints = form.data.total_low_chamber_specimen * 6;
    const teleopHighSpecimenPoints = form.data.total_high_chamber_specimen * 10;
    const totalTeleopPoints =
      teleopPushSamplePoints +
      teleopLowSamplePoints +
      teleopHighSamplePoints +
      teleopLowSpecimenPoints +
      teleopHighSpecimenPoints +
      totalAutonPoints -
      autonParkingPoints;

    // calculate endgame points
    const endgameParkingPoints = form.data.endgame_location === "park" ? 5 : 0;
    const endgameLevel2Points =
      form.data.endgame_location === "level_2_ascent" ? 15 : 0;
    const endgameLevel3Points =
      form.data.endgame_location === "level_3_ascent" ? 30 : 0;
    const totalEndgamePoints =
      endgameParkingPoints + endgameLevel2Points + endgameLevel3Points;

    // get current team statistics
    const { data: statistics, error: statisticsError } =
      await event.locals.supabase
        .from("team_statistics")
        .select("*")
        .eq("team_id", form.data.team_id)
        .eq("event_id", eventId);
    if (statisticsError || !statistics || statistics.length === 0) {
      console.log("Team statistics fetch error:", statisticsError);
      return fail(500, { form, message: "Failed to get team statistics" });
    }

    // calculate new averages
    const matchesPlayed = statistics[0].matches_played + 1;
    const avgAuton =
      (statistics[0].average_auton_points * statistics[0].matches_played +
        totalAutonPoints) /
      matchesPlayed;
    const avgTeleop =
      (statistics[0].average_teleop_points * statistics[0].matches_played +
        totalTeleopPoints) /
      matchesPlayed;
    const avgEndgame =
      (statistics[0].average_endgame_points * statistics[0].matches_played +
        totalEndgamePoints) /
      matchesPlayed;
    const avgLowSamples =
      (statistics[0].average_low_basket_samples * statistics[0].matches_played +
        form.data.total_low_basket_samples) /
      matchesPlayed;
    const avgHighSamples =
      (statistics[0].average_high_basket_samples *
        statistics[0].matches_played +
        form.data.total_high_basket_samples) /
      matchesPlayed;
    const avgLowSpecimens =
      (statistics[0].average_low_chamber_specimens *
        statistics[0].matches_played +
        form.data.total_low_chamber_specimen) /
      matchesPlayed;
    const avgHighSpecimens =
      (statistics[0].average_high_chamber_specimens *
        statistics[0].matches_played +
        form.data.total_high_chamber_specimen) /
      matchesPlayed;

    // update team statistics table with new data
    const { error: newStatsError } = await event.locals.supabase
      .from("team_statistics")
      .upsert({
        team_id: form.data.team_id,
        event_id: eventId,
        matches_played: matchesPlayed,
        average_auton_points: avgAuton,
        average_teleop_points: avgTeleop,
        average_endgame_points: avgEndgame,
        average_low_basket_samples: avgLowSamples,
        average_high_basket_samples: avgHighSamples,
        average_low_chamber_specimens: avgLowSpecimens,
        average_high_chamber_specimens: avgHighSpecimens,
      });
    if (newStatsError) {
      console.log("Team statistics update error:", newStatsError);
      return fail(500, { form, message: "Failed to update team statistics" });
    }

    // return success message
    return message(form, {
      alertType: "success",
      alertText: "Form submitted successfully!",
    });
  },

  event: async (event) => {
    // validate the submitted form data against our schema
    const form = await superValidate(event, zod(eventFormSchema));

    // if validation fails, return 400 with form errors
    if (!form.valid) {
      console.log("Event form validation failed:", form.errors);
      return setError(form, "", "Form validation failed");
    }

    // ensure event does not already exist
    let { data: events } = await event.locals.supabase
      .from("events")
      .select("*")
      .eq("event_id", form.data.event);
    if (events != null && events.length > 0) {
      console.log("Event already exists:", form.data.event);
      return fail(400, { form, message: "Event already exists." });
    }

    // get event data from FTCScout API
    let response = await fetch(
      `https://api.ftcscout.org/rest/v1/events/2024/${form.data.event}`,
    );
    if (!response.ok) {
      console.log("Failed to fetch event data:", response.statusText);
      return fail(400, {
        form,
        message: "Failed to fetch data for event code.",
      });
    }
    const eventData = await response.json();

    // get team data from FTCScout API
    response = await fetch(
      `https://api.ftcscout.org/rest/v1/events/2024/${form.data.event}/teams`,
    );
    if (!response.ok) {
      console.log("Failed to fetch teams data:", response.statusText);
      return fail(400, { form, message: "Failed to fetch data for teams." });
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
      console.log("Event insert error:", error);
      return fail(500, {
        form,
        message: "Failed to insert event into database.",
      });
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
          `https://api.ftcscout.org/rest/v1/teams/${teamNumber}`,
        );
        if (!response.ok) {
          console.log("Failed to fetch team name:", response.statusText);
          return fail(400, {
            form,
            message: "Failed to fetch data for team name.",
          });
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
          console.log("Teams insert error:", teamsError);
          return fail(500, {
            form,
            message: "Failed to insert teams into database.",
          });
        }
      }

      // insert team into event_team_metadata
      const { error: eventTeamMetadataError } = await event.locals.supabase
        .from("event_team_metadata")
        .insert([{ event_id: code, team_id: teamNumber }])
        .select();
      if (eventTeamMetadataError) {
        console.log(
          "Event team metadata insert error:",
          eventTeamMetadataError,
        );
        return fail(500, {
          form,
          message: "Failed to insert event_team_metadata into database.",
        });
      }

      // insert team into team_statistics
      const { error: teamStatisticsError } = await event.locals.supabase
        .from("team_statistics")
        .insert([{ team_id: teamNumber, event_id: code }])
        .select();
      if (teamStatisticsError) {
        console.log("Team statistics insert error:", teamStatisticsError);
        return fail(500, {
          form,
          message: "Failed to insert team_statistics into database.",
        });
      }
    }
  },
};
