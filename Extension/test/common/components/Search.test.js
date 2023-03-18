/* eslint-disable react/prop-types */
import React from 'react';
import ReactDOM from 'react-dom';
import { InternalSearch } from '../../../src/common/components/Search';
import ThemeProvider from '../../ThemeProvider';
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

const books = [{
    title: 'Env Sci Title',
    id: '00000000-0000-0000-0000-000000000000',
    availability: true,
    subject: 'Environmental Sciences'
}, {
    title: 'title1',
    id: '00000000-0000-0000-0000-000000000001',
    availability: false,
    subject: 'Law'
}, {
    title: 'title2',
    id: '00000000-0000-0000-0000-000000000002',
    availability: true,
    subject: 'Mathematics'
}];

const WrappedComponent = ({ setter = jest.fn }) => {
    return (
        <ThemeProvider>
            <InternalSearch books={books} setter={setter} />
        </ThemeProvider>
    )
};

describe('InternalSearch', () => {
    it('Renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<WrappedComponent />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it('Renders a visible searchbox', () => {
        const { getByRole } = render(<WrappedComponent />);

        const search = getByRole('searchbox');
        expect(search).toBeVisible();
    });

    it('Fires onchange, and parent setter when value changes', async () => {
        const mockSet = jest.fn();
        const { getByRole } = render(<WrappedComponent setter={mockSet} />);

        const search = getByRole('searchbox');
        const searchButton = getByRole('button');

        await waitFor(() => {
            fireEvent.change(search, { target: { value: 'env' } });
            fireEvent.click(searchButton);
        });

        expect(search).toHaveValue('env');
        expect(mockSet).toHaveBeenCalledTimes(1);
    });

    it('clears results when clear is clicked', async () => {
        const mockSet = jest.fn();
        const { getByRole } = render(<WrappedComponent setter={mockSet} />);

        const search = getByRole('searchbox');
        const searchButton = getByRole('button');

        await waitFor(() => {
            fireEvent.change(search, { target: { value: 'env' } });
            fireEvent.click(searchButton);
        });

        expect(mockSet).toHaveBeenCalledTimes(1);

        // the previous button will switch to a "clear" (X) button after a search concludes
        // we'll need to check the dom again for the new button
        const clearButton = getByRole('button');
        await waitFor(() => {
            fireEvent.click(clearButton);
        })

        expect(search).toHaveValue('');
        expect(mockSet).toHaveBeenCalledTimes(2);
    });

    it('sets searchStrings by selecting the search item', async () => {
        const { findAllByRole, getByRole } = render(<WrappedComponent />);

        const search = getByRole('searchbox');

        await userEvent.type(search, 'env');

        const listItems = await findAllByRole('menuitem');

        await waitFor(() => {
            fireEvent.click(listItems[0]);
        });

        // this search box value will be the title clicked on
        expect(search).toHaveValue('Env Sci Title');
    });

    it('results are not found if search doesnt match', async () => {
        const { queryAllByRole, getByRole, findByText } = render(<WrappedComponent />);

        const search = getByRole('searchbox');
        const searchButton = getByRole('button');

        await waitFor(() => {
            fireEvent.change(search, { target: { value: 'meme' } });
            fireEvent.click(searchButton);
        });

        const listItems = queryAllByRole('menuitem');
        expect(listItems.length).toBe(0);

        const resultsNotFound = await findByText('No results found. Try again.');
        expect(resultsNotFound).toBeInTheDocument();
    });

    it('switches correctly with filter', async () => {
        const { getByRole, findAllByRole} = render(<WrappedComponent />);

        const search = getByRole('searchbox');

        await userEvent.type(search, 'env');

        const listItems = await findAllByRole('menuitem');

        await waitFor(() => {
            fireEvent.click(listItems[0]);
        });

        const switchBox = getByRole('checkbox');
        expect(switchBox).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(switchBox);
        });

        expect(switchBox).toBeChecked();

        await waitFor(() => {
            fireEvent.click(switchBox);
        });

        expect(switchBox).not.toBeChecked();
    });
});