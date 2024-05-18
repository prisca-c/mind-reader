import scheduler from 'adonisjs-scheduler/services/main'
import { MatchPlayerService } from '../src/services/match_player_service.js'

scheduler
  .call(async () => {
    await new MatchPlayerService().handle()
  })
  .withoutOverlapping()
  .immediate()
  .everySeconds(20)
