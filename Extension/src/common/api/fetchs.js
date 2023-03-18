export const reserveLibraryBook = async (jwt, baseApiUrl, libraryBook) => {
    const response = await fetch(`${baseApiUrl}/Library/books/${libraryBook.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({
            id: libraryBook.id,
            availability: !libraryBook.availability
        })
    });

    if (!response.ok) {
        const error = new Error();
        error.message = "Failed to patch";

        throw error;
    }

    return response;
};

export const fetchLibraryBooks = async (jwt, baseApiUrl) => {

    const response = await fetch(`${baseApiUrl}/Library/books`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    });

    if (!response.ok) {
        const error = new Error();
        error.statusCode = response.status;
        error.message = "An error has occured";
        error.name = "Failed to fetch";

        throw error;
    }

    return response;
};

export const fetchWaitlist = async (jwt, baseApiUrl) => {
    const response = await fetch(`${baseApiUrl}/waitlists`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    });

    if (!response.ok) {
        const error = new Error();
        error.message = "Failed to save waitlist";

        throw error;
    }

    return response;
};

export const fetchReservations = async (jwt, baseApiUrl) => {
    const response = await fetch(`${baseApiUrl}/reservations`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    });

    if (!response.ok) {
        const error = new Error();
        error.message = "Failed to save reservations";

        throw error;
    }

    return response;
};

export const registerReservation = async (jwt, baseApiUrl, libraryBook) => {
    const response = await fetch(`${baseApiUrl}/reservations`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({
            id: libraryBook.id,
            title: libraryBook.title
        })
    });

    if (!response.ok) {
        const error = new Error();
        error.message = "Failed to reserve";

        throw error;
    }

    return response;
};

export const registerWaitlist = async (jwt, baseApiUrl, libraryBook) => {
    const response = await fetch(`${baseApiUrl}/waitlists`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({
            id: libraryBook.id,
            title: libraryBook.title
        })
    });

    if (!response.ok) {
        const error = new Error();
        error.message = "Failed to save waitlist";

        throw error;
    }

    return response;
};