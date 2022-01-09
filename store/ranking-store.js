import { HYEventStore } from 'hy-event-store'
import { getRankings } from '../service/api_music'

const rankingMap = { 0: 'newRanking', 1: 'hotRanking', 2: 'originRanking', 3: 'upRanking' }
const rankingStore = new HYEventStore({
  state: {
    newRanking: {},
    hotRanking: {},
    originRanking: {},
    upRanking: {}
  },
  actions: {
    getRankingDataAction(state) {
      for(let i = 0; i < 4; i++) {
        getRankings(i).then(res => {
          state[rankingMap[i]] = res.playlist
         })
      }


    }
  }
})

export {
  rankingStore,
  rankingMap
}