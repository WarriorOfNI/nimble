import {
    attr,
    defaultExecutionContext,
    ElementStyles,
    HTMLView,
    observable,
    ViewTemplate
} from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import type { MenuButton } from '../../../menu-button';
import type { MenuButtonBeforeToggleEventDetail } from '../../../menu-button/types';
import type { TableCellState, TableRecord } from '../../types';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-cell': TableCell;
    }
}

/**
 * A styled cell that is used within the nimble-table-row.
 * @internal
 */
export class TableCell<
    TCellRecord extends TableRecord = TableRecord
> extends FoundationElement {
    @attr({ attribute: 'action-menu', mode: 'boolean' })
    public showActionMenu = false;

    @observable
    public data?: TableCellState<TCellRecord>;

    @observable
    public cellTemplate?: ViewTemplate;

    @observable
    public cellStyles?: ElementStyles;

    public menuIsOpen = false;

    /**
     * @internal
     */
    public readonly cellContentContainer!: HTMLElement;

    private customCellView?: HTMLView = undefined;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.customCellView = this.cellTemplate?.render(
            this.data,
            this.cellContentContainer
        );
    }

    public onMenuOpening(event: CustomEvent): void {
        const detail = event.detail as MenuButtonBeforeToggleEventDetail;

        if (detail.newState) {
            this.$emit('cell-action-menu-opening');
        }
    }

    public onMenuOpenChange(event: Event): void {
        const menu = event.target as MenuButton;
        this.menuIsOpen = menu.open;
        this.$emit('cell-action-menu-open-change', this);
    }

    protected dataChanged(): void {
        this.customCellView?.bind(this.data, defaultExecutionContext);
    }

    protected cellTemplateChanged(): void {
        if (this.isConnected) {
            this.customCellView = this.cellTemplate?.render(
                this.data,
                this.cellContentContainer
            );
        }
    }

    protected cellStylesChanged(
        prev?: ElementStyles,
        next?: ElementStyles
    ): void {
        if (prev) {
            this.$fastController.removeStyles(prev);
        }

        if (next) {
            this.$fastController.addStyles(next);
        }
    }
}

const nimbleTableCell = TableCell.compose({
    baseName: 'table-cell',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableCell());
