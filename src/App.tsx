import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ScaleIcon from "@mui/icons-material/Scale";
import "./App.scss";
import { Unit } from "./model/unit";
import { Barbell } from "./model/barbell";
import { PlateDetails } from "./model/plate";
import { calculate } from "./functions/calculate";
import { convert } from "./functions/convert";

interface ActualWeight {
  pounds: number;
  kilograms: number
}

function App() {
  const [inputWeight, setInputWeight] = useState<number>(185);
  const [inputUnit, setInputUnit] = useState<Unit>(Unit.lbs);
  const [availableUnit, setAvailableUnit] = useState<Unit>(Unit.lbs);
  const [barbell, setBarbell] = useState<Barbell>(Barbell.STANDARD);
  const [plates, setPlates] = useState<Map<PlateDetails, number>>(new Map());
  const [actualWeight, setActualWeight] = useState<ActualWeight>({ pounds: 0, kilograms: 0 });

  const newTargetWeight = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputWeight(parseInt(event.target.value));
  };

  const newTargetUnit = (_event: any, newValue: Unit) => {
    newValue !== null && setInputUnit(newValue);
  };

  const newAvailableUnit = (_event: any, newValue: Unit) => {
    newValue !== null && setAvailableUnit(newValue);
  };

  const newBarbell = (_event: any, newValue: Barbell) => {
    newValue !== null && setBarbell(newValue);
  };

  const adjustWeight = (adjustment: number) => {
    setInputWeight(inputWeight + adjustment);
  };

  useEffect(() => {
    let target = (inputWeight - (barbell.getWeight(inputUnit))) / 2;
    let plates = calculate(target, inputUnit, availableUnit);
    let plateWeight = Array.from(plates).map(([k, v]) => k.weight * v)
      .reduce((a, c) => a + c, 0) * 2

    let total = plateWeight + barbell.getWeight(availableUnit);

    let actual: ActualWeight = availableUnit === Unit.lbs ? 
        { pounds: total, kilograms: convert(total, Unit.lbs)} : 
        { pounds: convert(total, Unit.kgs), kilograms: total };

    setPlates(plates);
    setActualWeight(actual);
  }, [inputWeight, inputUnit, availableUnit, barbell]);

  return (
    <Grid container spacing={2} alignItems={"center"} justifyContent={"center"}>
      <Grid item xs={10} sm={6} md={6} lg={4} xl={4}>
        <div className="title">
          <Typography variant="h2" gutterBottom>
            Plate Calculator
          </Typography>
        </div>

        <div className="input-box">
          <div className="input-weight-box">
            <TextField
              type="number"
              variant="outlined"
              label="Input Weight"
              value={inputWeight}
              onChange={newTargetWeight}
              className="input-weight-text-field"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {inputUnit}
                  </InputAdornment>
                ),
              }}
            />
            <ToggleButtonGroup
              color="primary"
              exclusive
              value={inputUnit}
              onChange={newTargetUnit}
            >
              <ToggleButton value={Unit.lbs}>LBs</ToggleButton>
              <ToggleButton value={Unit.kgs}>KGs</ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div className="input-weight-adjust-box">
            <ButtonGroup
              variant="outlined"
              size="medium"
              color="primary"
              sx={{ borderColor: "gray" }}
            >
              <Button onClick={() => adjustWeight(-10)}>- 10</Button>
              <Button onClick={() => adjustWeight(-5)}>- 5</Button>
              <Button onClick={() => adjustWeight(5)}>+ 5</Button>
              <Button onClick={() => adjustWeight(10)}>+ 10</Button>
            </ButtonGroup>
          </div>
        </div>

        <Divider>
          <Typography variant="body2">Weight</Typography>
        </Divider>
        <div className="info-container-box">
          <div className="info-target-box">
            <Typography variant="body2">Target</Typography>
            <List>
              <ListItem disablePadding>
                <ListItemIcon>
                  <ScaleIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    (inputUnit === Unit.kgs
                      ? convert(inputWeight, inputUnit).toFixed(2)
                      : inputWeight) +
                    " " +
                    Unit.lbs
                  }
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <ScaleIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    (inputUnit === Unit.lbs
                      ? convert(inputWeight, inputUnit).toFixed(2)
                      : inputWeight) +
                    " " +
                    Unit.kgs
                  }
                />
              </ListItem>
            </List>
          </div>
          <div className="info-actual-box">
            <Typography variant="body2">Actual</Typography>
            <List>
              <ListItem disablePadding>
                <ListItemIcon>
                  <ScaleIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    actualWeight.pounds.toFixed(2) + 
                    " " +
                    Unit.lbs
                  }
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <ScaleIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    actualWeight.kilograms.toFixed(2) + 
                    " " +
                    Unit.kgs
                  }
                />
              </ListItem>
            </List>
          </div>
        </div>

        <Divider>
          <Typography variant="body2">Plates Per Side</Typography>
        </Divider>
        <div className="plates-container-box">
          <div className="plates-box">
            {[...plates.keys()].map((plate) => (
              <div>
                <Chip label={plate.weight} />
                {" x" + plates.get(plate)}
              </div>
            ))}
          </div>
          <div className="plates-unit-box">
            <ToggleButtonGroup
              color="primary"
              exclusive
              value={availableUnit}
              onChange={newAvailableUnit}
            >
              <ToggleButton value={Unit.lbs}>LBs</ToggleButton>
              <ToggleButton value={Unit.kgs}>KGs</ToggleButton>
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
