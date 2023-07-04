import React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Checkbox,
    FormControlLabel,
    Grid,
    Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const useStyles = makeStyles((theme) => ({
    accordion: {
        boxShadow: "none !important",
        "& .MuiAccordionDetails-root": {
            padding: theme.spacing(0, 1),
        },
        padding: 0,
    },
    label: {
        "& span": {
            fontSize: "13px",
        },
    },
    border: {
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
    },
}));

function LabCompanies(props) {
    const { catalogLabCompanies, selectedCompanies, onCheckBoxChangeHandler } =
        props;
    const classes = useStyles();
    return (
        <Box className={classes.border}>
            <Accordion className={classes.accordion} defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography component="h6" color="textPrimary" gutterBottom>
                        Lab Companies
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {catalogLabCompanies &&
                        catalogLabCompanies.length > 0 &&
                        catalogLabCompanies.map((item) => (
                            <Grid key={item.id}>
                                <FormControlLabel
                                    value={item.id.toString()}
                                    label={item.name}
                                    className={classes.label}
                                    control={
                                        <Checkbox
                                            name={item.id.toString()}
                                            color="primary"
                                            size="small"
                                            checked={selectedCompanies.includes(
                                                item.id.toString()
                                            )}
                                            onChange={(e) =>
                                                onCheckBoxChangeHandler(e)
                                            }
                                        />
                                    }
                                />
                            </Grid>
                        ))}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}

export default LabCompanies;
