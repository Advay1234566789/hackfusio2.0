"use client";
import React, { useState, useEffect } from "react";

// ------------------------------
// Helper: Compute SHA‑256 hash using Web Crypto API
// ------------------------------
async function computeHash(data) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ------------------------------
// Simulated Database: Using localStorage
// ------------------------------
const getCandidatesFromStorage = () => {
  const data = localStorage.getItem("candidates");
  return data ? JSON.parse(data) : [];
};

const getBlocksFromStorage = () => {
  const data = localStorage.getItem("blocks");
  return data ? JSON.parse(data) : [];
};

const saveCandidatesToStorage = (candidates) => {
  localStorage.setItem("candidates", JSON.stringify(candidates));
};

const saveBlocksToStorage = (blocks) => {
  localStorage.setItem("blocks", JSON.stringify(blocks));
};

// ------------------------------
// Background Component
// ------------------------------
const BackgroundStatic = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      {children}
    </div>
  );
};

// ------------------------------
// Modal Component (for viewing block details)
// ------------------------------
const BlockModal = ({ isOpen, block, onClose }) => {
  if (!isOpen || !block) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-5 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-800 text-white p-5 rounded-lg max-w-sm w-full"
      >
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-semibold">Block Details</h3>
          <button onClick={onClose} className="text-xl">
            &times;
          </button>
        </div>
        <div className="text-sm">
          <p>
            <strong>Index:</strong> {block.index}
          </p>
          <p>
            <strong>Timestamp:</strong> {block.timestamp}
          </p>
          <p>
            <strong>Candidate:</strong>{" "}
            {block.candidateId === "GENESIS" ? "Genesis" : block.candidateName}
          </p>
          {block.wallet && (
            <p>
              <strong>Voter Wallet:</strong> {block.wallet}
            </p>
          )}
          <p>
            <strong>Previous Hash:</strong> {block.previousHash}
          </p>
          <p>
            <strong>Hash:</strong> {block.hash}
          </p>
        </div>
      </div>
    </div>
  );
};

