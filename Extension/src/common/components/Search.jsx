import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Search, SearchItem, FormControlLabel, Switch } from '@ellucian/react-design-system/core';
import { useStyles } from '../utils/useStyles';

export function InternalSearch({ books, setter }) {
    const classes = useStyles();
    const [searchString, setSearchString] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoadingFlag] = useState(false);
    const [toggle, setToggle] = useState(false);

    const onChange = (event) => {
        setSearchString(event.target.value);
    };

    const onFilter = (value) => {
        setLoadingFlag(true);

        const booksFiltered = books.filter((book) => {
            return book.subject.toLowerCase().includes(value.toLowerCase()) || book.title.toLowerCase().includes(value.toLowerCase());
        });

        if (booksFiltered?.length > 0) {
            setSearchResults(booksFiltered);
        } else {
            setSearchResults([]);
        }

        setLoadingFlag(false);
    };

    const onClear = () => {
        setSearchString('');
        setSearchResults([]);
        setter([]);
        setToggle(false);
    };

    const onItemSelect = (event, index) => {
        setSearchString(`${searchResults[index].title}`);
        setter(searchResults);
    };

    const onSearchInvoked = () => {
        setter(searchResults);
    };

    // filter on prop `books` if search hasn't been fired yet
    const handleAvailabilityChange = (event) => {
        setToggle(event.target.checked);
        if (event.target.checked) {
            setter(searchResults.filter(book => book.availability === true));
        } else {
            setter(searchResults);
        }
    };

    return (
        <div className={classes.searchContainer}>
            <Search
                onChange={onChange}
                onClear={onClear}
                value={searchString}
                onSearchInvoked={onSearchInvoked}
                label="Books"
                typeaheadOptions={{
                    loading: loading,
                    onFilter: onFilter,
                    onItemSelect: onItemSelect,
                    searchDelay: 300
                }}
            >
                {searchResults.map((data, index) => (
                    <SearchItem
                        key={index}
                        divider={true}
                    >
                        {data.title}
                    </SearchItem>
                ))}
            </Search>
            {searchResults?.length > 0 && (
                <FormControlLabel control={<Switch onChange={handleAvailabilityChange} checked={toggle} />} label="Toggle available books" classes={{ root: classes.switch }} />
            )}
        </div>
    );
}

InternalSearch.propTypes = {
    books: PropTypes.array.isRequired,
    setter: PropTypes.func.isRequired
};