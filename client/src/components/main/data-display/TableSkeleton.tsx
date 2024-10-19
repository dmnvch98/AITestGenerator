import React from 'react';
import { TableRow, TableCell, Skeleton } from '@mui/material';

interface TableSkeletonProps {
    columnCount: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ columnCount }) => {
    return (
        <>
            {Array.from(new Array(5)).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                    {Array.from(new Array(columnCount)).map((_, colIndex) => (
                        <TableCell key={colIndex}>
                            <Skeleton />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
};
