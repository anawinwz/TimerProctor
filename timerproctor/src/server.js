import { StaticRouter } from 'react-router-dom'
import App from './App'
import React from 'react'
import express from 'express'
import { renderToString } from 'react-dom/server'

import RootStore from './stores/index'
import AdminRootStore from './stores/admin'

const fs = require('fs')
const template = fs.readFileSync('src/_app.html', 'utf-8')

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

export const getDataFromURL = async (url = '') => {
  const store = new RootStore()
  const adminStore = new AdminRootStore()

  const isAdmin = url.startsWith('/admin')
  
  const examURL = url.match(/^(?:\/admin|\/)exams\/([a-z0-9]+)/) || []
  if (examURL.length === 2) {
    await (isAdmin ? adminStore : store).ExamStore.getInfo({ id: examURL[1] })
  }
  return { store, adminStore }
}

export const renderApp = async (req, res) => {
  const { store, adminStore } = await getDataFromURL(req.url)

  const context = {}
  const markup = renderToString(
    <StaticRouter location={req.url} context={context}>
      <App store={store} adminStore={adminStore} />
    </StaticRouter>
  )

  if (context.url) {
    res.redirect(context.status || 302, context.url)
  } else {
    const html = template
      .replace(/%PUBLIC_URL%/g, '')
      .replace(
        /<!--%ASSETS_CLIENT_CSS%-->/g,
        assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''
      )
      .replace(/%ASSETS_CLIENT_CSS%/g, assets.client.css)
      .replace('<!--%MARKUP%-->', markup)
      .replace(
        /<!--%ASSETS_CLIENT_CSS%-->/g,
        `<script src="${assets.client.js}" defer crossorigin></script>`
      )
      .replace(/%ASSETS_CLIENT_JS%/g, assets.client.js)
    
    res.status(context.status || 200).send(html)
  }
}

const server = express()

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    renderApp(req, res)
  })

export default server
