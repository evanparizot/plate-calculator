import { Unit } from "../model/unit";

export const convert = (inputWeight: number, inputUnit: Unit) => {
    return inputUnit === Unit.lbs ? inputWeight / 2.205 : inputWeight * 2.205;
};