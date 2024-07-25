import {exitWithErrorMessage, successLog} from "../utils/logger.utils";

export const setReplica = async (tx: any, replicationRole: string) => {
    try {
        await tx.$queryRawUnsafe(`SET session_replication_role = '${replicationRole}';`)
        successLog(`Replica set to ${replicationRole}`)
    } catch (e) {
        exitWithErrorMessage('Error setting replica.')
    }
}


export const upSortDataToV4 = async (tx: any, table: string, data: any, mappings: Object, batch = 1) => {
    try {
        const formatData = data.map((item: any) => {
            const formatted = {...item}

            Object.entries(mappings).forEach((item) => {
                if (item[0] in formatted) {
                    formatted[item[1]] = formatted[item[0]]
                    delete formatted[item[0]]
                }
            })

            return formatted
        })

        let columns = ''
        const values = []
        for (let j = 0; j < formatData.length; j++) {
            const item = formatData[j]
            if (!columns) {
                columns = Object.keys(item).join(',')
            }
            values.push(Object.values(item).map(item => {
                if (item) {
                    if (Object.prototype.toString.call(item) === '[object Object]') {
                        return `'${JSON.stringify(item)}'::jsonb`
                    }

                    if (item instanceof Date) {
                        return `'${item.toISOString()}'`
                    }

                    if (typeof item === 'string') {
                        return `'${item}'`
                    }

                    return item
                }
                return 'null'
            }).join(','))
        }

        /**
         * UP SORT STATEMENT
         */
        const valuesFormatted = values.map(item => `(${item})`).join(',')

        /**
         * UP SORT QUERY
         */
        await tx.$queryRawUnsafe(`INSERT INTO ${table} (${columns})
                                      VALUES ${valuesFormatted}`)

        successLog(`Batch ${batch} completed.`)
    } catch (exception) {
        exitWithErrorMessage(exception)
    }
}
