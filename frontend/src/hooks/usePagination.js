import { useState } from 'react';

const usePagination = (initialPage = 1, itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const paginate = (items) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    };

    const setPage = (page) => {
        setCurrentPage(page);
    };

    const resetPage = () => {
        setCurrentPage(1);
    };

    return {
        currentPage,
        itemsPerPage,
        paginate,
        setPage,
        resetPage
    };
};

export default usePagination;
