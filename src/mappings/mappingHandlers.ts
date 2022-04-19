import { SubstrateEvent } from "@subql/types";
import { Events } from "../types";

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    const { event: { data, section, method }, idx } = event;

    if (section === 'system' && method === 'ExtrinsicSuccess') {
        return
    }

    try {
        const blockHeight = event.block.block.header.number.toNumber()
        const extrinsicHash = event.extrinsic?.extrinsic.hash.toString()
        const blockHash = event.block.block.hash.toString()
        const blockTimestamp = event.block.timestamp
        const record = new Events(`${blockHeight}-${idx}`)
        record.blockHash = blockHash
        record.blockHeight = blockHeight
        record.idx = idx
        record.extrinsicHash = extrinsicHash
        record.module = section
        record.method = method
        record.data = data.toString()
        record.timestamp = blockTimestamp

        await record.save()
        logger.debug(`new event: %o \n`, record)
    } catch (e: any) {
        logger.error(`handle event error: ${e.message}`)
    }
}