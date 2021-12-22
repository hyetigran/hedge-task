import { Mint, Wallet } from "./db";

/**
 * Delete the entire database
 */
export async function deleteDatabase(db: any) {
  await db.delete();
}

/**
 * Open a  database
 */
export async function openDatabase(db: any) {
  await db.open();
}

/**
 * Clear all tables
 */
export async function clearAllTables(db: any) {
  await Promise.all([db.wallets.clear()]);
}

/**
 * Read all wallets
 */
export async function readAllWallets(db: any) {
  return await db.wallets.toArray();
}

/**
 * Create a wallet
 *
 * Note that since the wallet is guaranteed
 * to have a unique ID we are using `put`
 * to update the databse.
 */
export async function createWallet(db: any, wallet: Wallet): Promise<string> {
  return await db.wallets.put(wallet);
}

/**
 * Read a wallet
 */
export async function readWallet(db: any, walletGID: string) {
  return await db.wallets.get(walletGID);
}

/**
 * Update wallet
 */
export async function updateWallet(db: any, wallet: Wallet) {
  return await db.wallets.put(wallet);
}

/**
 * Create a mint
 *
 * Note that since the mint is guaranteed
 * to have a unique ID we are using `put`
 * to update the databse.
 */
export async function createMint(db: any, mint: Mint) {
  return await db.mints.put(mint);
}
/**
 * Load mint records and
 * update the corresponding wallet id fields.
 */
export async function loadWalletMints(gid: string, db: any): Promise<Mint[]> {
  return await db.mints.where("walletId").equals(gid).toArray();
}
