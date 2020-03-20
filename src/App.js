import React, { createContext, useState, useEffect, useCallback } from 'react'
import { Root, Routes, addPrefetchExcludes } from 'react-static'

import { Link, Router } from 'components/Router'
import Dynamic from 'containers/Dynamic'

import useWeb3 from './hook'

import './app.css'

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(['dynamic'])

export const Web3Context = createContext()

const App = () => {
  const { web3, network } = useWeb3()
  const [block, setBlock] = useState(0)

  useEffect(() => {
    window.addEventListener('load', function() {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.on('accountsChanged', accounts => {
          // Time to reload your interface with accounts[0]!
          window.location.reload()
        })
        window.ethereum.on('networkChanged', netId => {
          window.location.reload()
        })

        if (web3 && web3.eth)
          web3.eth.getAccounts().then(acc => setBlock(acc[0])) // TODO: web3 init = true if there is an account

      } else {
        alert('web3 is not found')
      }
    })
  }, [window.ethereum])

  const send = useCallback(() => web3.eth.sendTransaction({from: '0x580B9ca15035B8C99bda7B959EAB185b40b19704', to: '0x6AEC6f737e847279428cfDff652d9CF9a7f589c7', value: 1}))

  return (
    <Root>
      <Web3Context.Provider value={{ web3, network }}>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/dynamic">Dynamic</Link>
      </nav>
      <div>{block} <button onClick={() =>  window.ethereum.enable()}>Enable</button> <button onClick={send}>Send</button></div>
      <div className="content">
        <React.Suspense fallback={<em>Loading...</em>}>
          <Router>
            <Dynamic path="dynamic" />
            <Routes path="*" />
          </Router>
        </React.Suspense>
      </div>
    </Web3Context.Provider>
    </Root>
  )
}

export default App