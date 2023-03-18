import { Typography } from '@ellucian/react-design-system/core';
import React from 'react';

export const buildCardDisplay = (books, type) => (
    <>
        <Typography variant="h4">
            Your {type} books:
        </Typography>
        <ul>
            {books?.length > 0 ? books.map((book, index) => (
                <li key={index}>
                    <Typography>{book.booktitle}</Typography>
                </li>
            )) : (
                <Typography>
                    No {type} books assigned.
                </Typography>
            )}
        </ul>
    </>
);
