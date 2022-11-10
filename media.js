class GetMedia {
    constructor({ initFn, playFn, pauseFn, stopFn, dataChFn, resumeFn }) {
        this.stream = null
        this.recorder = null
        this.chunk = []
        this.initFn = initFn || (() => { })
        this.playFn = playFn || (() => { })
        this.pauseFn = pauseFn || (() => { })
        this.resumeFn = resumeFn || (() => { })
        this.stopFn = stopFn || (() => { })
        this.dataChFn = dataChFn || (() => { })
    }
    async init() {
        let data = await navigator.mediaDevices.getUserMedia({ audio: true })
        this.stream = data
        this.recorder = new MediaRecorder(data)
        this.recorder.onstop = () => {
            this.stopFn()
        }
        this.recorder.onstart = () => {
            this.playFn()
        }
        this.recorder.onpause = (e) => {
            this.pauseFn()
        }
        this.recorder.onresume = (e) => {
            this.resumeFn()
        }
        this.recorder.ondataavailable = async (e) => {
            this.chunk.push(e.data)
            this.dataChFn(e.data)
        }
        this.initFn()
    }
    play() {
        this.recorder && this.recorder.start(1000)
    }
    pause() {
        this.recorder && this.recorder.pause()
    }
    resume() {
        this.recorder && this.recorder.resume()
    }
    stop() {
        this.recorder && this.recorder.stop()
    }
}

let Source = new MediaSource()//这个方法应该就是blbl的视频用的
// 或者直接推流直接在src用 http://www.qb5200.com/article/485539.html 这个链接
let addSource = null
Source.addEventListener("sourceopen", () => {
    addSource = Source.addSourceBuffer("audio/webm;codecs=opus")
})
audio2.src = URL.createObjectURL(Source)
let userMedia = new GetMedia({
    initFn() {
        console.log("开始了");
        audio1.srcObject = this.stream
    },
    playFn() {
        console.log("录制开始了");
    },
    pauseFn() {
        console.log("暂停了");
    },
    resumeFn() {
        console.log("恢复了");
    },
    stopFn() {
        let newData = new Blob(userMedia.chunk, {
            type: 'audio/webm;codecs=opus'
        })
        audio3.src = URL.createObjectURL(newData)
    },
    async dataChFn(data) {
        console.log(data, addSource);
        let newDaa = await data.arrayBuffer()
        addSource.appendBuffer(newDaa)
    }
})

opentBtn.onclick = () => {
    userMedia.init()
}
playBtn.onclick = () => { userMedia.play() }
pauseBtn.onclick = () => { userMedia.pause() }
resumeBtn.onclick = () => { userMedia.resume() }
stopBtn.onclick = () => {
    userMedia.stop()
}