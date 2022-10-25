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
    SortingState,
    SortDirection,
    Column,
    Row,
} from '@tanstack/table-core';
import { Virtualizer, VirtualizerOptions, elementScroll, observeElementOffset, observeElementRect, windowScroll, VirtualItem } from '@tanstack/virtual-core';
import { template } from './template';
import { styles } from './styles';
import type { TableCell } from '../table-cell';
import type { TableRowData } from '../table-row';
import { InfiniteQueryObserver, QueryClient, QueryObserverResult } from '@tanstack/query-core';
import { makeData, Person } from './tests/makedata';

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

async function makeDataAsync(count: number): Promise<Person[]> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(makeData(count));
        }, 500);
    });
}

/**
 * Table
 */
export class Table extends FoundationElement {
    public readonly rowContainer!: HTMLElement;
    public readonly viewport!: HTMLElement;
    public readonly tableContainer!: HTMLElement;
    public virtualizer?: Virtualizer;

    @observable
    public viewportReady = false;

    private readonly table: TanstackTable<unknown>;
    private _data: unknown[] = [];
    private _columns: TableColumn[] = [];
    private _rows: TableRowData[] = [];
    private _headers: TableHeader[] = [];
    private _options: TableOptionsResolved<unknown>;
    private _sorting: SortingState = [];
    private _tanstackcolumns: ColumnDef<unknown>[] = [];
    private _visibleItems: VirtualItem<unknown>[] = [];
    private _rowContainerHeight = 0;
    private _ready = false;
    private readonly resizeObserver: ResizeObserver;
    // private readonly viewportMutationObserver: MutationObserver;
    private readonly _infiniteQueryObserver: InfiniteQueryObserver<Person[], unknown, unknown, Person[], string[]>;

    public constructor() {
        super();
        const data = this.data;
        const tanstackColumns = this._tanstackcolumns;
        const sorting = this._sorting;
        this._options = {
            get data(): unknown[] {
                return data ?? [];
            },
            onStateChange: (_: Updater<TableState>) => { },
            getCoreRowModel: getCoreRowModel(),
            getSortedRowModel: getSortedRowModel(),
            onSortingChange: this.setSorting,
            columns: tanstackColumns,
            state: {
                sorting
            },
            renderFallbackValue: null,
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

        const client = new QueryClient();

        this._infiniteQueryObserver = new InfiniteQueryObserver(client, {
            queryKey: ['people'],
            queryFn: async () => makeDataAsync(20),
            getNextPageParam: (_lastPage, _allPages) => 0,
            getPreviousPageParam: (_firstPage, _allPages) => 0,
        });

        // this.viewportMutationObserver = new MutationObserver((mutations: MutationRecord[], _: MutationObserver) => {
        //     const mutatedElements = mutations.map(mutation => mutation.target);
        //     if (mutatedElements.includes(this.viewport)) {
        //         this.viewportReady = true;
        //         // this.resizeObserver.observe(this.rowContainer);
        //     }
        // });
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.viewport?.addEventListener('scroll', e => this.handleScroll(e, this), { passive: true, capture: true });
        this.resizeObserver.observe(this.viewport);
        // this.viewportMutationObserver.observe()

        this._infiniteQueryObserver.subscribe((result: QueryObserverResult) => {
            console.log('observer update');
            console.log(result);
            if (result.isSuccess) {
                this.data = (result.data.pages).flat();
            }
        });
    }

    public get data(): unknown[] {
        Observable.track(this, 'data');
        return this._data;
    }

    public set data(value: unknown[]) {
        this._data = value;
        Observable.notify(this, 'data');
        this._options.data = this.data;
        this.update(this.table.getState());
        this.refreshRows();
        this.updateVirtualizer();
    }

    private updateVirtualizer(): void {
        if (!this.virtualizer) {
            return;
        }

        this.initializeVirtualizer();
        this.virtualizer._willUpdate();
        /*
        this.virtualizer.options.count = this.table.getRowModel().rows.length;

        //this.virtualizer.notify();
        //this.virtualizer.measure();
        this.virtualizer.calculateRange();
        */
        this.visibleItems = this.virtualizer.getVirtualItems();
        this.rowContainerHeight = this.virtualizer.getTotalSize();
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

    public getColumnTemplate(index: number): ViewTemplate {
        const column = this.columns[index]!;
        return column.cellTemplate!;
    }

    private readonly setSorting = (updater: unknown): void => {
        if (updater instanceof Function) {
            this._sorting = updater(this._sorting) as SortingState;
        } else {
            this._sorting = (updater as SortingState);
        }

        this._options.state = { ...this._options.state, sorting: this._sorting };
        this.update({ ...this.table.initialState, sorting: this._sorting });
        this.refreshRows();
        this.refreshHeaders();
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

    private readonly handleScroll = (event: Event, table: Table): void => {
        const element = (event.target as Element);
        if (element.scrollTop + element.clientHeight + 10 >= element.scrollHeight) {
            void this._infiniteQueryObserver.fetchNextPage();
        }
        //this.virtualizer?._willUpdate();
        this.visibleItems = this.virtualizer?.getVirtualItems() ?? [];
    };
}

const nimbleTable = Table.compose({
    baseName: 'table',
    template,
    styles,
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTable());
