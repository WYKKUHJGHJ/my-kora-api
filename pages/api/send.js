// pages/api/send.js
import { ethers } from "ethers"

const PRIVATE_KEY = process.env.PRIVATE_KEY
const RPC_URL = "https://polygon-rpc.com"
const CONTRACT_ADDRESS = "0xab541f1a5149bf2e4ba7094764c2d8ab42dd8843"
const ABI = [
  "function transfer(address to, uint256 amount) public returns (bool)"
]

export default async function handler(req, res) {
  const { to } = req.query

  if (!to || !ethers.utils.isAddress(to)) {
    return res.status(400).json({ error: "Invalid address" })
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet)

    const amount = ethers.utils.parseUnits("1.0", 18) // 1 KORA (18 decimals)
    const tx = await contract.transfer(to, amount)

    return res.status(200).json({ success: true, txHash: tx.hash })
  } catch (error) {
    console.error("Send Error:", error)
    return res.status(500).json({ error: "Transfer failed" })
  }
}
