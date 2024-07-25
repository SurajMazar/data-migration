import {dv4Connection} from "../utils/prisma.utils";
import {getDataFromV3Table} from "./dbV3.service";
import {setReplica, upSortDataToV4} from "./dbv4.service";

export const importDataToV4 = async (batches: {
    skip: number,
    take: number
}[], mappings: object, tableV3: string, tableV4: string) => {

    await dv4Connection.$transaction(async (tx: any) => {
        await setReplica(tx,'replica')
        for (let i = 0; i < batches.length; i++) {
            const data = await getDataFromV3Table(tableV3, batches[i]?.skip, batches[i]?.take)
            await upSortDataToV4(tx, tableV4, data, mappings, i + 1)
        }
        await setReplica(tx,'origin')
    })
}
