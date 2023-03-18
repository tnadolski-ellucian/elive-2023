import React from 'react';
import ReactDOM from 'react-dom';
import Home from '../../src/page/Home';
import ThemeProvider from '../ThemeProvider';
import { fireEvent, render, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useExtensionControl } from '@ellucian/experience-extension-utils';
import {
    fetchLibraryBooks, fetchReservations, fetchWaitlist,
    reserveLibraryBook, registerReservation, registerWaitlist
} from '../../src/common/api/fetchs';
import '@testing-library/jest-dom';

// there are child fetch calls
// we have 100% code coverage for our fetchs
// we'll override where we need to
global.fetch = jest.fn();

// these hooks are provided by experience context
// we'll need to mock them all for local UT consumption
jest.mock('@ellucian/experience-extension-utils', () => {
    return {
        useData: () => ({
            getExtensionJwt: () => (new Promise((resolve) => {
                resolve('resolved');
            }))
        }),
        useExtensionInfo: () => ({ configuration: { baseApiUrl: 'https://localhost:8080' } }),
        useExtensionControl: jest.fn(),
        usePageControl: () => ({ setPageTitle: jest.fn() })
    };
});

jest.mock('../../src/common/api/fetchs', () => {
    return {
        fetchLibraryBooks: jest.fn(() => Promise.resolve()),
        fetchReservations: jest.fn(() => Promise.resolve()),
        fetchWaitlist: jest.fn(() => Promise.resolve()),
        registerReservation: jest.fn(() => Promise.resolve()),
        registerWaitlist: jest.fn(() => Promise.resolve()),
        reserveLibraryBook: jest.fn(() => Promise.resolve())
    }
});

const books = [{
    id: '00000000-0000-0000-0000-000000000001',
    title: 'titleValue',
    type: 'typeValue',
    subject: 'subjectValue',
    location: 'locationValue',
    availability: false
}, {
    id: '00000000-0000-0000-0000-000000000002',
    title: 'titleValue2',
    type: 'typeValue2',
    subject: 'subjectValue2',
    location: 'locationValue2',
    availability: false
}, {
    id: '00000000-0000-0000-0000-000000000003',
    title: 'titleValue3',
    type: 'typeValue3',
    subject: 'subjectValue3',
    location: 'locationValue3',
    availability: true
}, {
    id: '00000000-0000-0000-0000-000000000004',
    title: 'titleValue4',
    type: 'typeValue4',
    subject: 'subjectValue4',
    location: 'locationValue4',
    availability: true
}, {
    id: '00000000-0000-0000-0000-000000000005',
    title: 'titleValue5',
    type: 'typeValue5',
    subject: 'subjectValue5',
    location: 'locationValue5',
    availability: true
}];

const waitlistBooks = [{
    id: '00000000-0000-0000-0000-000000000004',
    title: 'titleValue4',
    type: 'typeValue4',
    subject: 'subjectValue4',
    location: 'locationValue4',
    availability: false
}];

const reservedBooks = [{
    id: '00000000-0000-0000-0000-000000000005',
    title: 'titleValue5',
    type: 'typeValue5',
    subject: 'subjectValue5',
    location: 'locationValue5',
    availability: false
}];

function WrappedComponent() {
    return (
        <ThemeProvider>
            <Home />
        </ThemeProvider>
    )
}

