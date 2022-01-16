import { getSongDetail, getSongLyric } from '../service/api_player'
import { HYEventStore } from 'hy-event-store'
import { parseLyric } from '../utils/parse-lyric'

const audioContext = wx.createInnerAudioContext()
const playerStore = new HYEventStore({
  state: {
    id: 0,
    currentSong: {},
    duration: 0,
    lyricInfos: []
  },
  actions: {
    playMusicWithSongAction(ctx, { id }) {
      ctx.id = id
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
      })
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        ctx.lyricInfos = parseLyric(lyricString)
      })
    }
  }
})

export {
  audioContext,
  playerStore
}