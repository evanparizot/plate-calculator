import React, { useEffect, useState } from 'react';
import { Accordion, Box, Button, ButtonGroup, Chip, Divider, Grid, InputAdornment, Paper, TextField, ThemeProvider, ToggleButton, ToggleButtonGroup, Typography, styled } from '@mui/material';

import './App.scss';

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
      { weight: 2.5, color: '#000000' }
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
  const [plates, setPlates] = useState<Map<PlateInformation, number>>(new Map());

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

  const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
      // margin: theme.spacing(0.5),
      border: 0,
      '&.Mui-disabled': {
        border: 0,
      },
      '&:not(:first-of-type)': {
        borderRadius: theme.shape.borderRadius,
      },
      '&:first-of-type': {
        borderRadius: theme.shape.borderRadius,
      },
    },
  }));

  const calculate = (target: number, plates: PlateInformation[]): Map<PlateInformation, number> => {
    let res: Map<PlateInformation, number> = new Map();
    let w: number = target;

    plates.forEach(p => {
      const mod = w / p.weight;
      if (mod >= 1) {
        let rounded = Math.floor(mod);

        for (let i = 0; i < rounded; i++) {
          res.get(p) ? res.set(p, res.get(p)! + 1) : res.set(p, 1);
        }

        w = w - (rounded * p.weight);
      }
    });

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
    <Grid container spacing={2} alignItems={'center'} justifyContent={'center'}>
      <Grid item xs={10} sm={6} md={6} lg={4} xl={4}>
        <div className='title'>
          <Typography variant='h2' gutterBottom>
            Plate Calculator
          </Typography>
        </div>

        <div className='input-box'>
          <div className='input-weight-box'>
            <TextField type='number'
              variant='outlined'
              label='Input Weight'
              value={inputWeight}
              onChange={newTargetWeight}
              fullWidth
              sx={{ pr: '0' }}
              InputProps={{
                endAdornment: (
                  <StyledToggleButtonGroup color='primary' exclusive value={inputWeightUnit} onChange={newTargetWeightUnit}>
                    <ToggleButton value={WeightUnit.lbs}>LBs</ToggleButton>
                    <ToggleButton value={WeightUnit.kgs}>KGs</ToggleButton>
                  </StyledToggleButtonGroup>
                )
              }}
            />
          </div>
          <div className='input-weight-adjust-box'>
            <ButtonGroup variant='outlined' size='medium' color='primary' sx={{borderColor: 'gray'}}>
              <Button onClick={() => adjustWeight(-10)}>- 10</Button>
              <Button onClick={() => adjustWeight(-5)}>- 5</Button>
              <Button onClick={() => adjustWeight(5)}>+ 5</Button>
              <Button onClick={() => adjustWeight(10)}>+ 10</Button>
            </ButtonGroup>
          </div>
        </div>

        <Divider><Typography variant='body2'>Plates Per Side</Typography></Divider>
        <div className='plates-container-box'>
          <div className='plates-box'>
            {[...plates.keys()].map(plate => (
              <div>
                  <Chip label={plate.weight}/>
                  {' x' + plates.get(plate)}
                </div>
            ))}
          </div>
          <div className='plates-unit-box'>
            <ToggleButtonGroup color='primary' exclusive value={availableWeightUnit} onChange={newAvailableWeightUnit}>
              <ToggleButton value={WeightUnit.lbs}>LBs</ToggleButton>
              <ToggleButton value={WeightUnit.kgs}>KGs</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>


        {/* <div className="options-box">
            <div className="barbell-box">
              <Typography variant='body1'>
                Barbell Type
              </Typography>

              <ToggleButtonGroup color='primary' exclusive value={barbell} onChange={newBarbell}>
                {[...barbells.keys()].map(bar => (<ToggleButton value={bar}>{barbells.get(bar)!.name}</ToggleButton>))}
              </ToggleButtonGroup>
            </div>
        </div> */}

      </Grid>
    </Grid>

  );
}

export default App;
