import { StaticRouter } from 'react-router-dom'
import App from './App'
import React from 'react'
import express from 'express'
import { renderToString } from 'react-dom/server'

const fs = require('fs')
const template = fs.readFileSync('src/_app.html', 'utf-8')

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

export const renderApp = (req, res) => {
  const context = {}
  const markup = renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  )

  if (context.url) {
    return res.redirect(context.url, context.status || 302)
  }

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

  return { html, status: context.status }
}

const server = express()

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const { html, status = 200 } = renderApp(req, res)
    res.status(status).send(html)
  })

export default server
