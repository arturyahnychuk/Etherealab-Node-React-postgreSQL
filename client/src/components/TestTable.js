import {
    Typography,
    TableContainer,
    Table,
    TableBody,
    TableHead,
    IconButton,
} from "@mui/material";

import InfoIcon from "@mui/icons-material/InfoOutlined";
import GradeIcon from "@mui/icons-material/Grade";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import ModalPopup from "./ModalPopup";
import DetailModal from "../screens/Catalog/components/DetailModal";
import { StyledTableCellSm, StyledTableRowSm } from "./common/StyledTable";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    border: {
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
    },

    iconContainer: {
        "& svg": {
            cursor: "pointer",
            position: "relative",
            top: 3,
        },
    },
}));
function TestTable(props) {
    const {
        isLoading,
        catalog,
        handleFavorite,
        handleShowDetails,
        selectedItem,
        handleAddOrder,
    } = props;
    const classes = useStyles();
    return (
        <TableContainer>
            <Table stickyHeader size="small">
                <TableHead>
                    <StyledTableRowSm>
                        <StyledTableCellSm>Lab Company</StyledTableCellSm>
                        <StyledTableCellSm>Test Name</StyledTableCellSm>
                        <StyledTableCellSm>Sample</StyledTableCellSm>
                        <StyledTableCellSm>Price</StyledTableCellSm>
                        <StyledTableCellSm>Favorite</StyledTableCellSm>
                        <StyledTableCellSm>Detail</StyledTableCellSm>
                    </StyledTableRowSm>
                </TableHead>
                <TableBody>
                    {!isLoading && catalog.length > 0 ? (
                        catalog.map((item, idx) => (
                            <StyledTableRowSm
                                key={idx}
                                onClick={() => handleAddOrder(item)}
                            >
                                <StyledTableCellSm>
                                    {item.lab_company_name}
                                </StyledTableCellSm>
                                <StyledTableCellSm>
                                    {item.lab_company_test_name}
                                </StyledTableCellSm>
                                <StyledTableCellSm>
                                    {item.sample_type_name}
                                </StyledTableCellSm>
                                <StyledTableCellSm>
                                    &#36; {item.test_price}
                                </StyledTableCellSm>
                                <StyledTableCellSm>
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            handleFavorite(
                                                item.favorite_id,
                                                item.lab_company_test_id
                                            )
                                        }
                                    >
                                        {item.favorite_id ? (
                                            <GradeIcon />
                                        ) : (
                                            <GradeOutlinedIcon />
                                        )}
                                    </IconButton>
                                </StyledTableCellSm>

                                <StyledTableCellSm
                                    onClick={() => handleShowDetails(item)}
                                    className={classes.iconContainer}
                                >
                                    <ModalPopup
                                        bodyElement={
                                            selectedItem ? (
                                                <DetailModal
                                                    data={selectedItem}
                                                />
                                            ) : (
                                                ""
                                            )
                                        }
                                    >
                                        <IconButton size="small">
                                            <InfoIcon fontSize="small" />
                                        </IconButton>
                                    </ModalPopup>
                                </StyledTableCellSm>
                            </StyledTableRowSm>
                        ))
                    ) : (
                        <StyledTableRowSm>
                            <StyledTableCellSm colSpan={4}>
                                <Typography align="center" variant="body1">
                                    {isLoading
                                        ? "Loading..."
                                        : "No Records Found..."}
                                </Typography>
                            </StyledTableCellSm>
                        </StyledTableRowSm>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TestTable;
