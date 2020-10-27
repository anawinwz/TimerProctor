import 'antd/dist/antd.css'
import '../styles/globals.css'

import { ConfigProvider } from 'antd'
import thTH from 'antd/es/locale/th_TH'

import DefaultLayout from '../layouts/default'

function App({ Component, pageProps }) {
  const Layout = Component.Layout || DefaultLayout
  return (
    <ConfigProvider locale={thTH}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ConfigProvider>
  )
}

export default App
