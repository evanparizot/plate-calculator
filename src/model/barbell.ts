import { Unit } from "./unit";

export class Barbell {
    static readonly STANDARD = new Barbell("Standard", 45, 20.4)

    readonly name: string;
    readonly pounds: number;
    readonly kilograms: number;

    private constructor(name: string, pounds: number, kilograms: number) {
        this.name = name;
        this.pounds = pounds;
        this.kilograms = kilograms;
    }

    public getWeight(unit: Unit): number {
        return unit === Unit.lbs ? this.pounds : this.kilograms;
    }
}
