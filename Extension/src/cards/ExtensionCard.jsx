import { FormControl, FormControlLabel, Radio, RadioGroup } from '@ellucian/react-design-system/core';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useStyles } from '../common/utils/useStyles';
import { useData, useCardInfo, useCardControl } from '@ellucian/experience-extension-utils';
import {
    fetchReservations as apiFetchReservations,
    fetchWaitlist as apiFetchWaitlist
} from '../common/api/fetchs';
import { buildCardDisplay } from '../common/components/CardDisplays';

export default function Card() {
    const classes = useStyles();
    const { getExtensionJwt } = useData();
    const { configuration } = useCardInfo();
    const { setErrorMessage, setLoadingStatus } = useCardControl();

    const baseApiUrl = useMemo(() => configuration.baseApiUrl, [configuration.baseApiUrl]);

    const [waitlistedBooks, setWaitlistedBooks] = useState([]);
    const [reservedBooks, setReservedBooks] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('reserved');

    const fetchWaitlist = useCallback(async (jwt) => {
        try {
            const response = await apiFetchWaitlist(jwt, baseApiUrl);
            const responseData = await response.json();
            setWaitlistedBooks(responseData);
        }

        catch (error) {
            setErrorMessage({ headerMessage: error.name, textMessage: error.message, iconName: 'lock', iconColor: 'red' });
        }
    }, [baseApiUrl, setErrorMessage]);

    const fetchReservations = useCallback(async (jwt) => {
        try {
            const response = await apiFetchReservations(jwt, baseApiUrl);
            const responseData = await response.json();
            setReservedBooks(responseData);
        }

        catch (error) {
            setErrorMessage({ headerMessage: error.name, textMessage: error.message, iconName: 'lock', iconColor: 'red' });
        }
    }, [baseApiUrl, setErrorMessage]);

    const handleChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    useEffect(() => {
        const fetchEssentials = async () => {
            setLoadingStatus(true);
            const jwt = await getExtensionJwt();
            Promise.all([
                fetchWaitlist(jwt, baseApiUrl),
                fetchReservations(jwt, baseApiUrl)
            ]).then(() => setLoadingStatus(false));
        }
        fetchEssentials();
    }, [baseApiUrl, fetchReservations, fetchWaitlist, getExtensionJwt, setErrorMessage, setLoadingStatus]);

    return (
        <div className={classes.card}>
            <FormControl>
                <RadioGroup row value={selectedFilter} onChange={handleChange}>
                    <FormControlLabel value="reserved" control={<Radio />} label="Reserved" />
                    <FormControlLabel value="waitlist" control={<Radio />} label="Waitlisted" />
                </RadioGroup>
            </FormControl>
            {selectedFilter === 'reserved' && (
                buildCardDisplay(reservedBooks, 'reserved')
            )}
            {selectedFilter === 'waitlist' && (
                buildCardDisplay(waitlistedBooks, 'waitlist')
            )}
        </div>
    );
}
