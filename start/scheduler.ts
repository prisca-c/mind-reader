import scheduler from 'adonisjs-scheduler/services/main'
import { ClearSearchJob } from '#jobs/clear_search_job'

scheduler
  .call(() => {
    new ClearSearchJob().handle({ minTime: 2 })
  })
  .immediate()
  .everyMinute()
