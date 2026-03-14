from eth_account import Account
from mnemonic import Mnemonic

# Your recovery phrase (THIS IS EXPOSED - USE ONLY FOR TEST WALLET!)
seed_phrase = "recipe audit cargo ahead observe labor process machine awesome apology kit garden"

# Generate private key
Account.enable_unaudited_hdwallet_features()
account = Account.from_mnemonic(seed_phrase)
private_key = account.key.hex()

print(f"\n{'='*50}")
print("🔑 YOUR PRIVATE KEY:")
print(f"{'='*50}")
print(f"0x{private_key}")
print(f"{'='*50}")
print("\nAdd this to your .env file as:")
print(f"PRIVATE_KEY=0x{private_key}")
print(f"{'='*50}\n")