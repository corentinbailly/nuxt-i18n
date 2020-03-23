import middleware from '../middleware'
import { detectBrowserLanguage, rootRedirect } from './options'
import { getLocaleFromRoute } from './utils'

middleware.nuxti18n = async (context) => {
  const { app, route, redirect, isHMR, error } = context

  if (isHMR) {
    return
  }

  // Handle root path redirect
  if (route.path === '/' && rootRedirect) {
    redirect('/' + rootRedirect, route.query)
    return
  }

  if (detectBrowserLanguage && await app.i18n.__detectBrowserLanguage()) {
    return
  }

  const locale = app.i18n.locale || app.i18n.defaultLocale || null
  const routeLocale = getLocaleFromRoute(route, locale)

  if (routeLocale === null) {
    const localePath = app.switchLocalePath(locale)
    if (typeof localePath === 'undefined') {
      error({ statusCode: 404, message: 'Not found' })
    } else {
      if (route.path !== new URL(localePath).pathname) {
        redirect(localePath)
      }
    }
  }

  await app.i18n.setLocale(routeLocale || locale)
}
