import { html } from '@microsoft/fast-element';
import type { TableColumnTextCellRecord, TableColumnTextColumnConfig } from '.';
import type { TableCellState } from '../../table/types';

export const cellTemplate = html<
TableCellState<TableColumnTextCellRecord, TableColumnTextColumnConfig>
>`
    <span
        class="${record => (typeof record.cellRecord !== undefined ? '' : 'placeholder')}"
    >
        ${record => (record.cellRecord.value !== undefined
        ? (record.columnConfig.formatFunction ? record.columnConfig.formatFunction(record.cellRecord.value) : record.cellRecord.value)
        : (record.columnConfig.placeholder))}
    </span>
`;
