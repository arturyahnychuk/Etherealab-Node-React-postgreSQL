import { CLEAR_PATIENT, SET_PATIENT } from "./types";

export const setPatient = (patientData) => {
    return {
        type: SET_PATIENT,
        payload: patientData,
    };
};

export const clearPatient = () => {
    return {
        type: CLEAR_PATIENT,
    };
};
