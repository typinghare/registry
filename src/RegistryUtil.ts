import { Registry } from './registry/Registry'
import { ResKey } from './res/ResKey'
import { RegistryBuiltin } from './RegistryBuiltin'
import { ResLocBuilder } from './res/ResLocBuilder'
import { DefaultRegistry } from './registry/DefaultRegistry'
import { ResLoc } from './res/ResLoc'

/**
 * A utility class encompassing helper functions.
 */
export class RegistryUtil {
    /**
     * Creates a resource location.
     * @param path The path of the location.
     * @param builder The builder used to builder the location.
     */
    public static createLoc(
        path: string,
        builder: ResLocBuilder = RegistryBuiltin.RES_LOC_BUILDER,
    ): ResLoc {
        return builder.create(path)
    }

    /**
     * Creates a registry key.
     * @param path The path of the key.
     * @param resLocBuilder The resource location builder to build the key.
     */
    public static createRegistryKey(
        path: string,
        resLocBuilder: ResLocBuilder = RegistryBuiltin.RES_LOC_BUILDER,
    ): ResKey {
        return new ResKey(RegistryBuiltin.ROOT_LOC, resLocBuilder.create(path))
    }

    /**
     * Creates a registry.
     * @param path The path of the registry key.
     * @param resLocBuilder The resource location builder to build the key.
     */
    public static createRegistry<T>(
        path: string,
        resLocBuilder: ResLocBuilder = RegistryBuiltin.RES_LOC_BUILDER,
    ): Registry<T> {
        const registryKey = RegistryUtil.createRegistryKey(path, resLocBuilder)
        return RegistryBuiltin.ROOT_REGISTRY.register(
            registryKey.getLoc(), new DefaultRegistry<T>(registryKey),
        )
    }
}