import { SubstrateEvent, SubstrateExtrinsic } from "@subql/types";
import { Transfer } from "../types";
import { Balance } from "@polkadot/types/interfaces";

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    // Get data from the event
    // The balances.transfer event has the following payload \[from, to, value\]
    logger.info(JSON.stringify(event));
    const fromAccount = event.event.data[0];
    const toAccount = event.event.data[1];
    const balanceChange = event.event.data[2];

    // Create the new transfer entity
    const transfer = new Transfer(
        `${event.block.block.header.number.toNumber()}-${event.idx}`,
    );
    transfer.blockNumber = event.block.block.header.number.toBigInt();
    transfer.fromAccount = fromAccount.toString();
    transfer.toAccount = toAccount.toString();
    transfer.balanceChange = (balanceChange as Balance).toBigInt();
    await transfer.save();
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
    const record = await Transfer.get(extrinsic.block.block.header.hash.toString());
    if (record) {
        //Date type timestamp
        logger.info("==timestamp=" + extrinsic.block.timestamp);
        record.timestamp = extrinsic.block.timestamp;
        await record.save();
    }
}
