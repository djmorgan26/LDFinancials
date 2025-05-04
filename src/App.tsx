import SignIn from './components/SignIn';
import Header from './components/Header';
import { onAuthStateChanged, Auth } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';

function App({ auth }: { auth: Auth }) {
    const [signedIn, setSignedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setSignedIn(!!user);
            setLoading(false)
        });
        return () => unsubscribe();
    }, [auth]);

    return (
        <BrowserRouter>
            {loading ? (
                <LoadingScreen/>
            ) : (
                <div className="min-h-screen bg-gray-900">
                    <Routes>
                        <Route path="/" element={signedIn ? <Header auth={auth} /> : <SignIn auth={auth}/>} />
                        <Route path="/signin" element={<SignIn auth={auth} />} />
                    </Routes>
                </div>
            )}

        </BrowserRouter>
    );
}

export default App;
