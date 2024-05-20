import scheduler from 'adonisjs-scheduler/services/main'
import { MatchPlayerService } from '#features/matchmaking/services/match_player_service'

scheduler
  .call(async () => {
    await new MatchPlayerService().handle()
  })
  .immediate()
  .everySeconds(2)
