import Header from './components/Header'

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header 
        title="L&D Financial Dashboard"
        links={[
          { text: 'Dashboard', url: '/' },
          { text: 'Accounts', url: '/accounts' },
          { text: 'Transactions', url: '/transactions' },
          { text: 'Reports', url: '/reports' }
        ]}
      />
      
    </div>
  )
}

export default App