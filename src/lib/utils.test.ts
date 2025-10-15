import { describe, it, expect } from "vitest";
import { scoreAuton, scoreTeleop, scoreEndgame, computeRankingPoints } from "./utils";

describe("scoring utils", () => {
  it("scores auton correctly", () => {
    expect(
      scoreAuton({
        auton_classified_artifacts: 2,
        auton_overflow_artifacts: 1,
        auton_patterns: 3,
        auton_leave: true,
      }),
    ).toBe(2 * 3 + 1 * 1 + 3 * 2 + 3);

    expect(
      scoreAuton({
        auton_classified_artifacts: 0,
        auton_overflow_artifacts: 0,
        auton_patterns: 0,
        auton_leave: false,
      }),
    ).toBe(0);
  });

  it("scores teleop correctly", () => {
    expect(
      scoreTeleop({
        teleop_classified_artifacts: 4,
        teleop_overflow_artifacts: 2,
        teleop_depot_artifacts: 5,
        teleop_patterns: 1,
      }),
    ).toBe(4 * 3 + 2 * 1 + 5 * 1 + 1 * 2);
  });

  it("scores endgame correctly", () => {
    expect(scoreEndgame("None")).toBe(0);
    expect(scoreEndgame("Partial Base")).toBe(5);
    expect(scoreEndgame("Full Base")).toBe(10);
  });
});

describe("ranking points", () => {
  const thresholds = { movement_threshold: 16, goal_threshold: 36, pattern_threshold: 18 };

  it("returns 0 total when no teammate and no win/tie", () => {
    const { totalRP, components } = computeRankingPoints({
      self: {
        auton_classified_artifacts: 0,
        auton_overflow_artifacts: 0,
        auton_patterns: 0,
        teleop_classified_artifacts: 0,
        teleop_overflow_artifacts: 0,
        teleop_depot_artifacts: 0,
        teleop_patterns: 0,
        auton_leave: false,
        endgame_location: "None",
        win: false,
        tie: false,
      },
      teammate: null,
      thresholds,
    });
    expect(totalRP).toBe(0);
    expect(components).toEqual({ movementRP: 0, goalRP: 0, patternRP: 0, winRP: 0, tieRP: 0 });
  });

  it("exposes win/tie components even when no teammate but keeps total 0", () => {
    const { totalRP, components } = computeRankingPoints({
      self: {
        auton_classified_artifacts: 0,
        auton_overflow_artifacts: 0,
        auton_patterns: 0,
        teleop_classified_artifacts: 0,
        teleop_overflow_artifacts: 0,
        teleop_depot_artifacts: 0,
        teleop_patterns: 0,
        auton_leave: false,
        endgame_location: "None",
        win: true,
        tie: false,
      },
      teammate: null,
      thresholds,
    });
    expect(components.winRP).toBe(3);
    expect(totalRP).toBe(0);
  });

  it("awards movement RP when leaves + endgame meet threshold", () => {
    const { totalRP, components } = computeRankingPoints({
      self: {
        auton_classified_artifacts: 0,
        auton_overflow_artifacts: 0,
        auton_patterns: 0,
        teleop_classified_artifacts: 0,
        teleop_overflow_artifacts: 0,
        teleop_depot_artifacts: 0,
        teleop_patterns: 0,
        auton_leave: true,
        endgame_location: "Full Base",
        win: false,
        tie: false,
      },
      teammate: {
        auton_classified_artifacts: 0,
        auton_overflow_artifacts: 0,
        auton_patterns: 0,
        teleop_classified_artifacts: 0,
        teleop_overflow_artifacts: 0,
        teleop_depot_artifacts: 0,
        teleop_patterns: 0,
        auton_leave: true,
        endgame_location: "Full Base",
      },
      thresholds,
    });
    // movement = 3 (self leave) + 3 (mate leave) + 10 + 10 + 10 (both full bonus) = 36 >= 16 => 1
    expect(components.movementRP).toBe(1);
    expect(totalRP).toBe(1);
  });

  it("awards goal RP when total scored meets threshold", () => {
    const { totalRP, components } = computeRankingPoints({
      self: {
        auton_classified_artifacts: 5,
        auton_overflow_artifacts: 4,
        auton_patterns: 0,
        teleop_classified_artifacts: 5,
        teleop_overflow_artifacts: 4,
        teleop_depot_artifacts: 10,
        teleop_patterns: 0,
        auton_leave: false,
        endgame_location: "None",
        win: false,
        tie: false,
      },
      teammate: {
        auton_classified_artifacts: 4,
        auton_overflow_artifacts: 5,
        auton_patterns: 0,
        teleop_classified_artifacts: 4,
        teleop_overflow_artifacts: 5,
        teleop_depot_artifacts: 10,
        teleop_patterns: 0,
        auton_leave: false,
        endgame_location: "None",
      },
      thresholds,
    });
    // total scored = (5+4+5+4+10) + (4+5+4+5+10) = 28 + 28 = 56 >= 36 => goalRP=1
    expect(components.goalRP).toBe(1);
    expect(totalRP).toBe(1);
  });

  it("awards pattern RP when combined pattern points meet threshold", () => {
    const { totalRP, components } = computeRankingPoints({
      self: {
        auton_classified_artifacts: 0,
        auton_overflow_artifacts: 0,
        auton_patterns: 5, // 10 pts
        teleop_classified_artifacts: 0,
        teleop_overflow_artifacts: 0,
        teleop_depot_artifacts: 0,
        teleop_patterns: 4, // 8 pts
        auton_leave: false,
        endgame_location: "None",
        win: false,
        tie: false,
      },
      teammate: {
        auton_classified_artifacts: 0,
        auton_overflow_artifacts: 0,
        auton_patterns: 2, // 4 pts
        teleop_classified_artifacts: 0,
        teleop_overflow_artifacts: 0,
        teleop_depot_artifacts: 0,
        teleop_patterns: 1, // 2 pts
        auton_leave: false,
        endgame_location: "None",
      },
      thresholds,
    });
    // patterns = 10 + 8 + 4 + 2 = 24 >= 18 => 1
    expect(components.patternRP).toBe(1);
    expect(totalRP).toBe(1);
  });

  it("adds win RP to total when teammate present", () => {
    const { totalRP, components } = computeRankingPoints({
      self: {
        auton_classified_artifacts: 0,
        auton_overflow_artifacts: 0,
        auton_patterns: 0,
        teleop_classified_artifacts: 0,
        teleop_overflow_artifacts: 0,
        teleop_depot_artifacts: 0,
        teleop_patterns: 0,
        auton_leave: false,
        endgame_location: "None",
        win: true,
        tie: false,
      },
      teammate: {
        auton_classified_artifacts: 0,
        auton_overflow_artifacts: 0,
        auton_patterns: 0,
        teleop_classified_artifacts: 0,
        teleop_overflow_artifacts: 0,
        teleop_depot_artifacts: 0,
        teleop_patterns: 0,
        auton_leave: false,
        endgame_location: "None",
      },
      thresholds,
    });
    expect(components.winRP).toBe(3);
    expect(totalRP).toBe(3);
  });
});


