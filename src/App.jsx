import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ResearcherGate from './components/ResearcherGate'
import CartDrawer from './components/CartDrawer'
import HomePage from './pages/HomePage'
import StorePage from './pages/StorePage'
import ProductPage from './pages/ProductPage'
import { CartProvider } from './context/CartContext'
import { VerificationProvider, useVerification } from './context/VerificationContext'

function GatedApp() {
  const { verified } = useVerification()

  if (!verified) return <ResearcherGate />

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <CartDrawer />
    </CartProvider>
  )
}

export default function App() {
  return (
    <VerificationProvider>
      <GatedApp />
    </VerificationProvider>
  )
}
