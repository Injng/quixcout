import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Scoring for DECODE 2025-2026 FTC Season
export type EndgameLocation = "Partial Base" | "Full Base" | "None";

export function scoreAuton(params: {
  auton_classified_artifacts: number;
  auton_overflow_artifacts: number;
  auton_patterns: number;
  auton_leave: boolean;
}): number {
  const autonClassifiedArtifactPoints = params.auton_classified_artifacts * 3;
  const autonOverflowArtifactPoints = params.auton_overflow_artifacts * 1;
  const autonPatternsPoints = params.auton_patterns * 2;
  const autonLeavePoints = params.auton_leave ? 3 : 0;
  return (
    autonClassifiedArtifactPoints +
    autonOverflowArtifactPoints +
    autonPatternsPoints +
    autonLeavePoints
  );
}

export function scoreTeleop(params: {
  teleop_classified_artifacts: number;
  teleop_overflow_artifacts: number;
  teleop_depot_artifacts: number;
  teleop_patterns: number;
}): number {
  const teleopClassifiedArtifactPoints = params.teleop_classified_artifacts * 3;
  const teleopOverflowArtifactPoints = params.teleop_overflow_artifacts * 1;
  const teleopDepotArtifactPoints = params.teleop_depot_artifacts * 1;
  const teleopPatternsPoints = params.teleop_patterns * 2;
  return (
    teleopClassifiedArtifactPoints +
    teleopOverflowArtifactPoints +
    teleopDepotArtifactPoints +
    teleopPatternsPoints
  );
}

export function scoreEndgame(endgame_location: EndgameLocation): number {
  if (endgame_location === "Partial Base") return 5;
  if (endgame_location === "Full Base") return 10;
  return 0;
}

export function computeRankingPoints(params: {
  self: {
    auton_classified_artifacts: number;
    auton_overflow_artifacts: number;
    auton_patterns: number;
    teleop_classified_artifacts: number;
    teleop_overflow_artifacts: number;
    teleop_depot_artifacts: number;
    teleop_patterns: number;
    auton_leave: boolean;
    endgame_location: EndgameLocation;
    win: boolean;
    tie: boolean;
  };
  teammate: {
    auton_classified_artifacts: number;
    auton_overflow_artifacts: number;
    auton_patterns: number;
    teleop_classified_artifacts: number;
    teleop_overflow_artifacts: number;
    teleop_depot_artifacts: number;
    teleop_patterns: number;
    auton_leave: boolean;
    endgame_location: EndgameLocation;
  } | null;
  thresholds: {
    movement_threshold: number;
    goal_threshold: number;
    pattern_threshold: number;
  };
}): { totalRP: number; components: { movementRP: number; goalRP: number; patternRP: number; winRP: number; tieRP: number } } {
  if (!params.teammate) {
    return { totalRP: 0, components: { movementRP: 0, goalRP: 0, patternRP: 0, winRP: params.self.win ? 3 : 0, tieRP: params.self.tie ? 1 : 0 } };
  }

  const selfEndgame = scoreEndgame(params.self.endgame_location);
  const teammateEndgame = scoreEndgame(params.teammate.endgame_location);
  const bothFullBonus =
    params.self.endgame_location === "Full Base" &&
    params.teammate.endgame_location === "Full Base"
      ? 10
      : 0;
  const totalEndgamePoints = selfEndgame + teammateEndgame + bothFullBonus;

  const totalScoredSelf =
    params.self.auton_classified_artifacts +
    params.self.auton_overflow_artifacts +
    params.self.teleop_classified_artifacts +
    params.self.teleop_overflow_artifacts +
    params.self.teleop_depot_artifacts;

  const totalScoredTeammate =
    params.teammate.auton_classified_artifacts +
    params.teammate.auton_overflow_artifacts +
    params.teammate.teleop_classified_artifacts +
    params.teammate.teleop_overflow_artifacts +
    params.teammate.teleop_depot_artifacts;

  const autonPatternsSelf = params.self.auton_patterns * 2;
  const teleopPatternsSelf = params.self.teleop_patterns * 2;
  const autonPatternsTeammate = params.teammate.auton_patterns * 2;
  const teleopPatternsTeammate = params.teammate.teleop_patterns * 2;

  const autonLeavePoints = params.self.auton_leave ? 3 : 0;
  const autonLeaveTeammate = params.teammate.auton_leave ? 3 : 0;

  const movementRP =
    autonLeavePoints + autonLeaveTeammate + totalEndgamePoints >=
    params.thresholds.movement_threshold
      ? 1
      : 0;

  const goalRP =
    totalScoredSelf + totalScoredTeammate >= params.thresholds.goal_threshold
      ? 1
      : 0;

  const patternRP =
    autonPatternsSelf +
    teleopPatternsSelf +
    autonPatternsTeammate +
    teleopPatternsTeammate >= params.thresholds.pattern_threshold
      ? 1
      : 0;

  const winRP = params.self.win ? 3 : 0;
  const tieRP = params.self.tie ? 1 : 0;
  const totalRP = movementRP + goalRP + patternRP + winRP + tieRP;
  return { totalRP, components: { movementRP, goalRP, patternRP, winRP, tieRP } };
}
