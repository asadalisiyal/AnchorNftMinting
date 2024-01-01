import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { NftMinting } from "../target/types/nft_minting";
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createInitializeMintInstruction,
  MINT_SIZE,
} from "@solana/spl-token";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
const { PublicKey, SystemProgram } = anchor.web3; 
describe("nft_minting", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  
  

  it("Is initialized!", async () => {
    // Add your test here.
    // const tx = await program.methods.initialize().rpc();
    // console.log("Your transaction signature", tx);
    
    const program = anchor.workspace
    .NftMinting as Program<NftMinting>;
    const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
          "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        );
        const lamports: number =
          await program.provider.connection.getMinimumBalanceForRentExemption(
            MINT_SIZE
          );
        const getMetadata = async (
          mint: anchor.web3.PublicKey
        ): Promise<anchor.web3.PublicKey> => {
          return (
            await anchor.web3.PublicKey.findProgramAddress(
              [
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                mint.toBuffer(),
              ],
              TOKEN_METADATA_PROGRAM_ID
            )
          )[0];
        };
        const getMasterEdition = async (
          mint: anchor.web3.PublicKey
        ): Promise<anchor.web3.PublicKey> => {
          return (
            await anchor.web3.PublicKey.findProgramAddress(
              [
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                mint.toBuffer(),
                Buffer.from("edition"),
              ],
              TOKEN_METADATA_PROGRAM_ID
            )
          )[0];
        };
        const mintKey: anchor.web3.Keypair = anchor.web3.Keypair.generate();





        const NftTokenAccount = await getAssociatedTokenAddress(
          mintKey.publicKey,
          provider.wallet.publicKey
        );
        console.log("NFT Account: ", NftTokenAccount.toBase58());
        const mint_tx = new anchor.web3.Transaction().add(
          anchor.web3.SystemProgram.createAccount({
            fromPubkey: provider.wallet.publicKey,
            newAccountPubkey: mintKey.publicKey,
            space: MINT_SIZE,
            programId: TOKEN_PROGRAM_ID,
            lamports,
          }),
          createInitializeMintInstruction(
            mintKey.publicKey,
            0,
            provider.wallet.publicKey,
            provider.wallet.publicKey
          ),
          createAssociatedTokenAccountInstruction(
            provider.wallet.publicKey,
            NftTokenAccount,
            provider.wallet.publicKey,
            mintKey.publicKey
          )
        );
        console.log(program);
        const res = await program.provider.sendAndConfirm(mint_tx, [mintKey]);
        console.log(
          await program.provider.connection.getParsedAccountInfo(mintKey.publicKey)
        );
        console.log("Account: ", res);
        console.log("Mint key: ", mintKey.publicKey.toString());
        console.log("User: ", provider.wallet.publicKey.toString());
        const metadataAddress = await getMetadata(mintKey.publicKey);
        const masterEdition = await getMasterEdition(mintKey.publicKey);
        console.log("Metadata address: ", metadataAddress.toBase58());
        console.log("MasterEdition: ", masterEdition.toBase58());
        console.log("TOKEN_PROGRAM_ID",TOKEN_PROGRAM_ID.toBase58());
        console.log("system", SystemProgram.programId.toBase58());
        console.log("rent",anchor.web3.SYSVAR_RENT_PUBKEY.toBase58());
      
        console.log(await program.rpc);
        const tx = await program.rpc.mintNft(
          mintKey.publicKey,
          "https://arweave.net/y5e5DJsiwH0s_ayfMwYk-SnrZtVZzHLQDSTZ5dNRUHA",
          "NFT Title",
          {
            accounts: {
              mintAuthority: provider.wallet.publicKey,
              mint: mintKey.publicKey,
              tokenAccount: NftTokenAccount,
              tokenProgram: TOKEN_PROGRAM_ID,
              metadata: metadataAddress,
              tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
              payer: provider.wallet.publicKey,
              systemProgram: SystemProgram.programId,
              rent: anchor.web3.SYSVAR_RENT_PUBKEY,
              masterEdition: masterEdition
            },
          }
        );
        console.log("Your transaction signature", tx);
  });


  
});
