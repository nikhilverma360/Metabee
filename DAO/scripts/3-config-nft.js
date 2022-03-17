import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
    "0xEDD528789fd02c12fC6a1cd2841f7cA1FAB7472f",
);

(async () => {
    try {
        await bundleDrop.createBatch([
            {
                name: "Leaf Village Headband",
                description: "This NFT will give you access to HypermetaDAO!",
                image: readFileSync("scripts/assets/hypermeta.png"),
            },
        ]);
        console.log("✅ Successfully created a new NFT in the drop!");
    } catch (error) {
        console.error("failed to create the new NFT", error);
    }
})()