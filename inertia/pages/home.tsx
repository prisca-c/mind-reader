import { Head, router } from '@inertiajs/react'

export default function Home() {
  return (
    <div className={'flex justify-center items-center h-screen w-screen'}>
      <Head title="Homepage" />

      <div>
        <h1 className={'text-4xl font-bold'}>Mind Reader</h1>
        <p className={'text-lg'}>Welcome to the Mind Reader game</p>
        <button
          className={'border-2 border-gray-500 hover:bg-gray-500 hover:text-white p-2 rounded-md'}
          onClick={() => router.visit('/login')}
        >
          Start Game
        </button>
      </div>
    </div>
  )
}
