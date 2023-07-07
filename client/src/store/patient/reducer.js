import { CLEAR_PATIENT, SET_PATIENT } from "./types";

const initialState = {
    patient: null, // Initial state for patient data
};

const patientReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PATIENT:
            // Handle setting the patient data in the state
            return {
                ...state,
                patient: action.payload,
            };
        case CLEAR_PATIENT:
            // Handle clearing the patient data from the state
            return {
                ...state,
                patient: null,
            };
        default:
            return state;
    }
};

export default patientReducer;
