import { attr } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { ColumnSortDirection } from '../../types';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-header': TableHeader;
    }
}

/**
 * A styled header that is used within the nimble-table.
 * @internal
 */
export class TableHeader extends FoundationElement {
    @attr({ attribute: 'hide-sort-indicator', mode: 'boolean' })
    public hideSortIndicator = false;

    @attr({ attribute: 'sort-direction' })
    public sortDirection: ColumnSortDirection;

    private sortDirectionChanged(_prev: ColumnSortDirection | undefined, _next: ColumnSortDirection): void {
        if (this.sortDirection === ColumnSortDirection.ascending) {
            this.ariaSort = 'ascending';
        } else if (this.sortDirection === ColumnSortDirection.descending) {
            this.ariaSort = 'descending';
        } else {
            this.ariaSort = null;
        }
    }
}

const nimbleTableHeader = TableHeader.compose({
    baseName: 'table-header',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableHeader());
