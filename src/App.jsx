import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./Pages/Home"

function App() {
  return (
    <div className="min-h-screen bg-pattern">
      <Navbar />
      <Home />
      <Footer />
    </div>
  )
}

export default App