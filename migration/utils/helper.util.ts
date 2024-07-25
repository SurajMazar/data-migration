import * as fs from 'fs'
import * as path from 'path'
import {exitWithErrorMessage} from "./logger.utils";
import {argMapping} from "../constants/app.constant";

/**
 *
 * @param fileName
 */
export const getMigrationSchemaMappings = (fileName: string) => {
    try {
        const file = fs.readFileSync(path.join(__dirname, `../../column-mapping-files/${fileName}.json`))
        return JSON.parse(file.toString())
    } catch (exception) {
        exitWithErrorMessage("Unable to locate the schema mappings.")
    }
}

/*

 */
export const getInput = (tag:string) => {
    const processArgs = process.argv
    const findArg = processArgs.find(item => item.includes(tag))
    if (findArg) {
        const argInput = findArg.split(tag)
        if (argInput[1]) {
            return argInput[1]
        }
    }
    exitWithErrorMessage(argMapping[tag as '--mf-name='] ?? 'Invalid tag')
}
