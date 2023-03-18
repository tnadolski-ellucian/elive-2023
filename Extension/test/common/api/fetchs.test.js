/* eslint-disable jest/no-conditional-expect */
/* eslint-disable prefer-promise-reject-errors */
import { reserveLibraryBook, fetchLibraryBooks, fetchWaitlist, fetchReservations, registerReservation, registerWaitlist } from '../../../src/common/api/fetchs';

global.fetch = jest.fn();

// curtosy of the default jwt.io
const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const baseApiUrl = 'http://localhost:8080/api';
const libraryBook = {
    title: 'title',
    id: '00000000-0000-0000-0000-000000000000',
    availability: true
};

// going to use this same array for the 3 different fetchs
// the client wouldn't notice a difference anyway
const multipleBooks = [{
    title: 'title',
    id: '00000000-0000-0000-0000-000000000000',
    availability: true
}, {
    title: 'title1',
    id: '00000000-0000-0000-0000-000000000001',
    availability: true
}, {
    title: 'title2',
    id: '00000000-0000-0000-0000-000000000002',
    availability: true
}];

describe('validates each fetch', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('resolves fetchLibraryBooks and returns book', async () => {
        fetch.mockImplementation(() => Promise.resolve({
            json: () => multipleBooks,
            ok: true
        }));
        const response = await fetchLibraryBooks(jwt, baseApiUrl);

        expect(response.json()).toStrictEqual(multipleBooks);
    });

    it('resolves without ok fetchLibraryBooks, and throws client error', async () => {
        fetch.mockImplementation(() => Promise.resolve({
            ok: false,
            status: 418
        }));

        try {
            await fetchLibraryBooks(jwt, baseApiUrl)
        } catch (err) {
            expect(err.message).toEqual('An error has occured');
            expect(err.name).toEqual('Failed to fetch');
        }
    });

    it('rejects fetchLibraryBooks, and throws server error', async () => {
        fetch.mockImplementation(() => Promise.reject({
            status: 403
        }));

        try {
            await fetchLibraryBooks(jwt, baseApiUrl)
        } catch (err) {
            expect(err.status).toEqual(403);
        }
    });

    it('resolves fetchWaitlist and returns waitlisted books', async () => {
        fetch.mockImplementation(() => Promise.resolve({
            json: () => multipleBooks,
            ok: true
        }));
        const response = await fetchWaitlist(jwt, baseApiUrl);

        expect(response.json()).toStrictEqual(multipleBooks);
    });

    it('resolves fetchWaitlist, throws error if response is not ok', async () => {
        fetch.mockImplementation(() => Promise.resolve({
            status: 403,
            ok: false
        }));

        try {
            await fetchWaitlist(jwt, baseApiUrl, libraryBook);
        } catch (err) {
            expect(err.message).toEqual('Failed to save waitlist');
        }
    });

    it('resolves fetchReservation and returns reserved books', async () => {
        fetch.mockImplementation(() => Promise.resolve({
            json: () => multipleBooks,
            ok: true
        }));
        const response = await fetchReservations(jwt, baseApiUrl);

        expect(response.json()).toStrictEqual(multipleBooks);
    });

    it('resolves fetchReservation, throws error if response is not ok', async () => {
        fetch.mockImplementation(() => Promise.resolve({
            status: 403,
            ok: false
        }));

        try {
            await fetchReservations(jwt, baseApiUrl, libraryBook);
        } catch (err) {
            expect(err.message).toEqual('Failed to save reservations');
        }
    });

    it('resolves POST registerReservation', async () => {
        fetch.mockImplementation(() => Promise.resolve({
            status: 200,
            ok: true
        }));
        const response = await registerReservation(jwt, baseApiUrl, libraryBook);

        expect(response.status).toBe(200);
    });

    it('resolves registerReservation, throws error if response is not ok', async () => {
        fetch.mockImplementation(() => Promise.resolve({
            status: 403,
            ok: false
        }));

        try {
            await registerReservation(jwt, baseApiUrl, libraryBook);
        } catch (err) {
            expect(err.message).toEqual('Failed to reserve');
        }
    });

    it('rejects POST registerReservation', async () => {
        fetch.mockImplementation(() => Promise.reject({
            status: 500
        }));

        try {
            await registerReservation(jwt, baseApiUrl, libraryBook);
        } catch (err) {
            expect(err.status).toEqual(500);
        }
    });

    it('resolves POST registerWaitlist', async () => {
        fetch.mockImplementation(() => Promise.resolve({
            status: 200,
            ok: true
        }));
        const response = await registerWaitlist(jwt, baseApiUrl, libraryBook);

        expect(response.status).toBe(200);
    });

    it('resolves registerWaitlist, throws error if response is not ok', async () => {
        fetch.mockImplementation(() => Promise.resolve({
            status: 403,
            ok: false
        }));

        try {
            await registerWaitlist(jwt, baseApiUrl, libraryBook);
        } catch (err) {
            expect(err.message).toEqual('Failed to save waitlist');
        }
    });

    it('rejects POST registerWaitlist', async () => {
        fetch.mockImplementation(() => Promise.reject({
            status: 500
        }));

        try {
            await registerWaitlist(jwt, baseApiUrl, libraryBook);
        } catch (err) {
            expect(err.status).toEqual(500);
        }
    });

    it('resolves PATCH reserveLibraryBook', async () => {
        fetch.mockImplementation(() => Promise.resolve({
            status: 200,
            ok: true
        }));
        const response = await reserveLibraryBook(jwt, baseApiUrl, libraryBook);

        expect(response.status).toBe(200);
    });

    it('resolves PATCH reserveLibraryBook, throws error if response is not ok', async () => {
        fetch.mockImplementation(() => Promise.resolve({
            status: 403,
            ok: false
        }));

        try {
            await reserveLibraryBook(jwt, baseApiUrl, libraryBook);
        } catch (err) {
            expect(err.message).toEqual('Failed to patch');
        }
    });

    it('rejects PATCH reserveLibraryBook', async () => {
        fetch.mockImplementation(() => Promise.reject({
            status: 500
        }));

        try {
            await reserveLibraryBook(jwt, baseApiUrl, libraryBook);
        } catch (err) {
            expect(err.status).toEqual(500);
        }
    });
});