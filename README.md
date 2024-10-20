# Mind Reader Game

## Description
Website that allows users to play a mind reader game.

The game is simple, one user have a word given and the other person have to guess the word using other words.

## Technologies
- AdonisJS
- SSR with AdonisJS (InertiaJS - React)
- UnoCSS
- BiomeJS
- Redis
- PostgreSQL
- Docker

## How to run
1. Clone the repository
2. Run `pnpm install`
3. Copy `.env.example` to `.env` and fill the variables
4. Run `docker-compose up -d`
5. Run `pnpm dev`
6. Run `pnpm jobs:run`
7. Access `http://localhost:3333`

## Offline mode (without social login)

To bypass social login, you can set the `BYPASS_LOGIN` env variable to `1` in your `.env` file. This will allow you to login with a default user.
```ts
await this.userRepository.findOrCreate('random@user.com', {
  username: 'RandomUser',
  avatarUrl: null,
  providerId: 1,
});
```

## Database

To run the migrations, you can use the following command:
```bash
node ace migration:run
```

To run the seeds, you can use the following command:
```bash
node ace db:seed
```

If you need to rollback the migrations, you can use the following command:
```bash
node ace migration:rollback --batch 0
```

## Tests

To run the tests, you can use the following command:
```bash
pnpm test
```

## Lint and format

To check the lint and format, you can use the following command:
```bash
biome check
```

To fix the lint and format, you can use the following command:
```bash
biome check --write
```

