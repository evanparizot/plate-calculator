import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Chip, Grid, InputAdornment, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';

import './App.css';

function App() {
  enum WeightUnit {
    lbs = 'lbs',
    kgs = 'kgs'
  }

  enum Barbell {
    STANDARD,
    STANDARD_THICK,
    SAFETY,
    SWISS,
    EZ
  }

  interface BarbellInformation {
    name: string;
    weight: number;
  }

  const barbells: Map<Barbell, BarbellInformation> = new Map([
    [Barbell.STANDARD, { name: 'Straight', weight: 45 }],
    [Barbell.STANDARD_THICK, { name: 'Straight (Heavy)', weight: 55 }],
    [Barbell.SAFETY, { name: 'Safety', weight: 60 }],
    [Barbell.SWISS, { name: 'Swiss', weight: 35 }],
    [Barbell.EZ, { name: 'EZ', weight: 15 }],
  ]);

  interface PlateInformation {
    weight: number;
    color: string;
  }

  const platesMap: Map<WeightUnit, PlateInformation[]> = new Map([
    [WeightUnit.lbs, [
      { weight: 45, color: '#000000' },
      { weight: 35, color: '#000000' },
      { weight: 25, color: '#000000' },
      { weight: 10, color: '#000000' },
      { weight: 5, color: '#000000' },
      { weight: 2.5, color: '#000000'}
    ]],
    [WeightUnit.kgs, [
      { weight: 25, color: '#fc0303' },
      { weight: 20, color: '#0356fc' },
      { weight: 15, color: '#fcd303' },
      { weight: 10, color: '#0ea144' },
      { weight: 5, color: '#ffffff' },
      { weight: 2.5, color: '#000000' },
      { weight: 1.25, color: '#b9b9bd' },
      { weight: .5, color: '#b9b9bd' },
    ]]
  ]);

  const [inputWeight, setInputWeight] = useState<number>(185);
  const [inputWeightUnit, setInputWeightUnit] = useState<WeightUnit>(WeightUnit.lbs);
  const [availableWeightUnit, setAvailableWeightUnit] = useState<WeightUnit>(WeightUnit.lbs);
  const [barbell, setBarbell] = useState<Barbell>(Barbell.STANDARD);
  const [plates, setPlates] = useState<PlateInformation[]>([]);

  const newTargetWeight = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputWeight(parseInt(event.target.value));
  }

  const newTargetWeightUnit = (_event: any, newValue: WeightUnit) => {
    newValue !== null && setInputWeightUnit(newValue);
  }

  const newAvailableWeightUnit = (_event: any, newValue: WeightUnit) => {
    newValue !== null && setAvailableWeightUnit(newValue);
  }

  const newBarbell = (_event: any, newValue: Barbell) => {
    newValue !== null && setBarbell(newValue);
  }

  const adjustWeight = (adjustment: number) => {
    setInputWeight(inputWeight + adjustment);
  }

  const normalize = (input: string) => {

  }

  const calculate = (target: number, plates: PlateInformation[]): PlateInformation[] => {
    let res: PlateInformation[] = [];
    let w: number = target;

    console.log('Input Weight: ' + w);
    console.log('Plates: ' + plates);

    plates.forEach(p => {
      const mod = w / p.weight;
      if (mod >= 1) {
        let rounded = Math.floor(mod);

        for (let i = 0; i < rounded; i++) {
          res.push(p)
        }

        w = w - (rounded * p.weight);
      }
    });

    console.log(res);

    return res;
  }

  useEffect(() => {
    let weightInLbs = inputWeightUnit === WeightUnit.kgs ? inputWeight * 2.205 : inputWeight;
    let dividedWeight = (weightInLbs - barbells.get(barbell)!.weight) / 2;
    let finalConvertedWeight = availableWeightUnit === WeightUnit.kgs ? dividedWeight / 2.205 : dividedWeight;
    const ans = calculate(finalConvertedWeight, platesMap.get(availableWeightUnit)!);

    setPlates(ans);
  }, [inputWeight, inputWeightUnit, availableWeightUnit, barbell]);

  return (
    <Grid container spacing={2}>
      <Grid xs></Grid>
      <Grid xs={6}>
        <div className='title'>
          <h1>Plate Calculator</h1>
        </div>
        <div className="available-box">
          Available Plate Units
          <ToggleButtonGroup color='primary' exclusive value={availableWeightUnit} onChange={newAvailableWeightUnit}>
            <ToggleButton value={WeightUnit.lbs}>LBs</ToggleButton>
            <ToggleButton value={WeightUnit.kgs}>KGs</ToggleButton>
          </ToggleButtonGroup>

        </div>
        <div className="barbell-box">
          <ToggleButtonGroup color='primary' exclusive value={barbell} onChange={newBarbell}>
            {[...barbells.keys()].map(bar => (<ToggleButton value={bar}>{barbells.get(bar)!.name}</ToggleButton>))}
          </ToggleButtonGroup>
        </div>
        <div className='input-box'>
          <div className='input-weight-box'>
            <TextField type='number'
              variant='outlined'
              label='Input Weight'
              value={inputWeight}
              onChange={newTargetWeight}
              InputProps={{
                endAdornment: <InputAdornment position='end'>{inputWeightUnit}</InputAdornment>
              }}
            />
            <ToggleButtonGroup color='primary' exclusive value={inputWeightUnit} onChange={newTargetWeightUnit}>
              <ToggleButton value={WeightUnit.lbs}>LBs</ToggleButton>
              <ToggleButton value={WeightUnit.kgs}>KGs</ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div className='input-weight-adjust-box'>
            <ButtonGroup variant='contained'>
              <Button onClick={() => adjustWeight(-10)}>- 10</Button>
              <Button onClick={() => adjustWeight(-5)}>- 5</Button>
              <Button onClick={() => adjustWeight(5)}>+ 5</Button>
              <Button onClick={() => adjustWeight(10)}>+ 10</Button>
            </ButtonGroup>
          </div>
        </div>

        <div className='plates-box'>
          {plates.map(p => (<Chip label={p.weight} />))}
        </div>
      </Grid>
      <Grid xs></Grid>
    </Grid>
  );
}

export default App;
