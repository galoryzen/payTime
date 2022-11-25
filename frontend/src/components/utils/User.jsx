import React from 'react'

export default function User({nombre, email}) {
  return (
    <div class="w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-sky-800 dark:border-cyan-900">
    <div class="flex flex-col items-center pb-5 py-5">
        <img class="mb-3 w-24 h-24 rounded-full shadow-lg" src="https://pbs.twimg.com/profile_images/630645307718500352/tcJL3G8G_400x400.jpg" alt="User"/>
        <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{nombre}</h5>
        <span class="text-l font-medium text-gray-500 dark:text-white">{email}</span>
    </div>
</div>
  )
}