import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header 
        title="Vite + React"
        links={[
          { text: 'Home', url: '/' },
          { text: 'About', url: '/about' },
          { text: 'Docs', url: 'https://react.dev' },
          { text: 'GitHub', url: 'https://github.com' }
        ]}
      />
      <div className="pt-20 mt-2 container mx-auto px-4 text-center">
        <div className="flex justify-center">
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1 className="text-4xl font-bold mb-6">Vite + React</h1>
        <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            count is {count}
          </button>
          <p className="mt-4">
            Edit <code className="bg-gray-700 px-1 py-0.5 rounded">src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="mt-6 text-gray-500">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  )
}

export default App