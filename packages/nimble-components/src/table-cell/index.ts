import { attr, HTMLView, Observable, observable, ViewTemplate, defaultExecutionContext, html } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { template } from './template';
import { styles } from './styles';
import type { MenuButton } from '../menu-button';

const spanTemplate = html<TableCell>`
    <span>${x => x.cellData}</span>
`;

/**
 * rdfg
 */
export class TableCell extends FoundationElement {
    /**
     * The column index of the cell.
     * This will be applied to the css grid-column-index value
     * applied to the cell
     *
     * @public
     * @remarks
     * HTML Attribute: grid-column
     */
    @attr({ attribute: 'grid-column' })
    public gridColumn?: string;

    public get cellData(): unknown {
        Observable.track(this, 'cellData');
        return this._cellData;
    }

    public set cellData(value: unknown) {
        this._cellData = value;
        Observable.notify(this, 'cellData');
        // this.updateCellView();
    }

    @observable
    public cellItemTemplate?: ViewTemplate;

    @observable
    public hasMenu = false;

    // public customCellView: HTMLView | undefined = undefined;

    private _cellData: unknown = null;
    // private customCellView: HTMLView | undefined = undefined;

    // public constructor() {
    //     super();
    // }

    // public override connectedCallback(): void {
    //     this.updateCellView();
    // }

    // public override disconnectedCallback(): void {
    //     this.disconnectCellView();
    // }

    // private updateCellView(): void {
    //     this.disconnectCellView();

    //     this.customCellView = this.cellItemTemplate!.create(this);
    //     this.customCellView?.bind(this, defaultExecutionContext);
    //     // this.customCellView?.appendTo(this.shadowRoot!);
    //     this.customCellView?.appendTo(this);
    // }

    // private disconnectCellView(): void {
    //     this.customCellView?.remove();
    //     this.customCellView = undefined;
    // }

    public onMenuOpenChange(event: CustomEvent): void {
        if ((event.target as MenuButton).open) {
            this.$emit('action-menu-open');
        }
    }
}

const nimbleTableCell = TableCell.compose({
    baseName: 'table-cell',
    template
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableCell());
