import scheduler from 'adonisjs-scheduler/services/main'
import { MatchPlayerService } from '#services/match_player_service'

scheduler
  .call(async () => {
    await new MatchPlayerService().handle()
  })
  .withoutOverlapping()
  .immediate()
  .everySeconds(20)
