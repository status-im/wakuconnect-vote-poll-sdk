import { Waku, getStatusFleetNodes } from 'js-waku'

class WakuVoting {
  private appName: string
  private waku: Waku | undefined

  private async createWaku() {
    this.waku = await Waku.create()
    const nodes = await getStatusFleetNodes()
    await Promise.all(
      nodes.map((addr) => {
        if (this.waku) {
          return this.waku.dial(addr)
        }
      })
    )
  }

  constructor(appName: string, waku?: Waku) {
    this.appName = appName
    if (waku) {
      this.waku = waku
    } else {
      this.createWaku()
    }
  }
}

export default WakuVoting
