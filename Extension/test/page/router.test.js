import React from 'react';
import InternalRouter from '../../src/page/router';
import { render } from '@testing-library/react';

jest.mock('../../src/page/Home', () => {
    return {
        __esModule: true,
        default: () => (<div data-testid="home-page" />)
    };
});

const basePageInfo = { basePath: '/tenantAlias/page/accountId/publisher/name/type/' };

const TestRouter = () => {
    return <InternalRouter pageInfo={basePageInfo} />
};

describe("RouterPage", () => {
    it("validates renders the only route", () => {
        const { getByTestId } = render(<TestRouter />);
        expect(getByTestId('home-page')).toBeTruthy();
    });
});