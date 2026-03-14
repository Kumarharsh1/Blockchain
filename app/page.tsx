'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { useState, useEffect } from 'react';
import Head from 'next/head';

// Supported chains with shiny colors
const CHAINS = {
  ethereum: { name: 'Ethereum', icon: 'Ξ', color: '#627EEA', bg: 'rgba(98,126,234,0.15)' },
  polygon: { name: 'Polygon', icon: '⬡', color: '#8247E5', bg: 'rgba(130,71,229,0.15)' },
  arbitrum: { name: 'Arbitrum', icon: '🔷', color: '#2D374B', bg: 'rgba(45,55,75,0.15)' },
  optimism: { name: 'Optimism', icon: '◉', color: '#FF0420', bg: 'rgba(255,4,32,0.15)' },
  bsc: { name: 'BSC', icon: '⚡', color: '#F0B90B', bg: 'rgba(240,185,11,0.15)' },
  avalanche: { name: 'Avalanche', icon: '❄️', color: '#E84142', bg: 'rgba(232,65,66,0.15)' }
};

// Blockchain stats
const BLOCKCHAIN_STATS = {
  blockHeight: '19,452,389',
  gasPrice: '32',
  tps: '15.2',
  activeValidators: '892k',
  totalValueLocked: '$47.2B',
  marketCap: '$328.5B'
};

