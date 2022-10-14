/* eslint-disable @typescript-eslint/member-ordering */
import { Observable, observable, ViewTemplate } from '@microsoft/fast-element';
import { DataGridCell, DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import {
    ColumnDef,
    TableState,
    Updater,
    Table as TanstackTable,
    createTable,
    getCoreRowModel,
    TableOptionsResolved,
    getSortedRowModel,
    getGroupedRowModel,
    getExpandedRowModel,
    SortingState,
    SortDirection,
    GroupingState,
    Column,
    Row,
} from '@tanstack/table-core';
import { Virtualizer, VirtualizerOptions, elementScroll, observeElementOffset, observeElementRect, windowScroll, VirtualItem } from '@tanstack/virtual-core';
import { template } from './template';
import { styles } from './styles';
import type { TableCell } from '../table-cell';
import type { TableRowData } from '../table-row';
import type { ExpandedState } from '../utilities/tests/states';
import type { MenuButton } from '../menu-button';
import type { Menu } from '../menu';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table': Table;
    }
}

export interface TableColumn {
    columnDataKey: string;
    gridColumn?: string;
    title?: string;
    headerCellTemplate?: ViewTemplate;
    headerCellInternalFocusQueue?: boolean;
    headerCellFocusTargetCallback?: (cell: DataGridCell) => HTMLElement;
    cellTemplate?: ViewTemplate<TableCell, TableCell>;
    cellInternalFocusQueue?: boolean;
    cellFocusTargetCallback?: (cell: DataGridCell) => HTMLElement;
    isRowHeader?: boolean;
}

export interface TableHeader {
    title: string;
    sortingState: SortDirection | false;
    column: Column<unknown>;
}

export interface TableRow {
    id?: string;
    index: number;
    visibleCells: TableCell[];
    row: Row<unknown>;
}

export interface ColumnSortState {
    id: string;
    sortDirection: SortDirection | undefined;
}

interface ObjectInterface {
    [key: string]: unknown;
}

/**
 * Table
 */
export class Table extends FoundationElement {
    public readonly rowContainer!: HTMLElement;
    public readonly viewport!: HTMLElement;
    public readonly tableContainer!: HTMLElement;
    public virtualizer?: Virtualizer;

    private _actionMenuClone: Node | undefined;

    /** @internal */
    @observable
    public readonly slottedActionMenus: HTMLElement[] | undefined;

    public slottedActionMenusChanged(
        _prev: HTMLElement[] | undefined,
        _next: HTMLElement[] | undefined
    ): void {
        if (this.slottedActionMenus?.length) {
            this._actionMenuClone = this.slottedActionMenus[0]?.cloneNode(true);
        } else {
            this._actionMenuClone = undefined;
        }
    }

    // private get actionMenu(): HTMLElement | undefined {
    //     return this.slottedActionMenus?.length ? this.slottedActionMenus[0] : undefined;
    // }

    @observable
    public viewportReady = false;

    private readonly table: TanstackTable<unknown>;
    private _data: unknown[] = [];
    private _columns: TableColumn[] = [];
    private _rows: TableRowData[] = [];
    private _headers: TableHeader[] = [];
    private _options: TableOptionsResolved<unknown>;
    private _sorting: SortingState = [];
    private _grouping: GroupingState = [];
    private _expanded: ExpandedState = [];
    private _tanstackcolumns: ColumnDef<unknown>[] = [];
    private _visibleItems: VirtualItem<unknown>[] = [];
    private _rowContainerHeight = 0;
    private _ready = false;
    private _rowIdProperty = '';
    private _rowHierarchyProperty = '';
    private readonly resizeObserver: ResizeObserver;

    public constructor() {
        super();
        const data = this.data;
        const tanstackColumns = this._tanstackcolumns;
        const sorting = this._sorting;
        const grouping = this._grouping;
        const expanded = this._expanded;
        this._options = {
            get data(): unknown[] {
                return data ?? [];
            },
            onStateChange: (_: Updater<TableState>) => { },
            getCoreRowModel: getCoreRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getGroupedRowModel: getGroupedRowModel(),
            getExpandedRowModel: getExpandedRowModel(),
            getRowCanExpand: r => {
                return r.original.children?.length || r.original.age > 35;
            },
            getSubRows: r => r.children,
            getRowId: r => r.id,
            onSortingChange: this.setSorting,
            onGroupingChange: this.setGrouping,
            onExpandedChange: this.setExpanded,
            columns: tanstackColumns,
            state: {
                sorting,
                grouping,
                expanded
            },
            renderFallbackValue: null,
            enableGrouping: true,
            groupedColumnMode: false,
            autoResetAll: false
        };
        this.table = createTable(this._options);
        const nimbleTable = this;
        this.resizeObserver = new ResizeObserver(entries => {
            if (entries.map(entry => entry.target).includes(this.viewport)) {
                nimbleTable.initializeVirtualizer();
                nimbleTable.virtualizer!._willUpdate();
                nimbleTable.visibleItems = nimbleTable.virtualizer!.getVirtualItems();
                nimbleTable.rowContainerHeight = nimbleTable.virtualizer!.getTotalSize();
            }
        });
    }

