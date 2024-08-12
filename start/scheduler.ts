import scheduler from 'adonisjs-scheduler/services/main'
import { MatchPlayerJob } from '#features/matchmaking/jobs/match_player_job'
import { Cache } from '#services/cache/cache'

scheduler
  .call(async () => {
    await new MatchPlayerJob(new Cache()).handle()
  })
  .immediate()
  .everySeconds(2)
