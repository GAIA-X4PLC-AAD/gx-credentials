import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  Button,
  Checkbox,
  Fade,
  FormControlLabel,
  Modal,
  Typography,
  useTheme,
} from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const steps = ["Select VCs", "Submit VP"];

export function ComplianceModal({ credential }: any) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [checkedState, setCheckedState] = useState({
    participant: false,
    termsAndConditions: false,
    legalRegistration: false,
  });

  useEffect(() => {
    if (
      checkedState.participant &&
      checkedState.termsAndConditions &&
      checkedState.legalRegistration
    ) {
      console.log("All are checked");
    }
  }, [checkedState]);

  // State to control modal visibility
  const [complianceModalOpen, setComplianceModalOpen] = useState(false);
  const complianceModalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    backgroundImage: theme.palette.myAwesomeColor.main, //"myAwesomeColor",
    borderRadius: 5,
    boxShadow: 24,
    p: 4,
    maxHeight: 600,
    overflow: "auto",
  };

  const handleCheckboxChange = (event) => {
    setCheckedState({
      ...checkedState,
      [event.target.name]: event.target.checked,
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };
  const handleOpen = () => setComplianceModalOpen(true);
  const handleClose = () => {
    setComplianceModalOpen(false);
    handleReset();
  };

  return (
    <React.Fragment>
      <Button variant="contained" sx={{ m: 1 }} onClick={handleOpen}>
        Compliance
      </Button>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={complianceModalOpen}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={complianceModalOpen}>
          <Box sx={complianceModalStyle}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: {
                  optional?: React.ReactNode;
                } = {};
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  Your reuqest has been submitted successfully.
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleClose}>Close</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {activeStep === 0 ? (
                  <FirstStep
                    checkedState={checkedState}
                    handleCheckboxChange={handleCheckboxChange}
                    credential={credential}
                    handleBack={handleBack}
                    handleNext={handleNext}
                    activeStep={activeStep}
                  />
                ) : (
                  <SecondStep
                    activeStep={activeStep}
                    handleBack={handleBack}
                    handleNext={handleNext}
                  />
                )}
              </React.Fragment>
            )}
          </Box>
        </Fade>
      </Modal>
    </React.Fragment>
  );
}

const FirstStep = ({
  checkedState,
  handleCheckboxChange,
  credential,
  handleBack,
  handleNext,
  activeStep,
}: any) => {
  return (
    <React.Fragment>
      <Box>
        <Accordion sx={{ m: 2 }}>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon sx={{ color: "primary.main" }} />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedState.participant}
                  onChange={handleCheckboxChange}
                  name="participant"
                />
              }
              label="Participant"
            />
          </AccordionSummary>
          <AccordionDetails
            sx={{
              overflow: "auto",
              backgroundColor: grey[900],
              borderRadius: 2,
            }}
          >
            <Typography>{JSON.stringify(credential, null, 2)}</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ m: 2 }}>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon sx={{ color: "primary.main" }} />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedState.termsAndConditions}
                  onChange={handleCheckboxChange}
                  name="termsAndConditions"
                />
              }
              label="Terms and Conditions VC"
            />
          </AccordionSummary>
          <AccordionDetails
            sx={{
              overflow: "auto",
              backgroundColor: grey[900],
              borderRadius: 2,
            }}
          >
            <Typography>{"This is a test"}</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ m: 2 }}>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon sx={{ color: "primary.main" }} />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedState.legalRegistration}
                  onChange={handleCheckboxChange}
                  name="legalRegistration"
                />
              }
              label="Legal Registration VC"
            />
          </AccordionSummary>
          <AccordionDetails
            sx={{
              overflow: "auto",
              backgroundColor: grey[900],
              borderRadius: 2,
            }}
          >
            <Typography>{"This is a test"}</Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button
          disabled={
            !checkedState.participant ||
            !checkedState.termsAndConditions ||
            !checkedState.legalRegistration
          }
          onClick={handleNext}
          variant={activeStep === steps.length - 1 ? "contained" : "text"}
        >
          Next
        </Button>
      </Box>
    </React.Fragment>
  );
};

const SecondStep = ({ activeStep, handleBack, handleNext }: any) => {
  return (
    <React.Fragment>
      <Box>
        <Accordion sx={{ m: 2 }}>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon sx={{ color: "primary.main" }} />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            Verifiable Presentation
          </AccordionSummary>
          <AccordionDetails
            sx={{
              overflow: "auto",
              backgroundColor: grey[900],
              borderRadius: 2,
            }}
          >
            <Typography>This will be a VP</Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button onClick={handleNext} variant="contained">
          {"Submit Request"}
        </Button>
      </Box>
    </React.Fragment>
  );
};
