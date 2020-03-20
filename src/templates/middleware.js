import middleware from '../middleware'

/** @type {import('@nuxt/types').Middleware} */
middleware.nuxti18n = async (context) => {
  const { app, isHMR, error } = context

  if (isHMR) {
    return
  }

  const [status, redirectPath, preserveQuery] = await app.i18n.__onNavigate(context.route)
  if (status && redirectPath) {
    const query = preserveQuery ? context.route.query : undefined
    context.redirect(status, redirectPath, query)
  }

  const locale = app.i18n.locale || app.i18n.defaultLocale || null
  const routeLocale = getLocaleFromRoute(route, locale)

  if (routeLocale === null) {
    error({ statusCode: 404, message: 'Not found' })
  }

  await app.i18n.setLocale(routeLocale || locale)
}
