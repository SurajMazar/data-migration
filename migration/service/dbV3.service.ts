import {dv3Connection} from "../utils/prisma.utils";
import {exitWithErrorMessage} from "../utils/logger.utils";

/**
 *
 * @param count
 * @param size
 */
export const prepareBatch = (count: number, size: number = 100) => {
    const iterations = Math.floor(count / size);
    const batches = [];

    for (let i = 0; i < iterations; i++) {
        batches.push({
            skip: i * size,
            take: size
        });
    }

    batches.push({
        skip: iterations * size,
        take: size
    });

    return batches;
}

export const getV3DataCount = async (table:string) => {
    try {
        return await dv3Connection.$queryRawUnsafe(`SELECT COUNT(*)
                                                    FROM ${table}`) as any
    } catch (exception) {
        exitWithErrorMessage("Failed to count V3 data.")
    }
}

export const getDataFromV3Table = async (table: string, skip: number, take: number) => {
    try {
        dv3Connection.$connect()
        const data = await dv3Connection.$queryRawUnsafe(`SELECT *
                                                    FROM ${table} ORDER BY id LIMIT ${take}
                                                    OFFSET ${skip} `)
        dv3Connection.$disconnect()
        return data;
    } catch (exception) {
        exitWithErrorMessage("Failed to load V3 data.")
    }
}
