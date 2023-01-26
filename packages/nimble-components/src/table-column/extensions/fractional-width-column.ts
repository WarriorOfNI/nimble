import { attr, nullableNumberConverter } from '@microsoft/fast-element';
import { TableColumn } from '../base';

/**
 * A mixin that allows concrete TableColumn types to be sized in a proportional way.
 */
export abstract class FractionalWidthColumn extends TableColumn {
    @attr({ attribute: 'fractional-width', converter: nullableNumberConverter })
    public fractionalWidth = 1;

    @attr({ attribute: 'disable-resize' })
    public disableResize = false;

    @attr({ attribute: 'min-width' })
    public minWidth = 40;

    public fractionalWidthChanged(): void {
        this.currentFractionalWidth = this.fractionalWidth;
    }

    public disableResizeChanged(): void {
        this.canResize = !this.disableResize;
    }

    public minWidthChanged(): void {
        this.currentMinWidth = this.minWidth;
    }
}