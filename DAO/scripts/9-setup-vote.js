import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// This is our governance contract.
const voteModule = sdk.getVoteModule(
    "0xF471beBF3A2D73274F0F50d2F0eB4825d00682E3",
);

// This is our ERC-20 contract.
const tokenModule = sdk.getTokenModule(
    "0x9dE43f37186883C021B211c0075abc8732C4f1Fb",
);

(async () => {
    try {
        // Give our treasury the power to mint additional token if needed.
        await tokenModule.grantRole("minter", voteModule.address);

        console.log(
            "Successfully gave vote module permissions to act on token module"
        );
    } catch (error) {
        console.error(
            "failed to grant vote module permissions on token module",
            error
        );
        process.exit(1);
    }

    try {
        // Grab our wallet's token balance, remember -- we hold basically the entire supply right now!
        const ownedTokenBalance = await tokenModule.balanceOf(
            // The wallet address stored in your env file or Secrets section of Repl
            process.env.WALLET_ADDRESS
        );

        // Grab 90% of the supply that we hold.
        const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
        const percent90 = ownedAmount.div(100).mul(90);

        // Transfer 90% of the supply to our voting contract.
        await tokenModule.transfer(
            voteModule.address,
            percent90
        );

        console.log("✅ Successfully transferred tokens to vote module");
    } catch (err) {
        console.error("failed to transfer tokens to vote module", err);
    }
})();
