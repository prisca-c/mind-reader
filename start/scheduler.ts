import scheduler from 'adonisjs-scheduler/services/main'
import { MatchPlayerJob } from '#features/matchmaking/jobs/match_player_job'

scheduler
  .call(async () => {
    await new MatchPlayerJob().handle()
  })
  .immediate()
  .everySeconds(2)