    private updateVirtualizer(): void {
        if (!this.virtualizer) {
            return;
        }
        this.virtualizer.options.count = this.table.getRowModel().rows.length;
        this.rowContainerHeight = this.virtualizer.getTotalSize();
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.resizeObserver.observe(this.viewport);
    }

    public get data(): unknown[] {
        Observable.track(this, 'data');
        return this._data;
    }

    public set data(value: unknown[]) {
        this._data = value;
        Observable.notify(this, 'data');
        this._options = { ...this._options, data: this.data };
        this.update({ ...this.table.initialState, sorting: this._sorting, grouping: this._grouping, expanded: this._expanded });
        this.refreshRows();
    }

    public get columns(): TableColumn[] {
        return this._columns;
    }

    public set columns(value: TableColumn[]) {
        this._tanstackcolumns = [];
        this._columns = value;
        value.forEach(column => {
            const tanstackColumn: ColumnDef<unknown> = {
                id: column.columnDataKey,
                accessorFn: (row: unknown) => {
                    const keys = Object.keys(row as ObjectInterface);
                    const valueIndex = keys.indexOf(column.columnDataKey);
                    return Object.values(row as ObjectInterface)[valueIndex];
                },
                header: column.title,
                footer: info => info.column.id,
                // aggregatedCell: 'foo'
            };
            this._tanstackcolumns.push(tanstackColumn);
        });
        this._options = { ...this._options, columns: this._tanstackcolumns };
        this.update(this.table.initialState);
        this.refreshRows();
        this.refreshHeaders();
        this.table.getColumn(this.columns[0]?.columnDataKey ?? '').toggleSorting();
        this.ready = true;
    }

    public get ready(): boolean {
        Observable.track(this, 'ready');
        return this._ready;
    }

    public set ready(value: boolean) {
        this._ready = value;
        Observable.notify(this, 'ready');
    }

    public get tableData(): TableRowData[] {
        Observable.track(this, 'tableData');
        return this._rows;
    }

    public set tableData(value: TableRowData[]) {
        this._rows = value;
        Observable.notify(this, 'tableData');
    }

    public get tableHeaders(): TableHeader[] {
        Observable.track(this, 'tableHeaders');
        return this._headers;
    }

    public set tableHeaders(value: TableHeader[]) {
        this._headers = value;
        Observable.notify(this, 'tableHeaders');
    }

    /**
     * @internal
     */
    public get visibleItems(): VirtualItem<unknown>[] {
        Observable.track(this, 'visibleItems');
        return this._visibleItems;
    }

    public set visibleItems(value: VirtualItem<unknown>[]) {
        this._visibleItems = value;
        Observable.notify(this, 'visibleItems');
    }

    public get rowContainerHeight(): number {
        Observable.track(this, 'rowContainerHeight');
        return this._rowContainerHeight;
    }

    public set rowContainerHeight(value: number) {
        this._rowContainerHeight = value;
        Observable.notify(this, 'rowContainerHeight');
    }

    public get rowIdProperty(): string {
        Observable.track(this, 'rowIdProperty');
        return this._rowIdProperty;
    }

    public set rowIdProperty(value: string) {
        this._rowIdProperty = value;
        this._options = {
            ...this._options,
            getRowId: value ? (r => r[value]) : undefined
        };
        this.update({ ...this.table.initialState, getRowId: this._options.getRowId, sorting: this._sorting, grouping: this._grouping, expanded: this._expanded });
        this.refreshRows();
        Observable.notify(this, 'rowIdProperty');
    }

    public get rowHierarchyProperty(): string {
        Observable.track(this, 'rowHierarchyProperty');
        return this._rowHierarchyProperty;
    }

    public set rowHierarchyProperty(value: string) {
        // TODO: setting this doesn't take affect until you set data again...why?
        this._rowHierarchyProperty = value;
        this._options = {
            ...this._options,
            getSubRows: value ? (r => r[value]) : undefined
        };
        this.update({ ...this.table.initialState, getSubRows: this._options.getSubRows, sorting: this._sorting, grouping: this._grouping, expanded: this._expanded });
        this.refreshRows();
        Observable.notify(this, 'rowHierarchyProperty');
    }

