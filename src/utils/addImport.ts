import cast from "magicast";
import { MergeRecursive } from "./merge";

export function addImport(mainImports: cast.ProxifiedImportsMap, newImports: string): cast.ProxifiedImportsMap {
    const newImportMap = cast.parseModule(newImports).imports;
    return MergeRecursive(mainImports, newImportMap)
}