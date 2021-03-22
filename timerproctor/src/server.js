import { StaticRouter } from 'react-router-dom'
import App from './App'
import React from 'react'
import express from 'express'
import cookieParser from 'cookie-parser'
import { renderToString } from 'react-dom/server'

import RootStore from './stores/index'
import AdminRootStore from './stores/admin'

const fs = require('fs')
const template = fs.readFileSync(__dirname + '/../src/_app.html', 'utf-8')

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

export const prepareStores = async (req) => {
  let cookies = {}

  const store = new RootStore()
  const adminStore = new AdminRootStore()

  const url = req.url
  const isAdmin = url.startsWith('/admin')
  const currentStore = isAdmin ? adminStore : store

  const { apiKey, oobCode, mode } = req.query

  if (isAdmin) {
    const refreshTokenName = `tp__refreshToken${isAdmin ? '_admin':''}`
    const refreshToken = req.cookies?.[refreshTokenName]

    if (!!apiKey && !!oobCode && !!mode) {
      currentStore.AuthStore.loggingIn = true
    } else if (refreshToken) {
      try {
        cookies[refreshTokenName] = await currentStore.AuthStore.token.renewToken(refreshToken)
        currentStore.AuthStore.setUser({ firebaseUID: 'dummy' })
        await currentStore.AuthStore.getUserData()
      } catch {}
    }
  } else {
    if (!!apiKey && !!oobCode && !!mode) {
      currentStore.AuthStore.loggingIn = true
    }
  }
  
  const examURL = url.match(/^(?:\/admin|\/)exams\/([a-z0-9]+)/) || []
  if (examURL.length === 2) {
    await currentStore.ExamStore.getInfo({ id: examURL[1] })
  }

  return { store, adminStore, cookies }
}

export const renderApp = async (req, res) => {
  const { store, adminStore, cookies = {} } = await prepareStores(req)


  const context = {}
  const markup = renderToString(
    <StaticRouter location={req.url} context={context}>
      <App store={store} adminStore={adminStore} />
    </StaticRouter>
  )

  for (const [name, value] of Object.entries(cookies)) {
    res.cookie(name, value, {
      httpOnly: true,
      domain: '.anawinwz.me',
      expires: new Date(Date.now() + 24 * 3600000)
    })
  }

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
      .replace(/\$\$STORE\$\$/g, JSON.stringify(store.toJSON()))
      .replace(/\$\$ADMINSTORE\$\$/g, JSON.stringify(adminStore.toJSON()))

    res
      .status(context.status || 200)
      .send(html)
  }
}

const server = express()

server
  .disable('x-powered-by')
  .use(express.static(__dirname + '/public'))
  .use(cookieParser())
  .get('/*', (req, res) => {
    renderApp(req, res)
  })

export default server