    public getColumnTemplate(index: number): ViewTemplate {
        const column = this.columns[index]!;
        return column.cellTemplate!;
    }

    public getColumnTemplateById(columnId: string): ViewTemplate | undefined {
        const column = this.columns.find(x => x.columnDataKey === columnId);
        return column?.cellTemplate;
    }

    public onMenuOpenChange(_rowData: TableRowData, event: CustomEvent): void {
        // debugger;
        if (!this._actionMenuClone) {
            return;
        }

        const menuButton = (event.target as MenuButton);
        if (!menuButton) {
            return;
        }

        if (menuButton.open) {
            menuButton.appendChild(this._actionMenuClone);
        } else {
            menuButton.removeChild(this._actionMenuClone);
        }
    }

    private readonly setSorting = (updater: unknown): void => {
        if (updater instanceof Function) {
            this._sorting = updater(this._sorting) as SortingState;
        } else {
            this._sorting = (updater as SortingState);
        }

        this._options.state = { ...this._options.state, sorting: this._sorting };
        this.update({ ...this.table.initialState, sorting: this._sorting, grouping: this._grouping, expanded: this._expanded });
        this.refreshRows();
        this.refreshHeaders();
    };

    private readonly setGrouping = (updater: unknown): void => {
        if (updater instanceof Function) {
            this._grouping = updater(this._grouping) as GroupingState;
        } else {
            this._grouping = (updater as GroupingState);
        }

        this._options.state = { ...this._options.state, grouping: this._grouping };
        this.update({ ...this.table.initialState, sorting: this._sorting, grouping: this._grouping, expanded: this._expanded });
        this.refreshRows();
        this.refreshHeaders();
    };

    private readonly setExpanded = (updater: unknown): void => {
        // console.log(`before: ${Object.keys(this._expanded)}`);
        const originalExpandedIds = Object.keys(this._expanded);
        if (updater instanceof Function) {
            this._expanded = updater(this._expanded) as ExpandedState;
        } else {
            this._expanded = (updater as ExpandedState);
        }
        // console.log(`after: ${Object.keys(this._expanded)}`);
        const updatedExpandedIds = Object.keys(this._expanded);

        this._options.state = { ...this._options.state, expanded: this._expanded };
        this.update({ ...this.table.initialState, sorting: this._sorting, grouping: this._grouping, expanded: this._expanded });
        this.refreshRows();
        this.refreshHeaders();

        const newlyCollapsedIds = originalExpandedIds.filter(x => !updatedExpandedIds.find(y => x === y));
        const newlyExpandedIds = updatedExpandedIds.filter(x => !originalExpandedIds.find(y => x === y));

        for (const newCollapsedId of newlyCollapsedIds) {
            this.$emit('row-collapse', { id: newCollapsedId });
        }
        for (const newExpandedId of newlyExpandedIds) {
            this.$emit('row-expand', { id: newExpandedId });
        }
    };

    private initializeVirtualizer(): void {
        const virtualizerOptions = {
            count: this.data.length,
            getScrollElement: () => {
                return this.viewport;
            },
            estimateSize: (_: number) => 32,
            enableSmoothScroll: true,
            scrollToFn: elementScroll,
            observeElementOffset,
            observeElementRect,
            onChange: (virtualizer: Virtualizer) => {
                this.visibleItems = virtualizer.getVirtualItems();
            }
        } as VirtualizerOptions;
        this.virtualizer = new Virtualizer(virtualizerOptions);
    }

    private refreshRows(): void {
        this.updateVirtualizer();
        const rows = this.table.getRowModel().rows;
        this.tableData = rows.map(row => {
            const tableRow = { row, parent: this } as TableRowData;
            return tableRow;
        });
    }

    private refreshHeaders(): void {
        const headerGroups = this.table.getHeaderGroups();
        const headers = headerGroups.length > 0 ? headerGroups[0]?.headers : [];
        this.tableHeaders = headers!.map(header => {
            return ({
                title: this.columns.length > 0 ? this.columns[header.index]!.title : '',
                sortingState: header.column.getIsSorted(),
                column: header.column
            }) as TableHeader;
        });
    }

    private readonly update = (state: TableState): void => {
        this.table.setOptions(prev => ({
            ...prev,
            ...this._options,
            state,
            onStateChange: (updater: unknown) => {
                const updatedState = typeof updater === 'function' ? updater(state) as TableState : updater as TableState;
                this.update(updatedState);
            },
        }));
    };
}

const nimbleTable = Table.compose({
    baseName: 'table',
    template,
    styles,
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTable());
