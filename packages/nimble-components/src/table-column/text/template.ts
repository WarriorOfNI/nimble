import { html } from '@microsoft/fast-element';
import type { TableColumnTextCellRecord, TableColumnTextColumnConfig } from '.';
import type { TableCellState } from '../../table/types';

export const cellTemplate = html<
TableCellState<TableColumnTextCellRecord, TableColumnTextColumnConfig>
>`
    <span
        class="${x => (typeof x.cellRecord !== undefined ? '' : 'placeholder')}"
    >
        ${x => (x.cellRecord.value !== undefined
        ? x.cellRecord.value
        : x.columnConfig.placeholder)}
    </span>
`;
