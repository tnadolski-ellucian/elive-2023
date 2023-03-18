import React, { useEffect, useCallback, useState, useMemo } from 'react';
import {
    Button, Snackbar, Tooltip,
    isWidthUp, useWidth
} from '@ellucian/react-design-system/core';
import { Icon } from '@ellucian/ds-icons/lib';
import {
    usePageControl, useExtensionControl,
    useExtensionInfo, useData
} from '@ellucian/experience-extension-utils';
import {
    fetchLibraryBooks as apiFetchLibraryBooks,
    fetchReservations as apiFetchReservations,
    fetchWaitlist as apiFetchWaitlist,
    reserveLibraryBook as apiReserveLibraryBook,
    registerReservation as apiRegisterReservation,
    registerWaitlist as apiRegisterWaitlist
} from '../common/api/fetchs';
import { InternalSearch } from '../common/components/Search';
import { InternalTable } from '../common/components/Table';

export default function Page() {
    const { setPageTitle } = usePageControl();
    const { configuration } = useExtensionInfo();
    const { setLoadingStatus, setErrorMessage } = useExtensionControl();
    const { getExtensionJwt } = useData();

    const baseApiUrl = useMemo(() => configuration.baseApiUrl, [configuration.baseApiUrl]);

    const width = useWidth();

    const [libraryDataToUse, setLibraryDataToUse] = useState([]);
    const [initLibraryData, setInitLibraryData] = useState([]);
    const [filteredLibraryBooks, setFilteredLibraryBooks] = useState([]);

    const [waitlistedBooks, setWaitlistedBooks] = useState([]);
    const [reservedBooks, setReservedBooks] = useState([]);
    const [requestsInProcess, setRequestsInProcess] = useState([]);
    const [snackbarOptions, setSnackbarOptions] = useState({ open: false, message: '', variant: undefined });

    const fetchLibraryBooks = useCallback(async (jwt) => {
        try {
            const response = await apiFetchLibraryBooks(jwt, baseApiUrl);
            const responseData = await response.json();
            setInitLibraryData(responseData);
        }

        catch (error) {
            setErrorMessage({ headerMessage: error.name, textMessage: error.message, iconName: 'lock', iconColor: 'red' });
            console.error(error);
        }
    }, [baseApiUrl, setErrorMessage]);

    const fetchWaitlist = useCallback(async (jwt) => {
        try {
            const response = await apiFetchWaitlist(jwt, baseApiUrl);
            const responseData = await response.json();
            setWaitlistedBooks(responseData);
        }

        catch (error) {
            setSnackbarOptions({ open: true, message: error.message, variant: 'error' });
            console.error(error);
        }
    }, [baseApiUrl]);

    const fetchReservations = useCallback(async (jwt) => {
        try {
            const response = await apiFetchReservations(jwt, baseApiUrl);
            const responseData = await response.json();
            setReservedBooks(responseData);
        }

        catch (error) {
            setSnackbarOptions({ open: true, message: error.message, variant: 'error' });
        }
    }, [baseApiUrl]);

    const reserveLibraryBook = useCallback(async (libraryBook) => {
        try {
            const jwt = await getExtensionJwt();
            await apiReserveLibraryBook(jwt, baseApiUrl, libraryBook);
        }

        catch (error) {
            setSnackbarOptions({ open: true, message: error.message, variant: 'error' });
        }
    }, [baseApiUrl, getExtensionJwt]);

    const registerReservation = useCallback(async (libraryBook) => {
        try {
            const jwt = await getExtensionJwt();
            await apiRegisterReservation(jwt, baseApiUrl, libraryBook);

            const currentEntry = initLibraryData.find(book => book.id === libraryBook.id);
            setReservedBooks([...reservedBooks, currentEntry]);
            setRequestsInProcess(requestsInProcess.filter(entry => entry.id === libraryBook.id));

            const message = `${libraryBook.title} reserved. Please pick up within 7 days`;
            setSnackbarOptions({ open: true, message: message, variant: 'success' });
        }

        catch (error) {
            setSnackbarOptions({ open: true, message: error.message, variant: 'error' });
            console.error(error);
        }
    }, [baseApiUrl, getExtensionJwt, initLibraryData, requestsInProcess, reservedBooks]);

    const registerWaitlist = useCallback(async (libraryBook) => {
        try {
            const jwt = await getExtensionJwt();
            await apiRegisterWaitlist(jwt, baseApiUrl, libraryBook);

            const currentEntry = initLibraryData.find(book => book.id === libraryBook.id);
            setWaitlistedBooks([...waitlistedBooks, currentEntry]);
            setRequestsInProcess(requestsInProcess.filter(entry => entry.id === libraryBook.id));

            const message = `${libraryBook.title} waitlisted`;
            setSnackbarOptions({ open: true, message: message, variant: 'success' })
        }

        catch (error) {
            setSnackbarOptions({ open: true, message: error.message, variant: 'error' });
            console.error(error);
        }
    }, [baseApiUrl, getExtensionJwt, initLibraryData, requestsInProcess, waitlistedBooks]);

    const createButton = (book) => {
        let loadingIcon;
        if (requestsInProcess.find((entry) => entry.id === book.id)) {
            loadingIcon = <Icon name="spinner" spin />;
        }

        let requiresFluid = false;
        // fluid doesn't play nice in small responsive table
        if (isWidthUp('xs', width)) {
            requiresFluid = true;
        }

        if (isWaitlisted(book)) {
            // the span is present because pointEvents: none (disabled) doesn't allow the onHover behavior of tooltip to fire
            // if I didn't want the tooltip, This could just be:
            // return <Button fluid color="secondary" onClick={() => handleReservation(book)} disabled={isWaitlisted(book)}>Waitlist</Button>
            return (
                <Tooltip title="Book is already waitlisted">
                    <span>
                        <Button
                            aria-label="waitlist"
                            fluid={requiresFluid}
                            color="secondary"
                            disabled={true}
                        >
                            Waitlist
                        </Button>
                    </span>
                </Tooltip>
            );
        } else if (isReserved(book)) {
            // the span is present because pointEvents: none (disabled) doesn't allow the onHover behavior of tooltip to fire
            // if I didn't want the tooltip, This could just be:
            // return <Button fluid color="secondary" onClick={() => handleReservation(book)} disabled={isWaitlisted(book)}>Waitlist</Button>
            return (
                <Tooltip title="Book is already Reserved. Please pick up within 7 days">
                    <span>
                        <Button
                            aria-label="reserve"
                            fluid={requiresFluid}
                            color="secondary"
                            disabled={true}
                        >
                            Reserve
                        </Button>
                    </span>
                </Tooltip>
            );
        } else if (book.availability) {
            return <Button
                fluid={requiresFluid}
                onClick={() => handleReservation(book)}
                aria-label="reserve"

            >
                Reserve {loadingIcon}
            </Button>;
        } else {
            return <Button
                fluid={requiresFluid}
                color="secondary"
                onClick={() => handleReservation(book)}
                aria-label="waitlist"
            >
                Waitlist {loadingIcon}
            </Button>;
        }
    };

    const handleReservation = async (book) => {
        setRequestsInProcess([...requestsInProcess, book]);

        if (book.availability) {
            await reserveLibraryBook(book);
            await registerReservation(book);
        } else {
            await registerWaitlist(book);
        }
    };

    const resetSnackbar = () => {
        setSnackbarOptions({ open: false, message: '', variant: undefined });
    };

    const isWaitlisted = (book) => {
        const waitlistedBook = waitlistedBooks.find((wlBook) => wlBook.bookid === book.id || wlBook.id === book.id);
        return Boolean(waitlistedBook);
    };

    const isReserved = (book) => {
        const reservedBook = reservedBooks.find((resBook) => resBook.bookid === book.id || resBook.id === book.id);
        return Boolean(reservedBook);
    };

    useEffect(() => {
        const fetchEssentials = async () => {
            setLoadingStatus(true);
            const jwt = await getExtensionJwt();
            Promise.all([
                fetchLibraryBooks(jwt),
                fetchWaitlist(jwt),
                fetchReservations(jwt)
            ]).then(() => setLoadingStatus(false));
        }
        fetchEssentials();
    }, [fetchLibraryBooks, fetchReservations, fetchWaitlist, getExtensionJwt, setLoadingStatus]);

    useEffect(() => {
        if (filteredLibraryBooks?.length > 0) {
            setLibraryDataToUse(filteredLibraryBooks);
        } else {
            setLibraryDataToUse(initLibraryData);
        }
    }, [filteredLibraryBooks, initLibraryData]);

    setPageTitle("Eloyce Library");

    return (
        <>
            <Snackbar
                ContentProps={{
                    'aria-describedby': 'elive-snackbar'
                }}
                open={snackbarOptions.open}
                message={
                    <span id="elive-snackbar">
                        {snackbarOptions.message}
                    </span>
                }
                variant={snackbarOptions.variant}
                onClose={resetSnackbar}
            />
            {initLibraryData?.length > 0 && (
                <InternalSearch books={initLibraryData} setter={setFilteredLibraryBooks} />
            )}
            {libraryDataToUse?.length > 0 && (
                <InternalTable data={libraryDataToUse} createButton={createButton} />
            )}
        </>
    );
}