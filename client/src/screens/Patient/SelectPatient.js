import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ModelBody from "../../components/common/ModelBody";
import SelectPatientModal from "./components/SelectPatientModal";
import NewPatientModal from "./components/NewPatientModal";

export const StepEnum = {
    SELECT_PATIENT: "search",
    NEW_PATIENT: "new-patient",
    DASHBOARD: "dashboard",
};
function SelectPatient() {
    const [openedModal, setOpenedModal] = useState(StepEnum.SELECT_PATIENT);
    const history = useHistory();
    const handleNext = (step) => {
        if (step === StepEnum.DASHBOARD) {
            return history.push("/dashboard");
        }
        setOpenedModal(step);
    };

    return (
        <>
            <ModelBody
                opened={openedModal === StepEnum.SELECT_PATIENT}
                closeModal={() => handleNext(StepEnum.DASHBOARD)}
            >
                <SelectPatientModal
                    handleAddPatient={() => handleNext(StepEnum.NEW_PATIENT)}
                    onClose={() => handleNext(StepEnum.DASHBOARD)}
                />
            </ModelBody>
            <ModelBody
                opened={openedModal === StepEnum.NEW_PATIENT}
                closeModal={() => handleNext(StepEnum.SELECT_PATIENT)}
            >
                <NewPatientModal
                    onClose={() => handleNext(StepEnum.SELECT_PATIENT)}
                />
            </ModelBody>
        </>
    );
}

export default SelectPatient;
