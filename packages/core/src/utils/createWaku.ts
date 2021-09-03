import { StoreCodec, Waku } from 'js-waku'

export async function createWaku(waku?: Waku) {
  if (!waku) {
    waku = await Waku.create({ bootstrap: true })
    await new Promise((resolve) => {
      waku?.libp2p.peerStore.on('change:protocols', ({ protocols }) => {
        if (protocols.includes(StoreCodec)) {
          resolve('')
        }
      })
    })
  }
  return waku
}
