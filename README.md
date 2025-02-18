# Quixcout

A web application for scouting FIRST Tech Challenge events, made for internal use by FTC 8404 Quixilver.
Code has been open-sourced in this repository for others to use and contribute to, follow the instructions below to set up your own instance.

## Setup

We use [Supabase](https://supabase.com/) to store and manage our data. To set up the Supabase tables, execute `supabase.sql` in the SQL editor
for your own project. Then, store the Supabase URL and key in the `.env.local` file with the following format:

```
PUBLIC_SUPABASE_URL=<your supabase url>
PUBLIC_SUPABASE_ANON_KEY=<your supabase anon key>
```

Supabase Auth is used for authentication purposes. Setup an account in your Supabase project in order to login to the dashboard of the application and begin scouting.

Deployment is handled by [Vercel](https://vercel.com/), but you can use any other service or host your own, provided that you can deploy SvelteKit applications.

## Usage

Scouting is divided into two rough sections: data that is unified across all matches in one team (such as strategy, synergy, etc.), and data that is specific to each
match (such as game elements scored, auton points). These parts can be seen as parallel to pre-game scouting and per-match scouting.

To set up an event for scouting, click the Add button on the dashboard and enter the event code. After waiting for the adding process to complete, the teams will be added
to the database. You can then begin scouting the event by selecting the appropriate event from the dropdown menu below "Event".

To do pre-game scouting, click on each team from the data table on the dashboard and fill out the scouting form. This data is preserved across all matches for that event,
and can be seen from the main scouting page as well.

To do per-match scouting, click the "Scout" link on the header. For each match, select the team first from the dropdown menu on the Metadata tab, and then type in the
match number. Selecting the team will also populate all of the metadata in the tab, which is the same as the data that was filled out during pre-game scouting. You can
also change these values during the matches if needed.

Then, fill out each of the Auton, TeleOp, and Endgame tabs accordingly, then click the "Submit All" button at the bottom to submit your pre-match data. This data will then
be compiled and displayed on the dashboard.
