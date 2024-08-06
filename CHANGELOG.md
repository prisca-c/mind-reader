# Change Log

## [UNRELEASED]

### Added
- When guesser reached 5 words, game ends
- When game end, session is saved in database and deleted from cache (redis)
- Add `GameRules` class to handle game logic from `GameUseCase` class
- Add tests for :
  - `GameRules` class
- Add CI Pipeline `.github/workflows/checks.yml` to check code quality and run tests

### Changed
- Change project architecture
- Update `GameRules.validWord` method by adding `ValidWordState` to have more precise return value

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
