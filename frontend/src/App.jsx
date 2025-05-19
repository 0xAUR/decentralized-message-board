import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import TestPanel from './components/TestPanel'
import ResponsiveHelper from './components/ResponsiveHelper'
import { Web3Provider } from './context/Web3Context'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <Web3Provider>
        <div className="flex flex-col min-h-screen transition-colors duration-200 bg-slate-50 dark:bg-slate-900 dark:text-slate-100">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
          {/* Development tools - remove these in production */}
          <TestPanel />
          <ResponsiveHelper />
        </div>
      </Web3Provider>
    </ThemeProvider>
  )
}

export default App
