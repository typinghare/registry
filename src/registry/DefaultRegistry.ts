import { Registry } from './Registry'
import { ResLoc } from '../res/ResLoc'
import { ResKey } from '../res/ResKey'
import { Ref } from '../res/Ref'
import { ResKeyConflictException } from './ResKeyConflictException'
import { ResNotFoundException } from './ResNotFoundException'
import { ResNotRegisteredException } from './ResNotRegisteredException'

/**
 * Default implementation of registry.
 */
export class DefaultRegistry<T = any> extends Registry<T> {
    /**
     * A mapping from location strings to resource keys.
     * @private
     */
    private readonly keyMap: Map<string, ResKey> = new Map()

    /**
     * The list of references. The index of the reference serves as its ID.
     * @private
     */
    private readonly byId: Ref<T>[] = []

    /**
     * A mapping from res locations to resource references.
     * @private
     */
    private readonly byLoc: Map<ResLoc, Ref<T>> = new Map()

    /**
     * A mapping from resources to resource locations.
     * @private
     */
    private readonly byResource: Map<T, ResLoc> = new Map

    /**
     * Creates a builtin registry.
     * @param resKey The resource key of this registry.
     */
    public constructor(resKey: ResKey) {
        super(resKey)
    }

    public override getByKey(resKey: ResKey): T {
        return this.getByLoc(resKey.getLoc())
    }

    public override getRef(resLoc: ResLoc): Ref<T> {
        if (!this.byLoc.has(resLoc)) {
            const _resKey = this.keyMap.get(resLoc.toString())
            if (!_resKey) {
                throw new ResNotFoundException(resLoc)
            }

            return this.getRef(_resKey.getLoc())
        }

        const reference = this.byLoc.get(resLoc)

        if (!reference) {
            throw new ResNotFoundException(resLoc)
        }

        return reference
    }

    public override getByLoc(resLoc: ResLoc): T {
        return this.getRef(resLoc).getResource()
    }

    public override getResKey(resLoc: ResLoc): ResKey {
        const resKey = this.keyMap.get(resLoc.toString())

        if (!resKey) {
            throw new ResNotFoundException(resLoc)
        }

        return resKey
    }

    public override register(resLoc: ResLoc, res: T): T {
        const locationString = resLoc.toString()
        const resKey = new ResKey(this.getKey().getLoc(), resLoc)
        if (this.keyMap.get(locationString)) {
            throw new ResKeyConflictException(resKey)
        }

        const reference = new Ref(resKey, res, this.byId.length)
        this.keyMap.set(resLoc.toString(), resKey)
        this.byId.push(reference)
        this.byLoc.set(resLoc, reference)
        this.byResource.set(res, resLoc)

        return res
    }

    public override getLocByRes(res: T): ResLoc {
        const location = this.byResource.get(res)

        if (!location) {
            throw new ResNotRegisteredException(res)
        }

        return location
    }

    public override getRefList(): Ref<T>[] {
        return this.byId
    }
}