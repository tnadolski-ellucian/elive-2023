import React from 'react';
import { render } from '@testing-library/react';
import { buildCardDisplay } from '../../../src/common/components/CardDisplays';
import ThemeWrapper from '../../ThemeProvider';
import '@testing-library/jest-dom';

const books = [{
    booktitle: 'title1',
    booksubject: 'subject1',
    booktype: 'e-book'
}, {
    booktitle: 'title2',
    booksubject: 'subject2',
    booktype: 'newspaper'
}];

const types = ['reserved', 'waitlist'];

describe('buildCardDisplay', () => {
    it('properly builds for reserved', () => {
        const { getByRole, getAllByRole } = render(
            <ThemeWrapper>
                {buildCardDisplay(books, types[0])}
            </ThemeWrapper>
        );
        const heading = getByRole('heading', { level: 4 });
        const listItems = getAllByRole('listitem');

        expect(heading).toHaveTextContent('Your reserved books:');
        expect(listItems.length).toBe(2);
        expect(listItems[0]).toHaveTextContent('title1');
        expect(listItems[1]).toHaveTextContent('title2');
    });

    it('properly builds for waitlisted', () => {
        const { getByRole, getAllByRole } = render(
            <ThemeWrapper>
                {buildCardDisplay(books, types[1])}
            </ThemeWrapper>
        );
        const heading = getByRole('heading', { level: 4 });
        const listItems = getAllByRole('listitem');

        expect(heading).toHaveTextContent('Your waitlist books:');
        expect(listItems.length).toBe(2);
        expect(listItems[0]).toHaveTextContent('title1');
        expect(listItems[1]).toHaveTextContent('title2');
    });

    it('shows no assignment if books are undef', () => {
        const { getByRole, queryAllByRole, getByText } = render(
            <ThemeWrapper>
                {buildCardDisplay(undefined, types[0])}
            </ThemeWrapper>
        );
        const heading = getByRole('heading', { level: 4 });
        const listItems = queryAllByRole('listitem');
        const emptyListText = getByText('No reserved books assigned.');

        expect(heading).toHaveTextContent('Your reserved books:');
        expect(listItems.length).toBe(0);
        expect(emptyListText).toBeInTheDocument();
    });
})