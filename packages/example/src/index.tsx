import React from 'react'
import ReactDOM from 'react-dom'
import { WakuPolling } from '@status-waku-voting/react-components'

ReactDOM.render(
  <div>
    <WakuPolling appName={'testApp_'} />
  </div>,
  document.getElementById('root')
)