// ------------------------------
// Main Election App Component
// ------------------------------
const Paper = () => {
  const [page, setPage] = useState("connection");
  const [candidates, setCandidates] = useState([]);
  const [blockchain, setBlockchain] = useState([]);
  const [results, setResults] = useState({});
  const [walletAddress, setWalletAddress] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  // New candidate registration fields
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newCandidateParty, setNewCandidateParty] = useState("");
  const [newCandidateWallet, setNewCandidateWallet] = useState("");
  const [newCandidateDeposit, setNewCandidateDeposit] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(null);
  // Reward distribution details
  const [rewardDetails, setRewardDetails] = useState(null);

  // ------------------------------
  // Initialize Data (from localStorage)
  // ------------------------------
  useEffect(() => {
    const initializeData = async () => {
      const storedCandidates = getCandidatesFromStorage();
      if (storedCandidates.length > 0) {
        setCandidates(storedCandidates);
      }

      let storedBlocks = getBlocksFromStorage();
      if (storedBlocks.length > 0) {
        setBlockchain(storedBlocks);
        // Calculate vote counts
        const counts = {};
        storedBlocks.forEach((block) => {
          if (block.candidateId !== "GENESIS") {
            counts[block.candidateId] = (counts[block.candidateId] || 0) + 1;
          }
        });
        setResults(counts);
      } else {
        // Create genesis block if no blocks exist
        const genesisBlock = {
          index: 0,
          timestamp: new Date().toISOString(),
          candidateId: "GENESIS",
          candidateName: "Genesis",
          previousHash: "0",
          hash: "",
        };
        genesisBlock.hash = await computeHash(JSON.stringify(genesisBlock));
        const newBlocks = [genesisBlock];
        setBlockchain(newBlocks);
        saveBlocksToStorage(newBlocks);
      }
    };

    initializeData();

    // Polling for updates every 5 seconds
    const pollInterval = setInterval(() => {
      const latestCandidates = getCandidatesFromStorage();
      const latestBlocks = getBlocksFromStorage();
      setCandidates(latestCandidates);
      setBlockchain(latestBlocks);
      const newCounts = {};
      latestBlocks.forEach((block) => {
        if (block.candidateId !== "GENESIS") {
          newCounts[block.candidateId] = (newCounts[block.candidateId] || 0) + 1;
        }
      });
      setResults(newCounts);
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);

  // ------------------------------
  // Wallet Connection (for voters)
  // ------------------------------
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error("User rejected wallet connection", err);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to vote.");
    }
  };

  // ------------------------------
  // Add Candidate (with wallet and deposit)
  // ------------------------------
  const handleAddCandidate = (e) => {
    e.preventDefault();
    if (
      newCandidateName.trim() === "" ||
      newCandidateParty.trim() === "" ||
      newCandidateWallet.trim() === "" ||
      newCandidateDeposit.trim() === ""
    ) {
      alert("Please provide candidate name, party, wallet, and deposit amount.");
      return;
    }
    const deposit = parseFloat(newCandidateDeposit);
    if (isNaN(deposit) || deposit <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }
    const newCandidate = {
      id: "c" + (candidates.length + 1).toString(),
      name: newCandidateName,
      party: newCandidateParty,
      wallet: newCandidateWallet,
      deposit: deposit,
    };
    const updatedCandidates = [...candidates, newCandidate];
    setCandidates(updatedCandidates);
    saveCandidatesToStorage(updatedCandidates);
    setNewCandidateName("");
    setNewCandidateParty("");
    setNewCandidateWallet("");
    setNewCandidateDeposit("");
  };

  // ------------------------------
  // Handle Voting
  // ------------------------------
  const handleVote = async (candidateId) => {
    if (!walletAddress) {
      alert("Please connect your MetaMask wallet before voting.");
      return;
    }
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;

    const previousBlock = blockchain[blockchain.length - 1];
    const newBlock = {
      index: previousBlock.index + 1,
      timestamp: new Date().toISOString(),
      candidateId: candidate.id,
      candidateName: candidate.name,
      wallet: walletAddress, // voter wallet
      previousHash: previousBlock.hash,
      hash: "",
    };
    newBlock.hash = await computeHash(JSON.stringify(newBlock));

    const updatedBlocks = [...blockchain, newBlock];
    setBlockchain(updatedBlocks);
    saveBlocksToStorage(updatedBlocks);
    setHasVoted(true);
    setSelectedCandidate(candidate.id);
    setResults((prev) => ({
      ...prev,
      [candidate.id]: (prev[candidate.id] || 0) + 1,
    }));

    setPage("afterVote");
  };

  // ------------------------------
  // Reward Winner: Calculate winner and distribute 75% of candidate deposits
  // ------------------------------
  const rewardWinner = () => {
    let winnerId = null;
    let maxVotes = -1;
    for (const id in results) {
      if (results[id] > maxVotes) {
        maxVotes = results[id];
        winnerId = id;
      }
    }
    if (!winnerId) {
      alert("No votes recorded yet.");
      return;
    }
    const winnerCandidate = candidates.find((c) => c.id === winnerId);
    if (!winnerCandidate) {
      alert("Winner candidate not found.");
      return;
    }
    const totalDeposits = candidates.reduce((sum, candidate) => sum + candidate.deposit, 0);
    const rewardAmount = totalDeposits * 0.75;
    setRewardDetails({
      winner: winnerCandidate,
      reward: rewardAmount,
    });
  };

  // ------------------------------
  // Render Different Pages
  // ------------------------------

  // Connection Page
  if (page === "connection") {
    return (
      <BackgroundStatic>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-4xl font-bold mb-5">Student Election 2025</h1>
          <p className="text-lg mb-5">Blockchain-Based Voting System</p>
          {walletAddress ? (
            <p className="text-green-400">Connected Wallet: {walletAddress}</p>
          ) : (
            <button
              onClick={connectWallet}
              className="px-5 py-3 bg-blue-500 hover:bg-blue-600 rounded"
            >
              Connect Wallet
            </button>
          )}
          <div className="mt-5">
            <button
              onClick={() => {
                if (walletAddress) {
                  setPage("candidates");
                } else {
                  alert("Please connect your wallet first.");
                }
              }}
              className="px-5 py-3 bg-green-500 hover:bg-green-600 rounded"
            >
              Proceed
            </button>
          </div>
        </div>
      </BackgroundStatic>
    );
  }

  // Candidates Page
  if (page === "candidates") {
    return (
      <BackgroundStatic>
        <div className="max-w-3xl mx-auto text-white">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Add Candidate</h2>
            <form onSubmit={handleAddCandidate} className="bg-gray-700 p-5 rounded-lg">
              <div className="mb-4">
                <label className="block mb-2">Candidate Name</label>
                <input
                  type="text"
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  className="w-full p-2 rounded border border-gray-400"
                  placeholder="Enter candidate name"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Party</label>
                <input
                  type="text"
                  value={newCandidateParty}
                  onChange={(e) => setNewCandidateParty(e.target.value)}
                  className="w-full p-2 rounded border border-gray-400"
                  placeholder="Enter party name"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Wallet Address</label>
                <input
                  type="text"
                  value={newCandidateWallet}
                  onChange={(e) => setNewCandidateWallet(e.target.value)}
                  className="w-full p-2 rounded border border-gray-400"
                  placeholder="Enter candidate wallet address"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Deposit Amount (Test Tokens)</label>
                <input
                  type="number"
                  value={newCandidateDeposit}
                  onChange={(e) => setNewCandidateDeposit(e.target.value)}
                  className="w-full p-2 rounded border border-gray-400"
                  placeholder="Enter deposit amount"
                />
              </div>
              <button type="submit" className="px-5 py-3 bg-green-500 hover:bg-green-600 rounded">
                Add Candidate
              </button>
            </form>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Candidates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="bg-gray-700 p-5 rounded-lg text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white mb-3">
                    {candidate.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-semibold">{candidate.name}</h3>
                  <p className="mb-1">{candidate.party}</p>
                  <p className="text-sm text-gray-400 mb-1">Fee: {candidate.deposit} tokens</p>
                  <p className="text-sm text-gray-400 mb-3">Wallet: {candidate.wallet}</p>
                  <button
                    onClick={() => handleVote(candidate.id)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
                  >
                    Vote
                  </button>
                </div>
              ))}
            </div>
          </section>
          <div className="text-center">
            <button
              onClick={() => setPage("results")}
              className="px-5 py-3 bg-green-500 hover:bg-green-600 rounded mr-2"
            >
              View Real Time Results
            </button>
          </div>
        </div>
      </BackgroundStatic>
    );
  }

  // After Vote Page
  if (page === "afterVote") {
    const candidate = candidates.find((c) => c.id === selectedCandidate);
    return (
      <BackgroundStatic>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-2xl font-bold mb-5">Thank you for voting!</h2>
          <p className="mb-5">
            {candidate ? `You voted for ${candidate.name}` : "Vote recorded."}
          </p>
          <button
            onClick={() => setPage("results")}
            className="px-5 py-3 bg-green-500 hover:bg-green-600 rounded"
          >
            View Results
          </button>
        </div>
      </BackgroundStatic>
    );
  }

  // Results Page
  if (page === "results") {
    const chartData = candidates.map((candidate) => ({
      name: candidate.name,
      votes: results[candidate.id] || 0,
    }));
    const maxVotes = Math.max(...chartData.map((d) => d.votes), 1);

    return (
      <BackgroundStatic>
        <div className="max-w-3xl mx-auto text-white">
          <h2 className="text-2xl font-bold text-center mb-5">Election Results</h2>
          <div className="bg-gray-700 p-5 rounded-lg mb-5">
            {chartData.map((data, index) => (
              <div key={index} className="mb-3">
                <div>
                  {data.name} ({data.votes} votes)
                </div>
                <div
                  className="h-5 bg-green-400 transition-all"
                  style={{ width: `${(data.votes / maxVotes) * 100}%` }}
                ></div>
              </div>
            ))}
          </div>
          <section className="mb-5">
            <h3 className="text-xl font-semibold mb-3">Blockchain Records</h3>
            <div>
              {blockchain.map((block) => (
                <div
                  key={block.index}
                  className="bg-gray-700 p-3 rounded mb-3 cursor-pointer"
                  onClick={() => {
                    setModalBlock(block);
                    setShowModal(true);
                  }}
                >
                  <div className="flex justify-between text-gray-400">
                    <span>Block #{block.index}</span>
                    <span>{new Date(block.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-gray-300 mt-1">
                    <p>
                      Candidate:{" "}
                      {block.candidateId === "GENESIS" ? "Genesis Block" : block.candidateName}
                    </p>
                    <p className="text-xs overflow-hidden whitespace-nowrap">
                      Hash: {block.hash}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <BlockModal
            isOpen={showModal}
            block={modalBlock}
            onClose={() => {
              setShowModal(false);
              setModalBlock(null);
            }}
          />
          <div className="text-center mt-5">
            <button
              onClick={() => setPage("candidates")}
              className="px-5 py-3 bg-blue-500 hover:bg-blue-600 rounded mr-2"
            >
              Back to Voting
            </button>
            <button
              onClick={() => setPage("connection")}
              className="px-5 py-3 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Disconnect
            </button>
          </div>
          <div className="text-center mt-5">
            <button
              onClick={rewardWinner}
              className="px-5 py-3 bg-yellow-500 hover:bg-yellow-600 rounded"
            >
              Reward Winner
            </button>
          </div>
          {rewardDetails && (
            <div className="mt-5 bg-gray-800 p-5 rounded text-center">
              <h3 className="text-xl font-semibold mb-2">Winner Reward</h3>
              <p>
                {rewardDetails.winner.name} (Wallet: {rewardDetails.winner.wallet})
                wins with {results[rewardDetails.winner.id] || 0} votes.
              </p>
              <p>
                Reward Amount: {rewardDetails.reward.toFixed(2)} test tokens (75% of
                total candidate deposits).
              </p>
            </div>
          )}
        </div>
      </BackgroundStatic>
    );
  }

  return null;
};

export default Paper;
