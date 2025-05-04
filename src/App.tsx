import SignIn from './components/SignIn'
import Header from './components/Header'

function App() {
    const signedIn = false;
    return (
        <div className="min-h-screen bg-gray-900">
           {signedIn ? (
               <Header/>
           ) : (
               <SignIn/>
           )}
        </div>
    )
}

export default App