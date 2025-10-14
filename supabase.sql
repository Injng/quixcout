-- Create custom ENUM types for various choices
CREATE TYPE endgame_location AS ENUM ('Partial Base', 'Full Base', 'Both Base', 'None');
CREATE TYPE consistent_at AS ENUM ('Artifacts', 'Patterns', 'Both');
CREATE TYPE game_strategy AS ENUM ('Pushbot', 'Artifacts', 'Patterns', 'Both');
CREATE TYPE artifact_strategy AS ENUM ('Stockpile', 'Cycling', 'N/A', 'Both');
CREATE TYPE team_synergy AS ENUM ('Good Synergy and Good Team', 'Good Team', 'Mid Team', 'Bad');
CREATE TYPE performance_rating AS ENUM ('Amazing', 'Mid', 'Cooked');
CREATE TYPE intake_type AS ENUM ('Claw', 'Active', 'Other');

-- Teams table to store persistent team information
CREATE TABLE teams (
    team_id INTEGER PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events table to store competition events
CREATE TABLE events (
    event_id VARCHAR(20) PRIMARY KEY, -- FTCScout format
    event_name VARCHAR(255) NOT NULL,
    event_location VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_type VARCHAR(50), -- Regional, State, World Championship, etc.
    -- RP thresholds
    movement_threshold INTEGER NOT NULL,
    goal_threshold INTEGER NOT NULL,
    pattern_threshold INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Team metadata for specific events
CREATE TABLE event_team_metadata (
    event_id VARCHAR(20) REFERENCES events(event_id),
    team_id INTEGER REFERENCES teams(team_id),
    auton_leave BOOLEAN DEFAULT FALSE,
    auton_classified_artifacts INTEGER DEFAULT 0,
    auton_overflow_artifacts INTEGER DEFAULT 0,
    auton_patterns INTEGER DEFAULT 0,
    total_classified_artifacts INTEGER DEFAULT 0,
    total_overflow_artifacts INTEGER DEFAULT 0,
    total_depot_artifacts INTEGER DEFAULT 0,
    total_patterns INTEGER DEFAULT 0,
    endgame_location endgame_location DEFAULT 'None',
    consistent_at consistent_at,
    game_strategy game_strategy,
    artifact_strategy artifact_strategy,
    intake_type intake_type,
    synergy team_synergy,
    other_notes TEXT,
    PRIMARY KEY (event_id, team_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Matches table to store individual matches
CREATE TABLE matches (
    match_id SERIAL PRIMARY KEY,
    event_id VARCHAR(20) REFERENCES events(event_id),
    match_number INTEGER NOT NULL,
    match_type VARCHAR(50), -- Qualification, Semi-Final, Final, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, match_number, match_type)
);

-- Alliance assignments for each match
CREATE TABLE match_alliances (
    match_id INTEGER REFERENCES matches(match_id),
    team_id INTEGER REFERENCES teams(team_id),
    alliance_color VARCHAR(10) NOT NULL CHECK (alliance_color IN ('red', 'blue')),
    PRIMARY KEY (match_id, team_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Match performance data for each team
CREATE TABLE match_performances (
    performance_id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(match_id),
    event_id VARCHAR REFERENCES events(event_id),
    team_id INTEGER REFERENCES teams(team_id),
    -- Autonomous scoring
    auton_leave BOOLEAN DEFAULT FALSE,
    auton_classified_artifacts INTEGER DEFAULT 0,
    auton_overflow_artifacts INTEGER DEFAULT 0,
    auton_patterns INTEGER DEFAULT 0,
    -- TeleOp scoring
    total_classified_artifacts INTEGER DEFAULT 0,
    total_overflow_artifacts INTEGER DEFAULT 0,
    total_depot_artifacts INTEGER DEFAULT 0,
    total_patterns INTEGER DEFAULT 0,
    -- Endgame and overall
    endgame_location endgame_location DEFAULT 'None',
    dc BOOLEAN DEFAULT FALSE,
    overall_performance performance_rating,
    ranking_points INTEGER DEFAULT 0,
    other_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(match_id, team_id)
);

-- Team statistics across matches
CREATE TABLE team_statistics (
    team_id INTEGER REFERENCES teams(team_id),
    event_id VARCHAR(20) REFERENCES events(event_id),
    matches_played INTEGER DEFAULT 0,
    average_auton_points DECIMAL(10,2) DEFAULT 0,
    average_teleop_points DECIMAL(10,2) DEFAULT 0,
    average_endgame_points DECIMAL(10,2) DEFAULT 0,
    average_total_patterns DECIMAL(10,2) DEFAULT 0,
    average_total_depot_artifacts DECIMAL(10,2) DEFAULT 0,
    average_total_classified_artifacts DECIMAL(10,2) DEFAULT 0,
    average_total_overflow_artifacts DECIMAL(10,2) DEFAULT 0,
    ranking_points INTEGER DEFAULT 0,
    PRIMARY KEY (team_id, event_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Triggers to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_teams_timestamp
    BEFORE UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_events_timestamp
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_event_team_metadata_timestamp
    BEFORE UPDATE ON event_team_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_matches_timestamp
    BEFORE UPDATE ON matches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_match_performances_timestamp
    BEFORE UPDATE ON match_performances
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_team_statistics_timestamp
    BEFORE UPDATE ON team_statistics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Indexes for performance
CREATE INDEX idx_event_team_metadata_event_id ON event_team_metadata(event_id);
CREATE INDEX idx_event_team_metadata_team_id ON event_team_metadata(team_id);
CREATE INDEX idx_matches_event_id ON matches(event_id);
CREATE INDEX idx_match_alliances_match_id ON match_alliances(match_id);
CREATE INDEX idx_match_alliances_team_id ON match_alliances(team_id);
CREATE INDEX idx_match_performances_match_id ON match_performances(match_id);
CREATE INDEX idx_match_performances_team_id ON match_performances(team_id);
CREATE INDEX idx_team_statistics_team_id ON team_statistics(team_id);
CREATE INDEX idx_team_statistics_event_id ON team_statistics(event_id);

CREATE POLICY "Enable insert for authenticated users only"
ON "public"."event_team_metadata"
TO authenticated
WITH CHECK (
    true
);
CREATE POLICY "Enable insert for authenticated users only"
ON "public"."events"
TO authenticated
WITH CHECK (
    true
);
CREATE POLICY "Enable insert for authenticated users only"
ON "public"."match_alliances"
TO authenticated
WITH CHECK (
    true
);
CREATE POLICY "Enable insert for authenticated users only"
ON "public"."match_performances"
TO authenticated
WITH CHECK (
    true
);
CREATE POLICY "Enable insert for authenticated users only"
ON "public"."matches"
TO authenticated
WITH CHECK (
    true
);
CREATE POLICY "Enable insert for authenticated users only"
ON "public"."team_statistics"
TO authenticated
WITH CHECK (
    true
);
CREATE POLICY "Enable insert for authenticated users only"
ON "public"."teams"
TO authenticated
WITH CHECK (
    true
);

CREATE POLICY "Enable read access for all users"
ON "public"."event_team_metadata"
TO public
USING (
    true
);
CREATE POLICY "Enable read access for all users"
ON "public"."events"
TO public
USING (
    true
);
CREATE POLICY "Enable read access for all users"
ON "public"."match_alliances"
TO public
USING (
    true
);
CREATE POLICY "Enable read access for all users"
ON "public"."match_performances"
TO public
USING (
    true
);
CREATE POLICY "Enable read access for all users"
ON "public"."matches"
TO public
USING (
    true
);
CREATE POLICY "Enable read access for all users"
ON "public"."team_statistics"
TO public
USING (
    true
);
CREATE POLICY "Enable read access for all users"
ON "public"."teams"
TO public
USING (
    true
);

ALTER TABLE "event_team_metadata" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "match_alliances" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "match_performances" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matches" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "team_statistics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "teams" ENABLE ROW LEVEL SECURITY;
