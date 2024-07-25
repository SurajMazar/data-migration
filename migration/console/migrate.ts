import {getInput, getMigrationSchemaMappings} from "../utils/helper.util";
import {successLog} from "../utils/logger.utils";
import {getV3DataCount, prepareBatch} from "../service/dbV3.service";
import {importDataToV4} from "../service/db.service";

/**
 *
 */
export const init = async () => {
    /**
     * GETTING USER INPUT
     */
    const v3Table = getInput('--v3-table=')
    const v4Table = getInput('--v4-table=')
    const msName = getInput('--mf-name=')

    successLog("Input field verified.")

    /**
     *
     */
    const fileMapping = getMigrationSchemaMappings(msName ?? '')
    successLog("Schema mapping loaded.",)

    /**
     * TOTAL DATA COUNT
     */
    const dataCount = await getV3DataCount(v3Table ?? '')
    successLog(`Total data to migrate - ${Number(dataCount[0].count)}`)

    /**
     * BATCH
     */
    const batch = prepareBatch(Number(dataCount[0].count), 1000)
    successLog(`Total batches - ${batch.length} - 1000 data per batch`)

    await importDataToV4(batch, fileMapping, v3Table ?? '', v4Table ?? '')
    successLog(`Data migration completed `)
}



