import 'antd/dist/antd.css'
import '../styles/globals.css'

import { ConfigProvider } from 'antd'
import thTH from 'antd/es/locale/th_TH'

function App({ Component, pageProps }) {
  return (
    <ConfigProvider locale={thTH}>
      <Component {...pageProps} />
    </ConfigProvider>
  )
}

export default App
