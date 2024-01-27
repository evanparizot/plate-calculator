import { Unit } from "./unit";

export interface PlateDetails {
    weight: number;
    color: string;
}

export class PlateSet {
    static readonly POUNDS = new PlateSet(Unit.lbs,
        [
            { weight: 45, color: "#000000" },
            { weight: 35, color: "#000000" },
            { weight: 25, color: "#000000" },
            { weight: 10, color: "#000000" },
            { weight: 5, color: "#000000" },
            { weight: 2.5, color: "#000000" },
        ],
    );
    static readonly KILOGRAMS = new PlateSet(Unit.kgs,
        [
            { weight: 25, color: "#fc0303" },
            { weight: 20, color: "#0356fc" },
            { weight: 15, color: "#fcd303" },
            { weight: 10, color: "#0ea144" },
            { weight: 5, color: "#ffffff" },
            { weight: 2.5, color: "#000000" },
            { weight: 1.25, color: "#b9b9bd" },
            { weight: 0.5, color: "#b9b9bd" },
            { weight: 0.25, color: "#b9b9bd" },
        ]
    )

    readonly unit: Unit;
    readonly plates: PlateDetails[];

    private constructor(unit: Unit, plates: PlateDetails[]) {
        this.unit = unit;
        this.plates = plates;
    }
}