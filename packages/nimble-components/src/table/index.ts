import { attr, observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import {
    ColumnDef as TanStackColumnDef,
    TableState as TanStackTableState,
    Updater as TanStackUpdater,
    Table as TanStackTable,
    createTable as tanStackCreateTable,
    getCoreRowModel as tanStackGetCoreRowModel,
    TableOptionsResolved as TanStackTableOptionsResolved
} from '@tanstack/table-core';
import type { TableColumn } from '../table-column/base';
import { TableColumnSizeHelper } from './models/table-column-size-helper';
import { TableValidator } from './models/table-validator';
import { styles } from './styles';
import { template } from './template';
import type { TableRecord, TableRowState, TableValidity } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table': Table;
    }
}

/**
 * A nimble-styled table.
 */
export class Table<
    TData extends TableRecord = TableRecord
> extends FoundationElement {
    @attr({ attribute: 'id-field-name' })
    public idFieldName?: string | null;

    @observable
    public data: TData[] = [];

    /**
     * @internal
     */
    @observable
    public tableData: TableRowState<TData>[] = [];

    // TODO: Temporarily expose the columns as a string array. This will ultimately be
    // column definitions provided by slotted elements.
    @observable
    public readonly columns: TableColumn[] = [];

    public get validity(): TableValidity {
        return this.tableValidator.getValidity();
    }

    /**
     * @internal
     */
    public readonly rowHeader!: Element;

    private readonly table: TanStackTable<TData>;
    private options: TanStackTableOptionsResolved<TData>;
    private readonly tableInitialized: boolean = false;
    private readonly tableValidator = new TableValidator();
    private activeColumnDivider?: number;
    private currentRowWidth?: number;
    private gridSizedColumns?: TableColumn[];

    public constructor() {
        super();
        this.options = {
            data: [],
            onStateChange: (_: TanStackUpdater<TanStackTableState>) => {},
            getCoreRowModel: tanStackGetCoreRowModel(),
            getRowId: record => {
                if (this.idFieldName) {
                    return record[this.idFieldName] as string;
                }
                // Return a falsey value to use the default ID from TanStack.
                return '';
            },
            columns: [],
            state: {},
            renderFallbackValue: null,
            autoResetAll: false
        };
        this.table = tanStackCreateTable(this.options);
        this.tableInitialized = true;
    }

    public idFieldNameChanged(
        _prev: string | undefined,
        _next: string | undefined
    ): void {
        // Force TanStack to detect a data update because a row's ID is only
        // generated when creating a new row model.
        this.trySetData([...this.data]);
    }

    public dataChanged(
        prev: TData[] | undefined,
        next: TData[] | undefined
    ): void {
        if ((!prev || prev.length === 0) && next && next.length > 0) {
            this.generateColumns();
        }

        // Ignore any updates that occur prior to the TanStack table being initialized.
        if (this.tableInitialized) {
            this.trySetData(this.data);
        }
    }

    public checkValidity(): boolean {
        return this.tableValidator.isValid();
    }

    public onDividerMouseDown(columnIndex: number): void {
        this.activeColumnDivider = columnIndex;
        this.currentRowWidth = this.rowHeader.getBoundingClientRect().width;
        document.addEventListener('mousemove', this.onDividerMouseMove);
        document.addEventListener('mouseup', this.onDividerMouseUp);
        this.setColumnsToFixedSize();
        console.log(`mousedown: width = ${this.currentRowWidth}, index = ${columnIndex}`);
    }

    private readonly onDividerMouseMove = (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        const deltaX = mouseEvent.movementX;
        const leftColumn = this.columns[this.activeColumnDivider!]!;
        if (leftColumn.currentFixedWidth! + deltaX >= (leftColumn.currentMinWidth ?? 0)) {
            leftColumn.currentFixedWidth! += deltaX;
        }

        const rightColumn = this.columns[this.activeColumnDivider! + 1]!;
        if (rightColumn.currentFixedWidth! - deltaX >= (rightColumn.currentMinWidth ?? 0)) {
            rightColumn.currentFixedWidth! -= deltaX;
        }
    };

    private readonly onDividerMouseUp = (): void => {
        document.removeEventListener('mousemove', this.onDividerMouseMove);
        document.removeEventListener('mouseup', this.onDividerMouseUp);
        this.resetGridSizedColumns();
    };

    private cacheGridSizedColumns(): void {
        this.gridSizedColumns = [];
        for (const column of this.columns) {
            if (column.currentFixedWidth === null) {
                this.gridSizedColumns.push(column);
            }
        }
    }

    private setColumnsToFixedSize(): void {
        this.cacheGridSizedColumns();
        const totalMagnitude = TableColumnSizeHelper.getTotalColumnMagnitude(this.columns);
        const totalFixedSize = TableColumnSizeHelper.getTotalColumnFixedWidth(this.columns);
        for (const column of this.columns) {
            if (column.currentFixedWidth === null) {
                column.currentFixedWidth = (column.currentFractionalWidth / totalMagnitude) * (this.currentRowWidth! - totalFixedSize);
            }
        }
    }

    private resetGridSizedColumns(): void {
        if (!this.gridSizedColumns) {
            return;
        }

        const largestColumnFixedSize = Math.max(...this.gridSizedColumns.map(column => column.currentFixedWidth!)!);
        for (const column of this.gridSizedColumns) {
            column.currentFractionalWidth = column.currentFixedWidth! / largestColumnFixedSize;
            column.currentFixedWidth = null;
        }
    }

    private trySetData(newData: TData[]): void {
        const areIdsValid = this.tableValidator.validateDataIds(
            newData,
            this.idFieldName
        );
        if (areIdsValid) {
            this.updateTableOptions({ data: newData });
        } else {
            this.updateTableOptions({ data: [] });
        }
    }

    private refreshRows(): void {
        const rows = this.table.getRowModel().rows;
        this.tableData = rows.map(row => {
            const rowState: TableRowState<TData> = { data: row.original };
            return rowState;
        });
    }

    private updateTableOptions(
        updatedOptions: Partial<TanStackTableOptionsResolved<TData>>
    ): void {
        this.options = { ...this.options, ...updatedOptions };
        this.update(this.table.initialState);
        this.refreshRows();
    }

    private readonly update = (state: TanStackTableState): void => {
        this.table.setOptions(prev => ({
            ...prev,
            ...this.options,
            state,
            onStateChange: (updater: unknown) => {
                const updatedState = typeof updater === 'function'
                    ? (updater(state) as TanStackTableState)
                    : (updater as TanStackTableState);
                this.update(updatedState);
            }
        }));
    };

    // Generate columns for TanStack that correspond to all the keys in TData because all operations,
    // such as grouping and sorting, will be performed on the data's records, not the values rendered within a cell.
    private generateColumns(): void {
        if (this.data.length === 0) {
            return;
        }

        const firstItem = this.data[0]!;
        const keys = Object.keys(firstItem);
        const generatedColumns = keys.map(key => {
            const columnDef: TanStackColumnDef<TData> = {
                id: key,
                accessorKey: key,
                header: key
            };
            return columnDef;
        });

        this.updateTableOptions({ columns: generatedColumns });
    }
}

const nimbleTable = Table.compose({
    baseName: 'table',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTable());
