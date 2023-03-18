import React, { useState } from 'react';
import {
    Table, TableHead, TableBody, TableRow, TableCell,
    TableFooter, Pagination, TableExpandableRow
} from '@ellucian/react-design-system/core';
import PropTypes from 'prop-types';
import { useStyles } from '../utils/useStyles';

export function InternalTable({ data, createButton }) {
    const classes = useStyles();

    const [pageNumber, setPageNumber] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    const handlePageChange = (event, page) => {
        setPageNumber(page);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(event.target.value);
    };

    return (
        <div id="table-container" className={classes.tableContainer}>
            <Table className={classes.table} layout={{ variant: 'expansionPanels', breakpoint: 'md' }} stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell align="left">Type</TableCell>
                        <TableCell align="left">Subject</TableCell>
                        <TableCell align="left">Location</TableCell>
                        <TableCell align="left">Available</TableCell>
                        <TableCell align="left">Reserve</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.slice(pageNumber * rowsPerPage, pageNumber * rowsPerPage + rowsPerPage).map((book, index) => {
                        return (
                            <TableExpandableRow key={index}>
                                <TableCell component="th" scope="row" columnName="Title" className={classes.primaryCell}>
                                    {book.title}
                                </TableCell>
                                <TableCell columnName="Type" size="small" className={classes.smallCell}>
                                    {book.type}
                                </TableCell>
                                <TableCell columnName="Subject" size="small" className={classes.smallCell}>
                                    {book.subject}
                                </TableCell>
                                <TableCell columnName="Location" size="small" className={classes.smallCell}>
                                    {book.location}
                                </TableCell>
                                <TableCell columnName="Availability" size="small" className={classes.smallCell}>
                                    {String(book.availability)}
                                </TableCell>
                                <TableCell columnName="Reserve" size="small" className={classes.smallCell}>
                                    {createButton(book)}
                                </TableCell>
                            </TableExpandableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <Pagination
                            component="td"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={pageNumber}
                            rowsPerPageOptions={[5, 10, 15, 20, 50]}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}

InternalTable.propTypes = {
    data: PropTypes.array.isRequired,
    createButton: PropTypes.func.isRequired
};