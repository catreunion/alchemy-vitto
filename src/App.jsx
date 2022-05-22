// https://alchemyvt.netlify.app/
// mumbai
import React, { useState, useEffect } from "react"
import { ethers } from "ethers"
import alchemylogo from "./alchemylogo.svg"
import abi from "./AlchemyVitto.json"
import "./App.css"

const App = () => {
  const [hasMetamask, setHasMetamask] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [myAddr, setMyAddr] = useState("")
  const [tokenURI, setTokenURI] = useState("")
  const contractAddress = "0x309c5b7c9bA8f28F0Aa4CBC7928AB315783B6daa"
  const contractABI = abi.abi

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true)
    }
  }, [])

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const [account] = await window.ethereum.request({ method: "eth_requestAccounts" })
        setMyAddr(account)
        setIsConnected(true)
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Please install MetaMask")
    }
  }

  const mint = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer)
        const tx = await contractInstance.safeMint(myAddr, tokenURI)
        await tx.wait()
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Please install MetaMask")
    }
  }

  return (
    <div className="App">
      <div id="container">
        <img id="logo" src={alchemylogo} alt=""></img>
        <button id="walletButton" onClick={connectWallet}>
          {hasMetamask ? (isConnected ? "Connected " + String(myAddr).substring(0, 6) + "..." + String(myAddr).substring(38) : "Connect MetaMask") : "Please install MetaMask"}
        </button>

        <h2 style={{ paddingTop: "18px" }}>TokenURI :</h2>
        <div>
          <input type="text" placeholder="paste the TokenURI here" onChange={(e) => setTokenURI(e.target.value)} value={tokenURI} />
        </div>

        <button id="publish" onClick={mint}>
          Mint
        </button>
      </div>
    </div>
  )
}

export default App
