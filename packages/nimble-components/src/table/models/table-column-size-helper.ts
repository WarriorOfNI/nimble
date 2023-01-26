import type { TableColumn } from '../../table-column/base';

/**
 * A helper class
 */
export class TableColumnSizeHelper {
    public static getTemplateColumns(columns: TableColumn[]): string {
        return columns.reduce((accumulator: string, currentValue) => {
            const gap = accumulator === '' ? '' : ' ';
            if (currentValue.currentFixedWidth) {
                return `${accumulator}${gap}${currentValue.currentFixedWidth}px`;
            }

            return `${accumulator}${gap}${currentValue.currentFractionalWidth}fr`;
        }, '');
    }

    public static getColumnPixelWidth(gridSize: number, columns: TableColumn[], rowWidth: number): number {
        let totalMagnitude = 0;
        for (const col of columns) {
            if (col.currentFixedWidth === undefined) {
                totalMagnitude += col.currentFractionalWidth;
            }
        }

        return (gridSize / totalMagnitude) * rowWidth;
    }

    public static getTotalColumnMagnitude(columns: TableColumn[]): number {
        return columns.reduce((accumulator: number, currentValue) => {
            return accumulator + (currentValue.currentFixedWidth === null ? currentValue.currentFractionalWidth : 0);
        }, 0);
    }

    public static getTotalColumnFixedWidth(columns: TableColumn[]): number {
        return columns.reduce((accumulator: number, currentValue) => {
            return accumulator + (currentValue.currentFixedWidth !== null ? currentValue.currentFractionalWidth : 0);
        }, 0);
    }

    // public static updateColumnSizes(delta: number, columnIndex: number, columns: TableColumn[], rowWidth: number): void {

    // }
}