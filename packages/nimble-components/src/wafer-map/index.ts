import {
    attr,
    nullableNumberConverter,
    observable
} from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { template } from './template';
import { styles } from './styles';
import {
    WaferMapColorsScale,
    WaferMapColorsScaleMode,
    WaferMapDie,
    WaferMapOrientation,
    WaferMapQuadrant
} from './types';
import { DataManager } from './modules/data-manager';
import { RenderingModule } from './modules/rendering';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-wafer-map': WaferMap;
    }
}

/**
 * A nimble-styled WaferMap
 */
export class WaferMap extends FoundationElement {
    @attr
    public quadrant: WaferMapQuadrant = WaferMapQuadrant.topLeft;

    @attr
    public orientation: WaferMapOrientation = WaferMapOrientation.top;

    @attr({
        attribute: 'max-characters',
        converter: nullableNumberConverter
    })
    public maxCharacters = 4;

    @attr({
        attribute: 'die-labels-hidden',
        mode: 'boolean'
    })
    public dieLabelsHidden = false;

    @attr({
        attribute: 'die-labels-suffix'
    })
    public dieLabelsSuffix = '';

    @attr({
        attribute: 'colors-scale-mode'
    })
    public readonly canvas!: HTMLCanvasElement;

    public readonly zoomContainer!: HTMLElement;

    public colorsScaleMode: WaferMapColorsScaleMode = WaferMapColorsScaleMode.linear;

    @observable public highlightedValues: number[] = [];
    @observable public dies: WaferMapDie[] = [];
    @observable public colorScale: WaferMapColorsScale = {
        colors: [],
        values: []
    };

    private readonly dataManager: DataManager | undefined;

    private dataManager: DataManager | undefined;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.dataManager = new DataManager(
            this.dies,
            this.quadrant,
            { width: 245, height: 245 },
            this.colorScale,
            this.highlightedValues,
            this.colorsScaleMode,
            this.dieLabelsHidden,
            this.dieLabelsSuffix,
            this.maxCharacters
        );
        // RenderingModule.createTransform(this.dataManager, this.zoomContainer);
        RenderingModule.clearCanvas(this.canvas);
        RenderingModule.drawWafer(this.dataManager, this.canvas);
    }
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
