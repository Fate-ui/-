import { getSongDetail, getSongLyric } from '../service/api_player'
import { HYEventStore } from 'hy-event-store'
import { parseLyric } from '../utils/parse-lyric'

const audioContext = wx.createInnerAudioContext()
const playerStore = new HYEventStore({
  state: {
    id: 0,
    isFirstPlay: true,
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: '',
    playModeIndex: 0, //0: 循环播放 1: 单曲循环 2: 随机播放
    isPlaying: false,
    playListSongs: [],
    playListIndex: 0
  },
  actions: {
    playMusicWithSongAction(ctx, { id, isRefresh = false }) {
      if (ctx.id == id && !isRefresh) {
        this.dispatch('changeMusicPlayStatusAction', true)
        return
      }
      ctx.id = id
      //修改播放状态
      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.lyricInfos = []
      ctx.currentTime = 0
      ctx.currentTime = 0
      ctx.currentLyricText = ''

      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
      })
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        ctx.lyricInfos = parseLyric(lyricString)
      })
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true
      if (ctx.isFirstPlay) {
        this.dispatch('setupAudioContextListener')
        ctx.isFirstPlay = false
      }
    },
    setupAudioContextListener(ctx) {
      audioContext.onCanplay(() => {
        audioContext.play()
      })
      audioContext.onTimeUpdate(() => {
        const currentTime = audioContext.currentTime * 1000
        ctx.currentTime = currentTime
        if (!ctx.lyricInfos.length) return
        let i
        for (i = 0; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i]
          if (currentTime < lyricInfo.time) {
            break
          }
        }
        const currentLyricIndex = i - 1
        if (ctx.currentLyricIndex == currentLyricIndex) return
        const currentLyricText = ctx.lyricInfos[currentLyricIndex].text
        const lyricScrollTop = currentLyricIndex * 35
        ctx.currentLyricText = currentLyricText
        ctx.currentLyricIndex = currentLyricIndex
        ctx.lyricScrollTop = lyricScrollTop
      })

      //监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch('changeNewMusicAction')
      })
    },
    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },
    changeNewMusicAction(ctx, isNext = true) {
      //获取当前索引

      let index = ctx.playListIndex
      //根据播放模式，获取下一首歌曲
      switch(ctx.playModeIndex) {
        case 0: //顺序播放
        if (isNext) {
          index = index + 1
          if (index === ctx.playListSongs.length) {
            index = 0
          }
        } else {
          index = index - 1
          if (index === -1) {
            index = ctx.playListSongs.length - 1
          }
        }
          break
        case 1: //单曲循环
          break
        case 2: //随机播放
          while(index == ctx.playListIndex) {
            index = Math.floor(Math.random() * ctx.playListSongs.length)
          }
          break
      }
      //获取歌曲
      let currentSong = ctx.playListSongs[index]
      if (!currentSong) {
        currentSong = ctx.currentSong
      } else {
        ctx.playListIndex = index
      }

      //播放新的歌曲
      this.dispatch('playMusicWithSongAction', { id: currentSong.id, isRefresh: true })
    }
  }
})

export {
  audioContext,
  playerStore
}