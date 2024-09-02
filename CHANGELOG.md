# Change Log

## [UNRELEASED]

### Added
- When guesser reached 5 words, game ends
- When game end, session is saved in database and deleted from cache (redis)
- Add `GameRules` class to handle game logic from `GameUseCase` class
- Add tests for :
  - `GameRules` class (unit tests)
  - `Matchmaking - Search` Controller (functional tests)
  - `Matchmaking - Accept` Controller (functional tests)
  - `MatchPlayerJob` class job (unit tests)
- Add CI Pipeline `.github/workflows/checks.yml` to check code quality and run tests
- Add an elo system to handle player ranking.
- Word stats are updated in database when game ends
- Word's form is now a single component `word_form.tsx` which handle error correctly using i18n, hooks, and WordValidationStateEnum
- Game takes 1min30s to end if no one found the word , added many things to handle this :
  - `GameSession` now have a status which takes a `SessionState` to handle the game state {MATCHMAKING, READY, PLAYING}
  - Create `PlayerSession` which handle `Player` & `{accepted: boolean, ready: boolean}` , ready is used to know if the player is ready to play
  - Create `GameReadyController` + route to handle player ready state, start the game and use a setTimeout to end the game if no one found the word
  - In frontend, added a useTimer hook to handle the timer and display it
- Add in game Infos :
  - Show opponent's infos at the end of the game
  - Show word at the end of the game
  - Show current turn info
- Add a Profile page to show game's history
- Add a player card to show player's infos

### Changed
- Add `Cache` service and update all Redis calls to use it
- Add `EventStream` service and update all Transmit calls to use it
- Change project architecture
- Update `GameRules.validWord` method by adding `ValidWordState` to have more precise return value
- Switch from `Tailwind` to `UnoCSS`

### Fixed
- Fix issue from transmit listener not closing properly when unmounting a component
- Guesser now got the word when he found it or not

## [0.4.0] - 2024-05-18

### Added
- Add Transmit to handle Server-Side Events.
- Setup general chat room.
- Add Api service to handle api requests.
- Add Scheduler service to handle scheduled tasks :
  - Matchmaking
- Add Matchmaking service to handle matchmaking.
- Add Game Controller to handle game logic.
- Add Client page to handle view of the game.

## [0.3.0] - 2024-05-07

### Added

- Add `TailwindCSS` to the project.
- Setup `Redis` to handle session storage.
- Add `docker-compose.yaml` to the project to handle PostgreSQL and Redis in development environment.
- Setup `OAuth2` authentication's controller and routes (Twitch for now).
- Add i18n handling on frontend with `react-i18next`.
- Setup default layout to pages.

## [0.2.0] - 2024-05-01

### Added

- ~~Add i18n handling to the project with `next-intl`.~~
- Switch project from `NextJS` to `AdonisJS`.

## [0.1.1] - 2024-04-25

### Added
