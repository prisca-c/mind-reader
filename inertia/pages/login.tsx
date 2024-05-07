import { Head, Link, router } from '@inertiajs/react'

export default function LoginPage() {
  return (
    // center page content
    <div className={'flex justify-center items-center h-screen w-screen'}>
      <Head title="Login" />

      <div>
        <h1 className={'text-4xl font-bold'}>Login</h1>
        <p className={'text-lg'}>Login to your account</p>
        <a href={'/auth/twitch/redirect'}>
          <button
            className={'border-2 border-gray-500 hover:bg-gray-500 hover:text-white p-2 rounded-md'}
          >
            Login with Twitch
          </button>
        </a>
      </div>
    </div>
  )
}
