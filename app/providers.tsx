'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, sepolia],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'WorkLedger Protocol',
  projectId: '297880c0eb39d93311a2af0988c97db6', // Get from https://cloud.walletconnect.com
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
