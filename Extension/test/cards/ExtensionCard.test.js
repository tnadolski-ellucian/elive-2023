import React from 'react';
import ReactDOM from 'react-dom';
import MyCard from '../../src/cards/ExtensionCard';
import ThemeProvider from '../ThemeProvider';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useCardControl } from '@ellucian/experience-extension-utils';
import { fetchReservations, fetchWaitlist } from '../../src/common/api/fetchs';

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
        useCardInfo: () => ({ configuration: { baseApiUrl: 'https://localhost:8080' } }),
        useCardControl: jest.fn()
    };
});

jest.mock('../../src/common/api/fetchs', () => {
    return {
        fetchWaitlist: jest.fn(),
        fetchReservations: jest.fn()
    }
});

function WrappedComponent() {
    return (
        <ThemeProvider>
            <MyCard />
        </ThemeProvider>
    )
}

describe('Extension Card', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('Renders without crashing', () => {
        fetchWaitlist.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(),
            ok: true
        }));
        fetchReservations.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(),
            ok: true
        }));

        useCardControl.mockImplementation(() => ({
            setErrorMessage: jest.fn(),
            setLoadingStatus: jest.fn()
        }));

        const div = document.createElement('div');
        ReactDOM.render(<WrappedComponent />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it('Fires setErrorMessage when fetchWaitlist fails', async () => {
        const error = new Error();
        fetchWaitlist.mockImplementation(() => Promise.reject(
            error
        ));
        fetchReservations.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(),
            ok: true
        }));

        const setErrMsgMock = jest.fn();

        useCardControl.mockImplementation(() => ({
            setErrorMessage: setErrMsgMock,
            setLoadingStatus: jest.fn()
        }));

        await waitFor(() => {
            render(<WrappedComponent />);
        })

        // this will call several times based on redraws
        // let's just make sure it's called
        expect(useCardControl().setErrorMessage).toHaveBeenCalled();
    });

    it('Fires setErrorMessage when fetchReservationsz fails', async () => {
        const error = new Error();
        fetchWaitlist.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(),
            ok: true
        }));
        fetchReservations.mockImplementation(() => Promise.reject(
            error
        ));

        const setErrMsgMock = jest.fn();

        useCardControl.mockImplementation(() => ({
            setErrorMessage: setErrMsgMock,
            setLoadingStatus: jest.fn()
        }));

        await waitFor(() => {
            render(<WrappedComponent />);
        })

        // this will call several times based on redraws
        // let's just make sure it's called
        expect(useCardControl().setErrorMessage).toHaveBeenCalled();
    });

    it('Fires setLoadingStatus when components tries to render', async () => {
        fetchWaitlist.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(),
            ok: true
        }));
        fetchReservations.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(),
            ok: true
        }));

        const setLoadStatMock = jest.fn();

        useCardControl.mockImplementation(() => ({
            setErrorMessage: jest.fn(),
            setLoadingStatus: setLoadStatMock
        }));

        await waitFor(() => {
            render(<WrappedComponent />);
        })

        // this will call several times based on redraws
        // let's just make sure it's called
        expect(useCardControl().setLoadingStatus).toHaveBeenCalled();
    });

    it('Correctly switches displays based on radio selection', async () => {
        fetchWaitlist.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(),
            ok: true
        }));
        fetchReservations.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve(),
            ok: true
        }));


        useCardControl.mockImplementation(() => ({
            setErrorMessage: jest.fn(),
            setLoadingStatus: jest.fn()
        }));

        const { findAllByRole, findByRole } = render(<WrappedComponent />);

        const radioGroup = await findByRole('radiogroup');
        const radioButtons = await findAllByRole('radio');

        expect(radioGroup).toBeInTheDocument();
        expect(radioButtons.length).toBe(2);
        expect(radioButtons[0]).toBeChecked();
        expect(radioButtons[1]).not.toBeChecked();

        fireEvent.click(radioButtons[1]);

        expect(radioButtons[0]).not.toBeChecked();
        expect(radioButtons[1]).toBeChecked();
    });
});
