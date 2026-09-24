import { Product } from "@/api/products";

const STORAGE_KEY = "product_overrides_v1";

type Overrides = {
    added: Product[];
    edited: Record<number, Partial<Product>>;
    deletedIds: number[];
};


const emptyOverrides = (): Overrides => ({
    added: [],
    edited: {},
    deletedIds: [],
});


function readOverrides(): Overrides {
    if (typeof window === "undefined") return emptyOverrides();

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : emptyOverrides();
    } catch {
        return emptyOverrides();
    }
}

function writeOverrides(overrides: Overrides) {
    if (typeof window === "undefined") return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch {
        // ignore quota / private-mode errors
    }
}

export function generateLocalId(): number {
    return Date.now();
}

export function recordAddedProduct(product: Product) {
    const overrides = readOverrides();
    overrides.added = [product, ...overrides.added];
    writeOverrides(overrides);
}

export function recordEditedProduct(id: number, patch: Partial<Product>) {
    const overrides = readOverrides();

    const addedIndex = overrides.added.findIndex((p) => p.id === id);

    if (addedIndex !== -1) {
        overrides.added[addedIndex] = { ...overrides.added[addedIndex], ...patch };
    } else {
        overrides.edited[id] = { ...overrides.edited[id], ...patch };
    }

    writeOverrides(overrides);
}

export function recordDeletedProduct(id: number) {
    const overrides = readOverrides();

    if (!overrides.deletedIds.includes(id)) {
        overrides.deletedIds.push(id);
    }

    delete overrides.edited[id];
    overrides.added = overrides.added.filter((p) => p.id !== id);

    writeOverrides(overrides);
}

export function applyOverridesToList(
    products: Product[],
    total: number
): { products: Product[]; total: number } {
    const overrides = readOverrides();

    const withoutDeleted = products.filter(
        (p) => !overrides.deletedIds.includes(p.id)
    );

    const edited = withoutDeleted.map((p) =>
        overrides.edited[p.id] ? { ...p, ...overrides.edited[p.id] } : p
    );

    
    const result = [...edited];
    const removedCount = products.length - withoutDeleted.length;

    return {
        products: result,
        total: total - removedCount + overrides.added.length,
    };
}


export function applyOverridesToSingle(product: Product): Product | null {
    const overrides = readOverrides();

    if (overrides.deletedIds.includes(product.id)) return null;

    return overrides.edited[product.id]
        ? { ...product, ...overrides.edited[product.id] }
        : product;
}

export function getLocallyAddedProducts(): Product[] {
    return readOverrides().added;
}

export function getLocalProductById(id: number): Product | null {
    const overrides = readOverrides();
    return overrides.added.find((p) => p.id === id) ?? null;
}