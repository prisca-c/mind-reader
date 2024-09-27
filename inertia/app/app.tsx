import 'virtual:uno.css'
import './app.css'
import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import '~/features/i18n/i18n'
import { Layout } from '~/features/layout/layout'

const appName = import.meta.env.VITE_APP_NAME || 'Mind Reader'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
    const page = pages[`../pages/${name}.tsx`]
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-shadow
    page.default.layout = (page) => <Layout>{page}</Layout>
    return page
  },

  setup({ el, App, props }) {
    hydrateRoot(el, <App {...props} />)
  },
})
