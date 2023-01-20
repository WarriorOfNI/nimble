import type { TableColumn } from '../../table-column/base';

/**
 * A helper class
 */
export class TableColumnSizeHelper {
    public static getTemplateColumns(columns: TableColumn[]): string {
        return columns.reduce((accumulator: string, currentValue) => {
            const gap = accumulator === '' ? '' : ' ';
            if (currentValue.fixedSize) {
                return `${accumulator}${gap}${currentValue.fixedSize}px`;
            }

            return `${accumulator}${gap}${currentValue.gridSize}fr`;
        }, '');
    }

    public static getColumnPixelWidth(gridSize: number, columns: TableColumn[], rowWidth: number): number {
        let totalMagnitude = 0;
        for (const col of columns) {
            if (col.fixedSize === undefined) {
                totalMagnitude += col.gridSize;
            }
        }

        return (gridSize / totalMagnitude) * rowWidth;
    }

    public static getTotalColumnMagnitude(columns: TableColumn[]): number {
        return columns.reduce((accumulator: number, currentValue) => {
            return accumulator + (currentValue.fixedSize === null ? currentValue.gridSize : 0);
        }, 0);
    }

    public static getTotalColumnFixedWidth(columns: TableColumn[]): number {
        return columns.reduce((accumulator: number, currentValue) => {
            return accumulator + (currentValue.fixedSize !== null ? currentValue.fixedSize : 0);
        }, 0);
    }

    // public static updateColumnSizes(delta: number, columnIndex: number, columns: TableColumn[], rowWidth: number): void {

    // }
}