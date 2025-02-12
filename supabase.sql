-- Create custom ENUM types for various choices
CREATE TYPE endgame_location AS ENUM ('park', 'level_2_ascent', 'level_3_ascent', 'none');
CREATE TYPE consistent_at AS ENUM ('Sample', 'Specimen', 'Both');
CREATE TYPE game_strategy AS ENUM ('Pushbot', 'Sample', 'Specimen', 'Both');
CREATE TYPE specimen_strategy AS ENUM ('Stockpile', 'Cycling', 'N/A', 'Both');
CREATE TYPE team_synergy AS ENUM ('Good Synergy and Good Team', 'Good Team', 'Mid Team', 'Bad');
CREATE TYPE performance_rating AS ENUM ('Amazing', 'Mid', 'Cooked');

-- Teams table to store persistent team information
CREATE TABLE teams (
    team_id INTEGER PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events table to store competition events
CREATE TABLE events (
    event_id VARCHAR(20) PRIMARY KEY, -- FTCScout format e.g., USANOCASCQ1
    event_name VARCHAR(255) NOT NULL,
    event_location VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_type VARCHAR(50), -- Regional, State, World Championship, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Team metadata for specific events
CREATE TABLE event_team_metadata (
    event_id VARCHAR(20) REFERENCES events(event_id),
    team_id INTEGER REFERENCES teams(team_id),
    auton_park BOOLEAN DEFAULT FALSE,
    auton_high_basket_sample INTEGER DEFAULT 0,
    auton_high_chamber_specimen INTEGER DEFAULT 0,
    total_push_samples INTEGER DEFAULT 0,
    total_low_basket_samples INTEGER DEFAULT 0,
    total_high_basket_samples INTEGER DEFAULT 0,
    total_low_chamber_specimen INTEGER DEFAULT 0,
    total_high_chamber_specimen INTEGER DEFAULT 0,
    endgame_location endgame_location DEFAULT 'none',
    consistent_at consistent_at,
    game_strategy game_strategy,
    specimen_strategy specimen_strategy,
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
    alliance_position INTEGER NOT NULL CHECK (alliance_position IN (1, 2)), -- Each alliance has 2 teams
    PRIMARY KEY (match_id, team_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Match performance data for each team
CREATE TABLE match_performances (
    performance_id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(match_id),
    team_id INTEGER REFERENCES teams(team_id),
    -- Autonomous scoring
    auton_parking BOOLEAN DEFAULT FALSE,
    auton_push_samples INTEGER DEFAULT 0,
    auton_low_basket_samples INTEGER DEFAULT 0,
    auton_high_basket_samples INTEGER DEFAULT 0,
    auton_low_chamber_specimen INTEGER DEFAULT 0,
    auton_high_chamber_specimen INTEGER DEFAULT 0,
    -- TeleOp scoring
    total_push_samples INTEGER DEFAULT 0,
    total_low_basket_samples INTEGER DEFAULT 0,
    total_high_basket_samples INTEGER DEFAULT 0,
    total_low_chamber_specimen INTEGER DEFAULT 0,
    total_high_chamber_specimen INTEGER DEFAULT 0,
    -- Endgame and overall
    endgame_location endgame_location DEFAULT 'none',
    dc BOOLEAN DEFAULT FALSE,
    overall_performance performance_rating,
    other_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(match_id, team_id)
);

-- Team statistics across events (updated via triggers or application logic)
CREATE TABLE team_statistics (
    team_id INTEGER REFERENCES teams(team_id),
    event_id VARCHAR(20) REFERENCES events(event_id),
    matches_played INTEGER DEFAULT 0,
    average_auton_points DECIMAL(10,2) DEFAULT 0,
    average_teleop_points DECIMAL(10,2) DEFAULT 0,
    average_endgame_points DECIMAL(10,2) DEFAULT 0,
    parking_success_rate DECIMAL(5,2) DEFAULT 0,
    specimen_success_rate DECIMAL(5,2) DEFAULT 0,
    sample_success_rate DECIMAL(5,2) DEFAULT 0,
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