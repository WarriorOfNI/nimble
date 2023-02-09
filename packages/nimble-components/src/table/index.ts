import { attr, Notifier, Observable, observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import {
    ColumnDef as TanStackColumnDef,
    TableState as TanStackTableState,
    Updater as TanStackUpdater,
    Table as TanStackTable,
    createTable as tanStackCreateTable,
    getCoreRowModel as tanStackGetCoreRowModel,
    getSortedRowModel as tanStackGetSortedRowModel,
    TableOptionsResolved as TanStackTableOptionsResolved,
    SortingState as TanStackSortingState
} from '@tanstack/table-core';
import { TableColumn } from '../table-column/base';
import { TableValidator } from './models/table-validator';
import { styles } from './styles';
import { template } from './template';
import { ColumnSortDirection, TableRecord, TableRowState, TableValidity } from './types';
import { Virtualizer } from './models/virtualizer';

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
    public idFieldName?: string;

    /**
     * @internal
     */
    @observable
    public tableData: TableRowState<TData>[] = [];

    /**
     * @internal
     */
    @observable
    public sortDirectionByColumn = new Map<TableColumn, ColumnSortDirection>();

    @observable
    public columns: TableColumn[] = [];

    /**
     * @internal
     */
    @observable
    public canRenderRows = true;

    public get validity(): TableValidity {
        return this.tableValidator.getValidity();
    }

    /**
     * @internal
     */
    public readonly viewport!: HTMLElement;

    /**
     * @internal
     */
    public readonly virtualizer: Virtualizer<TData>;

    private readonly table: TanStackTable<TData>;
    private options: TanStackTableOptionsResolved<TData>;
    private readonly tableValidator = new TableValidator();
    private notifiers: Notifier[] = [];

    public constructor() {
        super();
        this.options = {
            data: [],
            onStateChange: (_: TanStackUpdater<TanStackTableState>) => {},
            getCoreRowModel: tanStackGetCoreRowModel(),
            getSortedRowModel: tanStackGetSortedRowModel(),
            columns: [],
            state: {},
            enableSorting: true,
            renderFallbackValue: null,
            autoResetAll: false
        };
        this.table = tanStackCreateTable(this.options);
        this.virtualizer = new Virtualizer(this);
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.virtualizer.connectedCallback();
        this.observeColumns();
        this.validateColumnIds();
    }

    public override disconnectedCallback(): void {
        this.virtualizer.disconnectedCallback();
        this.removeColumnObservers();
    }

    /**
     * @internal
     */
    // 'handleChange' is an API exposed by FAST that we need to implement. Disable lint rules caused by its signature.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    public handleChange(source: any, args: any): void {
        if (source instanceof TableColumn) {
            if (args === 'columnId') {
                this.validateColumnIds();
            } else if (args === 'sortOrder' || args === 'sortDirection' || args === 'dataFieldName' || args === 'defaultDataFieldName') {
                this.updateSortState();
            }
        }
    }

    public setData(newData: readonly TData[]): void {
        this.generateTanStackColumns(newData);
        this.setTableData(newData);
    }

    private updateSortState(): void {
        const tanStackSortingState: TanStackSortingState = [];
        const sortedColumns = this.columns
            .filter(x => x.sortOrder !== null && x.sortDirection !== ColumnSortDirection.none)
            .sort((x, y) => (x.sortOrder! - y.sortOrder!));

        for (const column of sortedColumns) {
            const sortField = column.dataFieldName ?? column.defaultDataFieldName;
            if (typeof sortField !== 'string') {
                continue;
            }

            this.options.columns.find(x => x.id === sortField);

            tanStackSortingState.push({
                id: sortField,
                desc: column.sortDirection === ColumnSortDirection.descending
            });
        }

        this.table.setSorting(tanStackSortingState);
        this.refreshRows();
    }

    /**
     * Open questions:
     * 
     * Visual design:
     *  - need correct arrow icons
     *  - is the space for the sort icon always reserved, or does it collapse when the column isn't sorted? or, when it isn't sortable?
     * 
     * UX design:
     *  - confirm that only the first column shows the sort state
     * 
     * API design:
     *  - is this a function on the table? or an property?
     *  - what is the validation story?
     *  - can you query the sort state?
     *  - events?
     *  - is the sort state reflected onto a column somehow? is it settable from a column?
     *  - we probably need to introduce the concept of hidden columns.
     */
    // public setSortState(sortState: TableColumnSortState[]): void {
    //     this.sortState = sortState.map(state => {
    //         return { ...state };
    //     });

    //     const updatedMap = new Map<TableColumn, ColumnSortDirection>();
    //     this.firstSortedColumn = undefined;

    //     const tanStackSortingState: TanStackSortingState = [];
    //     for (const sortEntry of sortState) {
    //         if (sortEntry.direction === ColumnSortDirection.none) {
    //             continue;
    //         }

    //         const column = this.columns.find(c => c.columnId === sortEntry.columnId);
    //         if (!column) {
    //             continue;
    //         }

    //         if (!this.firstSortedColumn) {
    //             this.firstSortedColumn = column;
    //         }
    //         updatedMap.set(column, sortEntry.direction);

    //         const sortField = column.dataFieldName ?? column.getDefaultDataFieldName();
    //         if (typeof sortField !== 'string') {
    //             continue;
    //         }

    //         this.options.columns.find(x => x.id === sortField);

    //         tanStackSortingState.push({
    //             id: sortField,
    //             desc: sortEntry.direction === ColumnSortDirection.descending
    //         });
    //     }

    //     this.sortDirectionByColumn = updatedMap;

    //     this.table.setSorting(tanStackSortingState);
    //     this.refreshRows();
    // }

    // public getSortState(): TableColumnSortState[] {
    //     return this.sortState;
    // }

    public checkValidity(): boolean {
        return this.tableValidator.isValid();
    }

    private idFieldNameChanged(
        _prev: string | undefined,
        _next: string | undefined
    ): void {
        // Force TanStack to detect a data update because a row's ID is only
        // generated when creating a new row model.
        this.setTableData(this.table.options.data);
    }

    private columnsChanged(
        _prev: TableColumn[] | undefined,
        _next: TableColumn[]
    ): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        this.observeColumns();
        this.validateColumnIds();
    }

    private removeColumnObservers(): void {
        this.notifiers.forEach(notifier => {
            notifier.unsubscribe(this);
        });
        this.notifiers = [];
    }

    private observeColumns(): void {
        this.removeColumnObservers();

        for (const column of this.columns) {
            const notifier = Observable.getNotifier(column);
            notifier.subscribe(this);
        }
    }

    private validateColumnIds(): void {
        this.tableValidator.validateColumnIds(
            this.columns.map(x => x.columnId)
        );
        this.canRenderRows = this.checkValidity();
    }

    private setTableData(newData: readonly TData[]): void {
        const data = newData.map(record => {
            return { ...record };
        });
        this.tableValidator.validateRecordIds(data, this.idFieldName);
        this.canRenderRows = this.checkValidity();

        const getRowIdFunction = this.idFieldName === null || this.idFieldName === undefined
            ? undefined
            : (record: TData) => record[this.idFieldName!] as string;
        this.updateTableOptions({
            data,
            getRowId: getRowIdFunction
        });
    }

    private refreshRows(): void {
        const rows = this.table.getRowModel().rows;
        this.tableData = rows.map(row => {
            const rowState: TableRowState<TData> = {
                record: row.original,
                id: row.id
            };
            return rowState;
        });
        this.virtualizer.dataChanged();
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
    private generateTanStackColumns(data: readonly TData[]): void {
        if (data.length === 0) {
            return;
        }

        const firstItem = data[0]!;
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
