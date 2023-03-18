
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeWrapper from '../../ThemeProvider';
import { InternalTable } from '../../../src/common/components/Table';
import '@testing-library/jest-dom';


const someBooks = [{
    title: 'title1',
    type: 'type1',
    subject: 'subject1',
    location: 'location1',
    availability: true
}, {
    title: 'title2',
    type: 'type2',
    subject: 'subject2',
    location: 'location2',
    availability: true
}, {
    title: 'title3',
    type: 'type3',
    subject: 'subject3',
    location: 'location3',
    availability: true
}, {
    title: 'title4',
    type: 'type4',
    subject: 'subject4',
    location: 'location4',
    availability: true
}, {
    title: 'title5',
    type: 'type5',
    subject: 'subject5',
    location: 'location5',
    availability: false
}];

const WrappedComponent = ({ books = someBooks, createButton = jest.fn }) => {
    return (
        <ThemeWrapper>
            <InternalTable data={books} createButton={createButton} />
        </ThemeWrapper>
    )
};

WrappedComponent.propTypes = {
    createButton: PropTypes.func,
    books: PropTypes.array
};

describe('InternalTable', () => {
    it('Renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<WrappedComponent />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it('Should create buttons equal to the number of books', () => {
        const mockCreateButton = jest.fn();

        render(<WrappedComponent createButton={mockCreateButton} />);

        expect(mockCreateButton).toHaveBeenCalledTimes(5);
    });

    it('Renders button and correct page',  () => {
        // need atleast 15 for the default to appear
        // just bloating an array with repetative values to get the button to appear.
        const bloatedBooks = [];
        for (let i = 0; i < 5; i++) {
            bloatedBooks.push(...someBooks);
        }

        const { getByLabelText, getByRole } = render(<WrappedComponent books={bloatedBooks} />);

        const nextButton = getByLabelText('Next page');
        const previousButton = getByLabelText('Previous page');
        let pageTextBox = getByRole('textbox');

        expect(nextButton).toBeInTheDocument();
        expect(previousButton).toBeInTheDocument();
        expect(pageTextBox).toHaveValue('1');

        fireEvent.click(nextButton);

        pageTextBox = getByRole('textbox');
        expect(pageTextBox).toHaveValue('2');
    });

    it('Changes total quantity of books paginated per page of table', async () => {
        const bloatedBooks = [];
        for (let i = 0; i < 5; i++) {
            bloatedBooks.push(...someBooks);
        }

        const { getByRole, findAllByRole } = render(<WrappedComponent books={bloatedBooks} />);

        let pageBox = getByRole('button', { name: 'Per page: 15' });
        // default state of rowsPerPage
        expect(pageBox).toBeInTheDocument();

        // for some reason, fireEvent.click doesn't work here
        // await maybe?
        await userEvent.click(pageBox);

        const allPageListItems = await findAllByRole('option');
        const firstListItem = allPageListItems[0];

        await userEvent.click(firstListItem);

        pageBox = getByRole('button', { name: 'Per page: 5' });
        // first entry of rowsPerPageOptions prop array
        expect(pageBox).toBeInTheDocument();
    });
});