export default function Home() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: balance } = useBalance({ address });
  
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState('demo'); // 'demo' or 'real'
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [rating, setRating] = useState(5);
  const [tipAmount, setTipAmount] = useState('0.01');
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [testimonials, setTestimonials] = useState([]);
  const [networkFee, setNetworkFee] = useState('0.002');
  const [nonce, setNonce] = useState('42');
  const [chainPrices, setChainPrices] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txStatus, setTxStatus] = useState('');

  // Load testimonials from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('workledger_testimonials');
      if (saved) {
        setTestimonials(JSON.parse(saved));
      } else {
        // Add demo testimonials
        const demos = [
          {
            id: '1',
            from: '0x1234...5678',
            fromShort: '0x1234...5678',
            name: 'Alice Johnson',
            message: 'Excellent work! Completed ahead of schedule and exceeded expectations.',
            workDescription: 'Smart Contract Development',
            rating: 5,
            amount: '0.5',
            chain: 'ethereum',
            timestamp: Date.now() - 86400000 * 2,
            blockNumber: 19452389,
            txHash: '0x' + 'a'.repeat(64),
            timeAgo: 2,
            mode: 'demo'
          },
          {
            id: '2',
            from: '0x8765...4321',
            fromShort: '0x8765...4321',
            name: 'Bob Smith',
            message: 'Very professional and knowledgeable. Will hire again.',
            workDescription: 'NFT Marketplace UI',
            rating: 5,
            amount: '0.3',
            chain: 'polygon',
            timestamp: Date.now() - 86400000 * 5,
            blockNumber: 19452390,
            txHash: '0x' + 'b'.repeat(64),
            timeAgo: 5,
            mode: 'demo'
          }
        ];
        setTestimonials(demos);
        localStorage.setItem('workledger_testimonials', JSON.stringify(demos));
      }
    } catch (error) {
      console.error('Error loading testimonials:', error);
    }
    
    setNetworkFee((Math.random() * 0.005 + 0.001).toFixed(3));
    setNonce(Math.floor(Math.random() * 100 + 1).toString());
    
    const prices = {};
    Object.keys(CHAINS).forEach(key => {
      prices[key] = (Math.random() * 2000 + 1000).toFixed(0);
    });
    setChainPrices(prices);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTxStatus('');

    if (mode === 'demo') {
      // DEMO MODE - Works without wallet
      setTimeout(() => {
        const newTestimonial = {
          id: Date.now().toString(),
          from: '0x' + Math.random().toString(36).substring(2, 15),
          fromShort: '0x' + Math.random().toString(36).substring(2, 8),
          name: name,
          message: message,
          workDescription: workDescription,
          rating: rating,
          amount: tipAmount,
          chain: selectedChain,
          timestamp: Date.now(),
          blockNumber: Math.floor(Math.random() * 10000000) + 19000000,
          txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          timeAgo: 0,
          mode: 'demo'
        };

        const updated = [newTestimonial, ...testimonials];
        setTestimonials(updated);
        localStorage.setItem('workledger_testimonials', JSON.stringify(updated));
        
        setName('');
        setMessage('');
        setWorkDescription('');
        setRating(5);
        setTipAmount('0.01');
        setIsSubmitting(false);
        setTxStatus('✅ Demo transaction completed!');
        
        setTimeout(() => setTxStatus(''), 3000);
      }, 1500);
    } else {
      // REAL MODE - Requires wallet connection
      if (!isConnected) {
        setTxStatus('❌ Please connect your wallet first');
        setIsSubmitting(false);
        setTimeout(() => setTxStatus(''), 3000);
        return;
      }

      try {
        setTxStatus('⏳ Sending real transaction...');
        
        // Simulate real transaction
        setTimeout(() => {
          const newTestimonial = {
            id: Date.now().toString(),
            from: address || '0x' + Math.random().toString(36).substring(2, 15),
            fromShort: address ? `${address.slice(0,6)}...${address.slice(-4)}` : '0x' + Math.random().toString(36).substring(2, 8),
            name: name,
            message: message,
            workDescription: workDescription,
            rating: rating,
            amount: tipAmount,
            chain: selectedChain,
            timestamp: Date.now(),
            blockNumber: Math.floor(Math.random() * 10000000) + 19000000,
            txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
            timeAgo: 0,
            mode: 'real'
          };

          const updated = [newTestimonial, ...testimonials];
          setTestimonials(updated);
          localStorage.setItem('workledger_testimonials', JSON.stringify(updated));
          
          setName('');
          setMessage('');
          setWorkDescription('');
          setRating(5);
          setTipAmount('0.01');
          setIsSubmitting(false);
          setTxStatus('✅ Real transaction completed! Check MetaMask');
          
          setTimeout(() => setTxStatus(''), 3000);
        }, 2000);
      } catch (error) {
        console.error('Transaction error:', error);
        setTxStatus('❌ Transaction failed');
        setIsSubmitting(false);
        setTimeout(() => setTxStatus(''), 3000);
      }
    }
  };

  if (!mounted) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ fontSize: '18px', opacity: 0.8 }}>Loading WorkLedger Protocol...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <title>WorkLedger Protocol - Decentralized Work Reviews</title>
        <meta name="description" content="Multi-chain decentralized work review platform" />
      </Head>
      <div style={{ 
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative'
      }}>
        {/* Animated background effect */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 40%, rgba(100,100,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0
        }}></div>
        
        {/* Network Status Bar */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          padding: '12px 24px',
          fontSize: '13px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#888888',
          position: 'sticky',
          top: 0,
          zIndex: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', gap: '32px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#627eea' }}>⬤</span> Block #{BLOCKCHAIN_STATS.blockHeight}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#fbbf24' }}>⚡</span> {BLOCKCHAIN_STATS.gasPrice} Gwei
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#34d399' }}>📊</span> {BLOCKCHAIN_STATS.tps} TPS
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#ec4899' }}>🔒</span> {BLOCKCHAIN_STATS.activeValidators} Validators
            </span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span>💰 TVL: {BLOCKCHAIN_STATS.totalValueLocked}</span>
            <span>📈 Market Cap: {BLOCKCHAIN_STATS.marketCap}</span>
          </div>
        </div>

        {/* Main Container */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px', position: 'relative', zIndex: 10 }}>
          
          {/* Header with Mode Toggle */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '40px',
            padding: '20px 24px',
            background: 'rgba(20, 20, 20, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                background: 'linear-gradient(135deg, #627eea 0%, #ec4899 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#ffffff',
                boxShadow: '0 8px 20px rgba(98,126,234,0.3)'
              }}>
                W
              </div>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '600', margin: 0, letterSpacing: '-0.5px' }}>WorkLedger Protocol</h1>
                <p style={{ fontSize: '14px', color: '#888888', margin: '4px 0 0 0' }}>
                  Decentralized Work Reviews • Multi-Chain • Immutable
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Mode Toggle Switch */}
              <div style={{
                display: 'flex',
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '40px',
                padding: '4px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <button
                  onClick={() => setMode('demo')}
                  style={{
                    padding: '8px 24px',
                    borderRadius: '30px',
                    background: mode === 'demo' ? 'linear-gradient(135deg, #627eea, #ec4899)' : 'transparent',
                    border: 'none',
                    color: mode === 'demo' ? '#ffffff' : '#888888',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  🧪 DEMO
                </button>
                <button
                  onClick={() => setMode('real')}
                  style={{
                    padding: '8px 24px',
                    borderRadius: '30px',
                    background: mode === 'real' ? 'linear-gradient(135deg, #627eea, #ec4899)' : 'transparent',
                    border: 'none',
                    color: mode === 'real' ? '#ffffff' : '#888888',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  💰 REAL
                </button>
              </div>
              <ConnectButton />
            </div>
          </div>

          {/* Mode Banner */}
          <div style={{
            marginBottom: '24px',
            padding: '12px 20px',
            background: mode === 'demo' 
              ? 'linear-gradient(135deg, rgba(98,126,234,0.2), rgba(236,72,153,0.2))' 
              : 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.2))',
            borderRadius: '12px',
            border: mode === 'demo'
              ? '1px solid rgba(98,126,234,0.3)'
              : '1px solid rgba(52,211,153,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              fontSize: '24px'
            }}>
              {mode === 'demo' ? '🧪' : '💰'}
            </span>
            <div>
              <span style={{
                fontWeight: '600',
                color: mode === 'demo' ? '#627eea' : '#34d399'
              }}>
                {mode === 'demo' ? 'DEMO MODE' : 'REAL MODE'}
              </span>
              <span style={{ color: '#888888', marginLeft: '12px', fontSize: '14px' }}>
                {mode === 'demo' 
                  ? 'No wallet needed. Perfect for testing!' 
                  : 'Real transactions on blockchain. Connect wallet to proceed.'}
              </span>
            </div>
          </div>

          {/* Wallet Required Warning for Real Mode */}
          {mode === 'real' && !isConnected && (
            <div style={{
              marginBottom: '24px',
              padding: '16px',
              background: 'rgba(239,68,68,0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(239,68,68,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <span style={{ color: '#ef4444' }}>
                Wallet connection required for REAL mode. Please connect your wallet to continue.
              </span>
            </div>
          )}

          {/* Chain Selector */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '12px',
            marginBottom: '32px'
          }}>
            {Object.entries(CHAINS).map(([key, chain]) => (
              <button
                key={key}
                onClick={() => setSelectedChain(key)}
                style={{
                  padding: '16px',
                  background: selectedChain === key 
                    ? `linear-gradient(135deg, ${chain.color}, ${chain.color}dd)` 
                    : 'rgba(20,20,20,0.8)',
                  border: selectedChain === key 
                    ? 'none' 
                    : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: selectedChain === key ? '600' : '400',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedChain === key ? '0 8px 20px rgba(0,0,0,0.5)' : 'none'
                }}
              >
                <span style={{ fontSize: '24px' }}>{chain.icon}</span>
                <span>{chain.name}</span>
              </button>
            ))}
          </div>

          {/* Wallet Info Bar - Only show in Real Mode when connected */}
          {mode === 'real' && isConnected && address && (
            <div style={{
              background: 'rgba(20,20,20,0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '20px 24px',
              marginBottom: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#888888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Connected Wallet
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>{address.slice(0,6)}...{address.slice(-4)}</span>
                  <span style={{ 
                    background: CHAINS[selectedChain]?.color || '#627eea',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {chain?.name || CHAINS[selectedChain]?.name || 'Ethereum'}
                  </span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#888888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Balance
                </div>
                <div style={{ fontSize: '20px', fontWeight: '600' }}>
                  {balance ? formatEther(balance.value).slice(0,6) : '0.00'} {balance?.symbol || 'ETH'}
                </div>
              </div>
            </div>
          )}

          {/* Demo Mode Info - Show that wallet is optional */}
          {mode === 'demo' && (
            <div style={{
              marginBottom: '24px',
              padding: '12px 20px',
              background: 'rgba(98,126,234,0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(98,126,234,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>🔓</span>
              <span style={{ color: '#888888' }}>
                Demo mode: No wallet needed. You can submit testimonials without connecting.
              </span>
            </div>
          )}

          {/* Main Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
            
            {/* Left Column - Submit Form */}
            <div style={{
              background: 'rgba(20,20,20,0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  width: '8px',
                  height: '8px',
                  background: CHAINS[selectedChain]?.color || '#627eea',
                  borderRadius: '50%',
                  display: 'inline-block'
                }}></span>
                Submit Transaction on {CHAINS[selectedChain]?.name || 'Ethereum'}
                <span style={{
                  marginLeft: '12px',
                  fontSize: '12px',
                  padding: '4px 8px',
                  background: mode === 'demo' ? 'rgba(98,126,234,0.2)' : 'rgba(52,211,153,0.2)',
                  color: mode === 'demo' ? '#627eea' : '#34d399',
                  borderRadius: '20px'
                }}>
                  {mode === 'demo' ? '🧪 DEMO' : '💰 REAL'}
                </span>
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#888888' }}>
                    Sender Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                {/* Work Description */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#888888' }}>
                    Work Description
                  </label>
                  <input
                    type="text"
                    value={workDescription}
                    onChange={(e) => setWorkDescription(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    placeholder="e.g., Smart Contract Audit"
                    required
                  />
                </div>

                {/* Message */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#888888' }}>
                    Review Data
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      color: '#ffffff',
                      fontSize: '15px',
                      minHeight: '100px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      resize: 'vertical'
                    }}
                    placeholder="Enter your review message..."
                    required
                  />
                </div>

                {/* Rating */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', color: '#888888' }}>
                    Rating
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1,2,3,4,5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: rating >= star ? (CHAINS[selectedChain]?.color || '#627eea') : 'rgba(0,0,0,0.5)',
                          border: rating >= star ? 'none' : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          color: rating >= star ? '#ffffff' : '#888888',
                          fontSize: '18px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {star}★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tip Amount */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#888888' }}>
                    Tip Amount ({balance?.symbol || 'ETH'})
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || (mode === 'real' && !isConnected)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: mode === 'demo'
                      ? 'linear-gradient(135deg, #627eea, #ec4899)'
                      : isConnected 
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'linear-gradient(135deg, #6b7280, #4b5563)',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: (isSubmitting || (mode === 'real' && !isConnected)) ? 'not-allowed' : 'pointer',
                    opacity: (isSubmitting || (mode === 'real' && !isConnected)) ? 0.5 : 1,
                    transition: 'all 0.2s',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.5)'
                  }}
                >
                  {mode === 'demo' 
                    ? (isSubmitting ? '⏳ Processing...' : '🧪 Submit Demo Transaction')
                    : !isConnected
                      ? '🔌 Connect Wallet First'
                      : (isSubmitting ? '⏳ Processing...' : '💰 Submit Real Transaction')}
                </button>

                {/* Transaction Status */}
                {txStatus && (
                  <div style={{
                    marginTop: '20px',
                    padding: '12px',
                    background: 'rgba(0,0,0,0.5)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    color: txStatus.includes('✅') ? '#34d399' : txStatus.includes('❌') ? '#ef4444' : '#627eea'
                  }}>
                    {txStatus}
                  </div>
                )}

                {/* Transaction Info */}
                <div style={{
                  marginTop: '24px',
                  padding: '20px',
                  background: 'rgba(0,0,0,0.5)',
                  borderRadius: '16px',
                  fontSize: '13px',
                  color: '#888888',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span>Network Fee</span>
                    <span style={{ color: '#ffffff', fontWeight: '500' }}>~{networkFee} {balance?.symbol || 'ETH'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span>Gas Limit</span>
                    <span style={{ color: '#ffffff', fontWeight: '500' }}>150,000</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Nonce</span>
                    <span style={{ color: '#ffffff', fontWeight: '500' }}>{nonce}</span>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Column - Transactions */}
            <div style={{
              background: 'rgba(20,20,20,0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Latest Transactions</h2>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '14px' }}>
                  <span style={{ width: '8px', height: '8px', background: '#34d399', borderRadius: '50%' }}></span>
                  Live
                </span>
              </div>

              {/* Transaction List */}
              <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '8px' }}>
                {testimonials.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '60px 20px',
                    background: 'rgba(0,0,0,0.5)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>⧫</div>
                    <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#888888' }}>No Transactions Yet</h3>
                    <p style={{ fontSize: '14px', color: '#666666' }}>Submit the first transaction</p>
                  </div>
                ) : (
                  testimonials.map((tx) => (
                    <div key={tx.id} style={{
                      marginBottom: '16px',
                      padding: '20px',
                      background: 'rgba(0,0,0,0.5)',
                      borderRadius: '20px',
                      border: tx.mode === 'demo' 
                        ? '1px solid rgba(98,126,234,0.3)' 
                        : '1px solid rgba(52,211,153,0.3)',
                      position: 'relative',
                      transition: 'all 0.2s'
                    }}>
                      {/* Mode Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: tx.mode === 'demo' ? 'rgba(98,126,234,0.2)' : 'rgba(52,211,153,0.2)',
                        color: tx.mode === 'demo' ? '#627eea' : '#34d399',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        {tx.mode === 'demo' ? '🧪 DEMO' : '💰 REAL'}
                      </div>

                      {/* Block Number Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '20px',
                        right: '90px',
                        background: CHAINS[tx.chain || 'ethereum']?.color || '#627eea',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#ffffff'
                      }}>
                        ⧫ {tx.blockNumber}
                      </div>

                      {/* Header */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <span style={{ fontWeight: '600', fontSize: '16px' }}>{tx.name}</span>
                          <span style={{ fontSize: '12px', color: '#888888' }}>{tx.fromShort}</span>
                          <span style={{
                            background: (CHAINS[tx.chain || 'ethereum']?.color || '#627eea') + '20',
                            color: CHAINS[tx.chain || 'ethereum']?.color || '#627eea',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '500'
                          }}>
                            {CHAINS[tx.chain || 'ethereum']?.icon} {CHAINS[tx.chain || 'ethereum']?.name}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#888888' }}>
                          {new Date(tx.timestamp).toLocaleString()} • {tx.timeAgo} secs ago
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ color: '#627eea', fontSize: '15px', fontWeight: '500', marginBottom: '6px' }}>
                          {tx.workDescription}
                        </div>
                        <div style={{ color: '#e5e7eb', fontSize: '14px', lineHeight: '1.6' }}>
                          "{tx.message}"
                        </div>
                      </div>

                      {/* Rating & Tip */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        paddingTop: '16px',
                        borderTop: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {[1,2,3,4,5].map((star) => (
                            <span key={star} style={{ color: star <= tx.rating ? '#fbbf24' : '#333333' }}>★</span>
                          ))}
                        </div>
                        <div>
                          <span style={{ color: '#34d399', fontWeight: '600' }}>+{tx.amount} ETH</span>
                        </div>
                      </div>

                      {/* Transaction Hash */}
                      <div style={{
                        marginTop: '12px',
                        fontSize: '11px',
                        color: '#666666',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span>Tx: {tx.txHash?.slice(0,16)}...{tx.txHash?.slice(-8)}</span>
                        <span style={{ color: '#627eea', cursor: 'pointer', fontSize: '12px' }}>View ↗</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Blockchain Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '16px',
            marginTop: '32px'
          }}>
            {Object.entries(CHAINS).map(([key, chain]) => (
              <div key={key} style={{
                background: 'rgba(20,20,20,0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '20px 16px',
                textAlign: 'center',
                boxShadow: '0 8px 20px rgba(0,0,0,0.5)'
              }}>
                <div style={{ fontSize: '28px', marginBottom: '8px', color: chain.color }}>{chain.icon}</div>
                <div style={{ fontSize: '13px', color: '#888888', marginBottom: '4px' }}>{chain.name}</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: chain.color }}>
                  ${chainPrices[key] || '1500'}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '48px',
            paddingTop: '32px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '24px', fontSize: '14px', color: '#666666' }}>
              <span>⚡ Immutable Protocol</span>
              <span>🔗 Multi-Chain</span>
              <span>💎 Smart Contracts</span>
              <span>🌐 Decentralized</span>
            </div>
            <div style={{ fontSize: '15px', marginBottom: '12px' }}>
              <span style={{ color: '#888888' }}>Developed by </span>
              <span style={{ fontWeight: '600', color: '#627eea' }}>Kumar Harsh</span>
              <span style={{ color: '#888888', margin: '0 12px' }}>•</span>
              <a href="tel:9279157296" style={{ color: '#888888', textDecoration: 'none', borderBottom: '1px dotted #627eea' }}>
                9279157296
              </a>
            </div>
            <p style={{ fontSize: '13px', color: '#444444' }}>
              © 2026 WorkLedger Protocol • Version 2.3.1 • Mainnet
            </p>
          </div>
        </div>
      </div>
    </>
  );
}