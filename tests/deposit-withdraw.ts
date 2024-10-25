import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DepositWithdraw } from "../target/types/deposit_withdraw";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

describe("deposit-withdraw", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  const wallet = provider.wallet as anchor.Wallet;
  anchor.setProvider(provider);

  const program = anchor.workspace.DepositWithdraw as Program<DepositWithdraw>;

  const authority = wallet;
  const amount = 1_000_000;

  it("Deposit", async () => {

    const transaction = await program.methods.deposit(new anchor.BN(amount))
        .accounts({depositor: authority.publicKey})
        .transaction()

    const transactionSignature = await anchor.web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [authority.payer],
        { commitment: "confirmed"}
    );

    console.log("Transaction Signature: ", transactionSignature);
  });

  it("Withdraw", async () => {

    // const withDrawInstruction = await program.methods.withdraw(new anchor.BN(amount))
    //     .accounts({authority: wallet.publicKey})
    //     .instruction();

    // const withdrawTx = new anchor.web3.Transaction().add(withDrawInstruction);

    const [pda, bump] = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("deposit")],
        program.programId
    );

    const bank_balance = await program.account.bank.fetch(pda);
    console.log(`Bank Balance: ${bank_balance.bankBalance.toNumber() / LAMPORTS_PER_SOL} SOL`);

    const withdrawTransaction = await program.methods
        .withdraw(new anchor.BN(amount))
        .accounts({
            authority: wallet.publicKey,
        })
        .transaction();

        const transactionSignature = await anchor.web3.sendAndConfirmTransaction(
            connection,
            withdrawTransaction,
            [wallet.payer],
            { commitment: "confirmed" }
        );

    console.log("Transaction Signature: ", transactionSignature);

    
  })

});
