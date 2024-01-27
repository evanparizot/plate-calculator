import { PlateDetails, PlateSet } from "../model/plate";
import { Unit } from "../model/unit";
import { convert } from "./convert";

export function calculate(target: number, inputUnit: Unit, plateUnit: Unit): Map<PlateDetails, number> {
    let result: Map<PlateDetails, number> = new Map();

    let workingTarget = inputUnit !== plateUnit ? convert(target, inputUnit) : target;
    let plateSet = plateUnit === Unit.lbs ? PlateSet.POUNDS : PlateSet.KILOGRAMS;

    plateSet.plates.forEach((p) => {
        const mod = workingTarget / p.weight;
        if (mod >= 1) {
            let rounded = Math.floor(mod);

            for (let i = 0; i < rounded; i++) {
                result.get(p) ? result.set(p, result.get(p)! + 1) : result.set(p, 1);
            }

            workingTarget = workingTarget - rounded * p.weight;
        }
    });

    return result;
}
