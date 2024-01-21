import * as anchor from "@project-serum/anchor";
import { Program, Wallet } from "@project-serum/anchor";
import { DstageSolanaContracts } from "../target/types/dstage_solana_contracts";
import { TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createInitializeMintInstruction, MINT_SIZE } from '@solana/spl-token'; // IGNORE THESE ERRORS IF ANY
const { SystemProgram } = anchor.web3;

describe("Dstage Solana Contracts ", () => {

  const provider = anchor.AnchorProvider.env();
  const wallet = provider.wallet as Wallet;

  anchor.setProvider(provider);

  const program = anchor.workspace.DstageSolanaContracts as Program<DstageSolanaContracts>;

  console.log("Program is ", program.programId);
  

  const mintKey: anchor.web3.Keypair = anchor.web3.Keypair.generate();

  // const associatedTokenAddress = undefined;

  let to_address: anchor.web3.Keypair = anchor.web3.Keypair.generate();
  // Get Associated token Account of 2 


  it("Testing Mint Function ", async () => {

    const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );

    console.log("token Meta Program ID is ", TOKEN_METADATA_PROGRAM_ID);
    

    const lamports: number =
      await program.provider.connection.getMinimumBalanceForRentExemption(
        MINT_SIZE
      );


    console.log("lamports are ", lamports);
    

    // Function to GetMatadata PDA 
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



    console.log("Here's Mint Key (NFT ID) ", mintKey.publicKey.toBase58());

    // Associated Token Account
    const NftTokenAccount = await getAssociatedTokenAddress(
      mintKey.publicKey,
      wallet.publicKey
    );

    // where the NFT will be Stored
    console.log("Associated Token Account is ", NftTokenAccount.toBase58());

    const mint_tx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.createAccount({
        // fromPubkey: payer of transaction and initialization fee
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKey.publicKey,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
        lamports,
      }),

      // init mint Account
      createInitializeMintInstruction(
        mintKey.publicKey,
        0,
        wallet.publicKey,
        wallet.publicKey
      ),

      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        NftTokenAccount,
        wallet.publicKey,
        mintKey.publicKey
      )

    );
    const metaDataAddress = await getMetadata(mintKey.publicKey);
    const masterEdition = await getMasterEdition(mintKey.publicKey);

    console.log("MetaData is ", metaDataAddress); 
    console.log("master Edition is ", masterEdition);

    const tx = await program.provider.sendAndConfirm(mint_tx, [mintKey]);
    console.log("Transaction is ", tx);

    const tx2 = await program.methods.mintNft(
      mintKey.publicKey,
      "https://arweave.net/y5e5DJsiwH0s_ayfMwYk-SnrZtVZzHLQDSTZ5dNRUHA",
      "APE NFT",
    ).accounts(
      {
        mintAuthority: wallet.publicKey,
        mint: mintKey.publicKey,
        metadata: metaDataAddress,
        tokenAccount: NftTokenAccount,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        payer: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        masterEdition: masterEdition,
        tokenProgram: TOKEN_PROGRAM_ID,

      })
      .rpc(
      {
        skipPreflight:true
      }
    );

    console.log("Transaction Log is ", tx2);

  });




  // it("Transfer NFT ", async () => {

  //   const lamports: number =
  //     await program.provider.connection.getMinimumBalanceForRentExemption(
  //       MINT_SIZE
  //     );

  //   let to_ata = await getAssociatedTokenAddress(
  //     // minKey of NFT and Address of to wallet
  //     mintKey.publicKey,
  //     to_address.publicKey
  //   );
  //   const mint_tx = new anchor.web3.Transaction().add(
  //     // Create Token Account (ATA Account)
  //     createAssociatedTokenAccountInstruction(
  //       wallet.publicKey, to_ata, to_address.publicKey, mintKey.publicKey
  //     )
  //   );

  //   const tx = await program.provider.sendAndConfirm(mint_tx, []);



  //   const NftTokenAccount = await getAssociatedTokenAddress(
  //     mintKey.publicKey,
  //     wallet.publicKey
  //   );

  //   let functionHsh = await program.methods.transferNft().accounts({
  //     tokenProgram: TOKEN_PROGRAM_ID,
  //     // From Should be ATA 
  //     from: NftTokenAccount,
  //     to: to_ata,
  //     fromAuthority: wallet.publicKey,
  //   }).rpc();

  //   console.log("5 Transfered to ", to_ata.toBase58());
  //   console.log("Transfer Hash is ", functionHsh);

  // });


});
