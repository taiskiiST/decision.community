import { createInertiaApp } from '@inertiajs/react'
import React from 'react'
import ReactDOM from 'react-dom'

createInertiaApp({
  resolve: name => {
    const pages = require.context('./Pages', true, /\.tsx$/)

    return pages(`./${name}.tsx`).default
  },
  setup({ el, App, props }) {
    ReactDOM.render(<App {...props} />, el)
  },
})
