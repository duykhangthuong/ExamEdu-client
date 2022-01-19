import { useMemo } from "react";

export const usePagination = ({ totalRecords, currentPage, pageSize }) => {
    const totalPage = useMemo(() => {
        return Math.ceil(totalRecords / pageSize);
    }, [totalRecords, pageSize]);

    const paginationRange = useMemo(() => {
        //Create an array containing numbers from start to end
        const range = (start, end) => {
            const length = end - start + 1;
            return Array.from({ length }, (_, index) => index + start);
        };

        const numberOfSibling = 2;
        const leftSiblingIndex = Math.max(currentPage - numberOfSibling, 1);
        const rightSiblingIndex = Math.min(
            currentPage + numberOfSibling,
            totalPage
        );

        return range(leftSiblingIndex, rightSiblingIndex);
    }, [currentPage, totalPage]);

    return [totalPage, paginationRange];
};
