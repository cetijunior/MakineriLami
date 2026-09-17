// Public: everything the storefront needs, in one request.
import { route, send, PUBLIC_CACHE } from './_lib/http.js'
import { listCategories, listProducts, getSettings, dbConfigured } from './_lib/store.js'

export default route({
  GET: async (req, res) => {
    const [categories, products, settings] = await Promise.all([
      listCategories(),
      listProducts(),
      getSettings(),
    ])
    send(res, 200, { categories, products, settings, source: dbConfigured() ? 'mongodb' : 'seed' }, PUBLIC_CACHE)
  },
})