describe('Extension Page', () => {
    beforeEach(() => {
        fetch.mockClear();
        jest.clearAllMocks();
    });

    it('Renders without crashing', () => {
        fetchLibraryBooks.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(),
            ok: true
        }));
        fetchWaitlist.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(),
            ok: true
        }));
        fetchReservations.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(),
            ok: true
        }));

        useExtensionControl.mockImplementation(() => ({
            setErrorMessage: jest.fn(),
            setLoadingStatus: jest.fn()
        }));

        const div = document.createElement('div');
        ReactDOM.render(<WrappedComponent />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it('fetchLibraryBooks fails, and calls setErrorMessage', async () => {
        fetchLibraryBooks.mockImplementation(() => Promise.reject(
            new Error()
        ));
        fetchWaitlist.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(),
            ok: true
        }));
        fetchReservations.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(),
            ok: true
        }));

        const setErrMsgMock = jest.fn();

        useExtensionControl.mockImplementation(() => ({
            setErrorMessage: setErrMsgMock,
            setLoadingStatus: jest.fn()
        }));

        // although jest suggests the await isn't needed, this won't wait for the component to finish loading if it's not present.
        await act(() => {
            render(<WrappedComponent />);
        });

        expect(setErrMsgMock).toHaveBeenCalled();
    });

    it('fetchWaitlist fails, and does not call setErrorMessage', async () => {
        const error = new Error();
        error.message = 'error';
        fetchLibraryBooks.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(),
            ok: true
        }));
        fetchWaitlist.mockImplementation(() => Promise.reject(
            error
        ));
        fetchReservations.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(),
            ok: true
        }));

        const setErrMsgMock = jest.fn();

        useExtensionControl.mockImplementation(() => ({
            setErrorMessage: setErrMsgMock,
            setLoadingStatus: jest.fn()
        }));

        await act(() => {
            render(<WrappedComponent />);
        });

        expect(setErrMsgMock).not.toHaveBeenCalled();
    });

    it('fetchReservations fails, and does not call setErrorMessage', async () => {
        const error = new Error();
        fetchLibraryBooks.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(),
            ok: true
        }));
        fetchWaitlist.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(),
            ok: true
        }));
        fetchReservations.mockImplementation(() => Promise.reject(
            error
        ));

        const setErrMsgMock = jest.fn();

        useExtensionControl.mockImplementation(() => ({
            setErrorMessage: setErrMsgMock,
            setLoadingStatus: jest.fn()
        }));

        await act(() => {
            render(<WrappedComponent />);
        });

        expect(setErrMsgMock).not.toHaveBeenCalled();
    });

    it('validates table and search renders', async () => {
        fetchLibraryBooks.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(books),
            ok: true
        }));
        fetchWaitlist.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(waitlistBooks),
            ok: true
        }));
        fetchReservations.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(reservedBooks),
            ok: true
        }));

        useExtensionControl.mockImplementation(() => ({
            setErrorMessage: jest.fn(),
            setLoadingStatus: jest.fn()
        }));

        const { findByRole } = render(<WrappedComponent />);

        const table = await findByRole('table')
        const search = await findByRole('searchbox');

        expect(table).toBeInTheDocument();
        expect(search).toBeInTheDocument();
    });

    it('validates button renders and fires callbacks', async () => {
        fetchLibraryBooks.mockReturnValue(Promise.resolve({
            json: () => Promise.resolve(books),
            ok: true
        }));
        fetchWaitlist.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(waitlistBooks),
            ok: true
        }));
        fetchReservations.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(reservedBooks),
            ok: true
        }));

        useExtensionControl.mockImplementation(() => ({
            setErrorMessage: jest.fn(),
            setLoadingStatus: jest.fn()
        }));

        const { findAllByLabelText } = render(<WrappedComponent />);

        const waitlistButtons = await findAllByLabelText('waitlist');
        const reserveButtons = await findAllByLabelText('reserve');

        const waitlistButton = waitlistButtons[0];

        await waitFor(() => {
            fireEvent.click(waitlistButton);
        });

        expect(registerWaitlist).toHaveBeenCalledTimes(1);

        const reserveButton = reserveButtons[0];

        await waitFor(() => {
            fireEvent.click(reserveButton);
        });

        expect(registerReservation).toHaveBeenCalledTimes(1);
    });

    it('setErrorMessage fires when initial fetch fails', async () => {
        fetchLibraryBooks.mockReturnValue(Promise.reject(
            new Error()
        ));
        fetchWaitlist.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(waitlistBooks),
            ok: true
        }));
        fetchReservations.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(reservedBooks),
            ok: true
        }));

        const setErrMsgMock = jest.fn();

        useExtensionControl.mockImplementation(() => ({
            setErrorMessage: setErrMsgMock,
            setLoadingStatus: jest.fn()
        }));

        await waitFor(() => (render(<WrappedComponent />)));

        expect(setErrMsgMock).toHaveBeenCalled();
    });

    it('validates setErrorMsg isnt called from reserve action. Snackbar appears', async () => {
        fetchLibraryBooks.mockReturnValue(Promise.resolve({
            json: () => Promise.resolve(books),
            ok: true
        }));
        fetchWaitlist.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(waitlistBooks),
            ok: true
        }));
        fetchReservations.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(reservedBooks),
            ok: true
        }));

        const error = new Error();
        error.message = 'Some error';

        reserveLibraryBook.mockImplementation(jest.fn(() => Promise.reject(
            error
        )));

        registerReservation.mockImplementation(jest.fn(() => Promise.reject(
            error
        )));

        const setErrMsgMock = jest.fn();

        useExtensionControl.mockImplementation(() => ({
            setErrorMessage: setErrMsgMock,
            setLoadingStatus: jest.fn()
        }));

        const { findByText, findAllByLabelText } = render(<WrappedComponent />);

        const reserveButtons = await findAllByLabelText('reserve');
        const reserveButton = reserveButtons[0];

        await waitFor(() => {
            fireEvent.click(reserveButton);
        });

        const snackbar = await findByText('Some error');

        expect(setErrMsgMock).not.toHaveBeenCalled();
        expect(snackbar).toBeInTheDocument();
    });

    it('validates setErrorMsg isnt called from waitlist action. Snackbar appears', async () => {
        fetchLibraryBooks.mockReturnValue(Promise.resolve({
            json: () => Promise.resolve(books),
            ok: true
        }));
        fetchWaitlist.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(waitlistBooks),
            ok: true
        }));
        fetchReservations.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(reservedBooks),
            ok: true
        }));

        const error = new Error();
        error.message = 'Some error';

        registerWaitlist.mockImplementation(jest.fn(() => Promise.reject(
            error
        )));

        const setErrMsgMock = jest.fn();

        useExtensionControl.mockImplementation(() => ({
            setErrorMessage: setErrMsgMock,
            setLoadingStatus: jest.fn()
        }));

        const { findByText, findAllByLabelText } = render(<WrappedComponent />);

        const waitlistButtons = await findAllByLabelText('waitlist');
        const waitlistButton = waitlistButtons[0];

        await waitFor(() => {
            fireEvent.click(waitlistButton);
        });

        const snackbar = await findByText('Some error');

        expect(setErrMsgMock).not.toHaveBeenCalled();
        expect(snackbar).toBeInTheDocument();
    });

    it('validates onclose of the snackbar', async () => {
        fetchLibraryBooks.mockReturnValue(Promise.resolve({
            json: () => Promise.resolve(books),
            ok: true
        }));
        fetchWaitlist.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(waitlistBooks),
            ok: true
        }));
        fetchReservations.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(reservedBooks),
            ok: true
        }));
        useExtensionControl.mockImplementation(() => ({
            setErrorMessage: jest.fn(),
            setLoadingStatus: jest.fn()
        }));

        const { findByText, findAllByLabelText } = render(<WrappedComponent />);

        const waitlistButtons = await findAllByLabelText('waitlist');
        const waitlistButton = waitlistButtons[0];

        await waitFor(() => {
            fireEvent.click(waitlistButton);
        });

        const snackbar = await findByText('Some error');
        expect(snackbar).toBeVisible();

        // snackbar stays opened for 7 seconds...
        await new Promise((r) => setTimeout(r, 7001));
        expect(snackbar).not.toBeVisible();
    }, 8000);

    it('validates filter behavior', async () => {
        fetchLibraryBooks.mockReturnValue(Promise.resolve({
            json: () => Promise.resolve(books),
            ok: true
        }));
        fetchWaitlist.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(waitlistBooks),
            ok: true
        }));
        fetchReservations.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(reservedBooks),
            ok: true
        }));

        useExtensionControl.mockImplementation(() => ({
            setErrorMessage: jest.fn(),
            setLoadingStatus: jest.fn()
        }));

        const { findByRole, findAllByRole } = render(<WrappedComponent />);

        const search = await findByRole('searchbox');

        await userEvent.type(search, 'titleValue');

        const listItems = await findAllByRole('menuitem');

        await waitFor(() => {
            fireEvent.click(listItems[0]);
        });

        expect(search).toHaveValue('titleValue')
    });
});