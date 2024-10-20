import { createInertiaApp } from '@inertiajs/react'
import ReactDOMServer from 'react-dom/server'
import '~/features/i18n/i18n'
import { Layout } from '~/features/layout/layout'

export default function render(page: string) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const page = pages[`../pages/${name}.tsx`]
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-shadow
      page.default.layout = (page) => <Layout>{page}</Layout>
      return page
    },
    setup: ({ App, props }) => <App {...props} />,
  })
}
