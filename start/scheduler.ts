import scheduler from 'adonisjs-scheduler/services/main'
import { MatchPlayerJob } from '#features/matchmaking/jobs/match_player_job'
import { CacheService } from '#services/cache/cache_service'

scheduler
  .call(async () => {
    await new MatchPlayerJob(new CacheService()).handle()
  })
  .immediate()
  .everySeconds(2)
