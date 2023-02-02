import { html } from '@microsoft/fast-element';
import type { TableColumnNumberCellRecord, TableColumnNumberColumnConfig } from '.';
import type { TableCellState } from '../../table/types';

export const cellTemplate = html<
TableCellState<TableColumnNumberCellRecord, TableColumnNumberColumnConfig>
>`
    <span
        class="${x => (typeof x.cellRecord !== undefined ? '' : 'placeholder')}"
    >
        ${x => (typeof x.cellRecord.value === 'number'
        ? x.columnConfig.formatFunction(x.cellRecord.value)
        : x.columnConfig.placeholder)}
    </span>
`;
