import scheduler from 'adonisjs-scheduler/services/main'
import { MatchPlayerJob } from '#features/matchmaking/jobs/match_player_job'
import { CacheService } from '#services/cache/cache_service'
import { EventStreamService } from '#services/event_stream/event_stream_service'

scheduler
  .call(async () => {
    await new MatchPlayerJob(new CacheService(), new EventStreamService()).handle()
  })
  .immediate()
  .everySeconds(2)
