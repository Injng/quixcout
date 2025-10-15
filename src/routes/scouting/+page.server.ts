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
import { scoreAuton, scoreTeleop, scoreEndgame, computeRankingPoints } from "$lib/utils";

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
      const avgTotalPatterns = team.average_total_patterns;
      const avgTotalDepotArtifacts = team.average_total_depot_artifacts;
      const avgTotalClassifiedArtifacts = team.average_total_classified_artifacts;
      const avgTotalOverflowArtifacts = team.average_total_overflow_artifacts;
      const rankingPoints = team.ranking_points;
      const rpUpdated = team.rp_updated as boolean;

      // create the team object
      team_data.push({
        teamNumber,
        teamName: teamName,
        matchesPlayed,
        autonAverage: avgAutonPoints,
        teleopAverage: avgTeleopPoints,
        endgameAverage: avgEndgamePoints,
        totalPatternsAverage: avgTotalPatterns,
        totalDepotArtifactsAverage: avgTotalDepotArtifacts,
        totalClassifiedArtifactsAverage: avgTotalClassifiedArtifacts,
        totalOverflowArtifactsAverage: avgTotalOverflowArtifacts,
        rankingPoints: rankingPoints,
        rpUpdated,
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
        auton_leave: form.data.pre_auton_leave,
        auton_classified_artifacts: form.data.pre_auton_classified_artifacts,
        auton_overflow_artifacts: form.data.pre_auton_overflow_artifacts,
        auton_patterns: form.data.pre_auton_patterns,
        teleop_classified_artifacts: form.data.pre_teleop_classified_artifacts,
        teleop_overflow_artifacts: form.data.pre_teleop_overflow_artifacts,
        teleop_depot_artifacts: form.data.pre_teleop_depot_artifacts,
        teleop_patterns: form.data.pre_teleop_patterns,
        endgame_location: form.data.pre_endgame_location,
        consistent_at: form.data.consistent_at,
        game_strategy: form.data.game_strategy,
        artifact_strategy: form.data.artifact_strategy,
        intake_type: form.data.intake_type,
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
        auton_leave: form.data.auton_leave,
        auton_classified_artifacts: form.data.auton_classified_artifacts,
        auton_overflow_artifacts: form.data.auton_overflow_artifacts,
        auton_patterns: form.data.auton_patterns,
        teleop_classified_artifacts: form.data.teleop_classified_artifacts,
        teleop_overflow_artifacts: form.data.teleop_overflow_artifacts,
        teleop_depot_artifacts: form.data.teleop_depot_artifacts,
        teleop_patterns: form.data.teleop_patterns,
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
        auton_leave: form.data.pre_auton_leave,
        auton_classified_artifacts: form.data.pre_auton_classified_artifacts,
        auton_overflow_artifacts: form.data.pre_auton_overflow_artifacts,
        auton_patterns: form.data.pre_auton_patterns,
        teleop_classified_artifacts: form.data.pre_teleop_classified_artifacts,
        teleop_overflow_artifacts: form.data.pre_teleop_overflow_artifacts,
        teleop_depot_artifacts: form.data.pre_teleop_depot_artifacts,
        teleop_patterns: form.data.pre_teleop_patterns,
        endgame_location: form.data.pre_endgame_location,
        consistent_at: form.data.consistent_at,
        game_strategy: form.data.game_strategy,
        artifact_strategy: form.data.artifact_strategy,
        intake_type: form.data.intake_type,
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
    const totalAutonPoints = scoreAuton({
      auton_classified_artifacts: form.data.auton_classified_artifacts,
      auton_overflow_artifacts: form.data.auton_overflow_artifacts,
      auton_patterns: form.data.auton_patterns,
      auton_leave: form.data.auton_leave,
    });

    // calculate teleop points
    const totalTeleopPoints = scoreTeleop({
      teleop_classified_artifacts: form.data.teleop_classified_artifacts,
      teleop_overflow_artifacts: form.data.teleop_overflow_artifacts,
      teleop_depot_artifacts: form.data.teleop_depot_artifacts,
      teleop_patterns: form.data.teleop_patterns,
    });

    // calculate endgame points
    const endgameBasePoints = scoreEndgame(form.data.endgame_location);

    // get ranking point thresholds
    const { data: thresholds, error: thresholdsError } = await event.locals.supabase
      .from("events")
      .select("movement_threshold, goal_threshold, pattern_threshold")
      .eq("event_id", eventId)
      .single();
    if (thresholdsError || !thresholds) {
      console.log("Thresholds fetch error:", thresholdsError);
      return fail(500, { form, message: "Failed to get thresholds" });
    }
    const { movement_threshold, goal_threshold, pattern_threshold } = thresholds;

    // get teammate from match_alliances table
    const { data: teammateID, error: teammateIDError } = await event.locals.supabase
      .from("match_alliances")
      .select("*")
      .eq("match_id", matchId)
      .eq("alliance_color", form.data.alliance);
    if (teammateIDError) {
      console.log("Teammate fetch error:", teammateIDError);
      return fail(500, { form, message: "Failed to get teammate" });
    }

    // if no teammate, don't calculate ranking points
    let calcRP = true;
    if (teammateID.length === 0) {
      calcRP = false;
    }

    // get points scored by teammate in match
    const { data: teammate, error: teammateError } = await event.locals.supabase
      .from("match_performances")
      .select("*")
      .eq("match_id", matchId)
      .eq("team_id", teammateID[0].team_id);
    if (teammateError || !teammate) {
      console.log("Teammate fetch error:", teammateError);
      return fail(500, { form, message: "Failed to get teammate" });
    }

    let totalRP = 0
    if (calcRP) {
      const rp = computeRankingPoints({
        self: {
          auton_classified_artifacts: form.data.auton_classified_artifacts,
          auton_overflow_artifacts: form.data.auton_overflow_artifacts,
          auton_patterns: form.data.auton_patterns,
          teleop_classified_artifacts: form.data.teleop_classified_artifacts,
          teleop_overflow_artifacts: form.data.teleop_overflow_artifacts,
          teleop_depot_artifacts: form.data.teleop_depot_artifacts,
          teleop_patterns: form.data.teleop_patterns,
          auton_leave: form.data.auton_leave,
          endgame_location: form.data.endgame_location,
          win: form.data.win,
          tie: form.data.tie,
        },
        teammate: {
          auton_classified_artifacts: teammate[0].auton_classified_artifacts,
          auton_overflow_artifacts: teammate[0].auton_overflow_artifacts,
          auton_patterns: teammate[0].auton_patterns,
          teleop_classified_artifacts: teammate[0].teleop_classified_artifacts,
          teleop_overflow_artifacts: teammate[0].teleop_overflow_artifacts,
          teleop_depot_artifacts: teammate[0].teleop_depot_artifacts,
          teleop_patterns: teammate[0].teleop_patterns,
          auton_leave: teammate[0].auton_leave,
          endgame_location: teammate[0].endgame_location,
        },
        thresholds: { movement_threshold, goal_threshold, pattern_threshold },
      });
      totalRP = rp.totalRP;
    }

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
    let avgAuton =
      (statistics[0].average_auton_points * statistics[0].matches_played +
        totalAutonPoints) /
      matchesPlayed;
    let avgTeleop =
      (statistics[0].average_teleop_points * statistics[0].matches_played +
        totalTeleopPoints) /
      matchesPlayed;
    let avgEndgame =
      (statistics[0].average_endgame_points * statistics[0].matches_played +
        endgameBasePoints) /
      matchesPlayed;
    let avgTotalPatterns =
      (statistics[0].average_total_patterns * statistics[0].matches_played +
        form.data.auton_patterns + form.data.teleop_patterns) /
      matchesPlayed;
    let avgTotalDepotArtifacts =
      (statistics[0].average_total_depot_artifacts * statistics[0].matches_played +
        form.data.teleop_depot_artifacts) /
      matchesPlayed;
    let avgTotalClassifiedArtifacts =
      (statistics[0].average_total_classified_artifacts * statistics[0].matches_played +
        form.data.teleop_classified_artifacts + form.data.auton_classified_artifacts) /
      matchesPlayed;
    let avgTotalOverflowArtifacts =
      (statistics[0].average_total_overflow_artifacts * statistics[0].matches_played +
        form.data.teleop_overflow_artifacts + form.data.auton_overflow_artifacts) /
      matchesPlayed;
    let rankingPoints = statistics[0].ranking_points + totalRP;

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
        average_total_patterns: avgTotalPatterns,
        average_total_depot_artifacts: avgTotalDepotArtifacts,
        average_total_classified_artifacts: avgTotalClassifiedArtifacts,
        average_total_overflow_artifacts: avgTotalOverflowArtifacts,
        ranking_points: rankingPoints,
        rp_updated: calcRP,
      });
    if (newStatsError) {
      console.log("Team statistics update error:", newStatsError);
      return fail(500, { form, message: "Failed to update team statistics" });
    }

    // update ranking points for teammate
    if (calcRP) {
      const { error: teammateStatsError } = await event.locals.supabase
        .from("team_statistics")
        .upsert({
          team_id: teammate[0].team_id,
          event_id: eventId,
          ranking_points: rankingPoints,
          rp_updated: true,
        });
      if (teammateStatsError) {
        console.log("Teammate statistics update error:", teammateStatsError);
        return fail(500, { form, message: "Failed to update teammate statistics" });
      }
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
          movement_threshold: form.data.movement_threshold,
          goal_threshold: form.data.goal_threshold,
          pattern_threshold: form.data.pattern_threshold,
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
