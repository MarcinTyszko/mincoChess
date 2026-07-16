import openingLines from "@/resources/openingLines.json" with { type: "json" };
import PieceColour from "@/constants/PieceColour";

export interface OpeningVariation {
    eco: string;
    name: string;
    moves: string[];
}

export interface OpeningFamily {
    name: string;
    eco: string;
    mainLine: OpeningVariation;
    variations: OpeningVariation[];
    /**
     * The side whose repertoire this opening belongs to. The main line
     * ending on White's move means the opening is defined by White,
     * and vice versa.
     */
    learnerColour: PieceColour;
}

export function getVariationId(variation: OpeningVariation) {
    return `${variation.name}|${variation.moves.join(" ")}`;
}

/**
 * @description The name of the opening family that a full opening name
 * belongs to, e.g. "Ruy Lopez: Morphy Defense" -> "Ruy Lopez".
 */
export function getOpeningFamilyName(openingName: string) {
    return openingName.split(":")[0].trim();
}

let familiesCache: OpeningFamily[] | undefined;

export function getOpeningFamilies(): OpeningFamily[] {
    if (familiesCache) return familiesCache;

    const variationGroups = new Map<string, OpeningVariation[]>();

    for (const variation of openingLines as OpeningVariation[]) {
        const familyName = getOpeningFamilyName(variation.name);
        const group = variationGroups.get(familyName);

        if (group) {
            group.push(variation);
        } else {
            variationGroups.set(familyName, [variation]);
        }
    }

    familiesCache = [...variationGroups.entries()]
        .map(([name, variations]) => {
            const mainLine = variations.find(
                variation => variation.name == name
            ) || variations.reduce((shortest, variation) => (
                variation.moves.length < shortest.moves.length
                    ? variation : shortest
            ));

            return {
                name: name,
                eco: mainLine.eco,
                mainLine: mainLine,
                variations: variations,
                learnerColour: mainLine.moves.length % 2 == 1
                    ? PieceColour.WHITE
                    : PieceColour.BLACK
            };
        })
        .sort((first, second) => (
            second.variations.length - first.variations.length
            || first.name.localeCompare(second.name)
        ));

    return familiesCache;
}

export function getOpeningFamily(name: string) {
    return getOpeningFamilies().find(
        family => family.name == name
    );
}
