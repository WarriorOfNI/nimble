import {
    attr,
    DOM,
    nullableNumberConverter,
    observable
} from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { template } from './template';
import { styles } from './styles';
import {
    WaferMapColorScale,
    WaferMapColorScaleMode,
    WaferMapDie,
    WaferMapOrientation,
    WaferMapQuadrant
} from './types';
import { DataManager } from './modules/data-manager';
import { RenderingModule } from './modules/rendering';
import { ZoomHandler } from './modules/zoom-handler';

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
        attribute: 'color-scale-mode'
    })

    /**
     * @internal
     */
    public readonly canvas!: HTMLCanvasElement;

    /**
     * @internal
     */
    public readonly zoomContainer!: HTMLElement;

    /**
     * @internal
     */
    public readonly rect!: HTMLCanvasElement;

    @observable public colorScaleMode: WaferMapColorScaleMode = WaferMapColorScaleMode.linear;

    @observable public highlightedValues: string[] = [];
    @observable public dies: WaferMapDie[] = [];
    @observable public colorScale: WaferMapColorScale = {
        colors: [],
        values: []
    };

    private renderQueued = false;
    private dataManager: DataManager | undefined;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.queueRender();
    }

    /**
     * @internal
     */
    public render(): void {
        this.renderQueued = false;
        this.dataManager = new DataManager(
            this.dies,
            this.quadrant,
            { width: 500, height: 500 },
            this.colorScale,
            this.highlightedValues,
            this.colorScaleMode,
            this.dieLabelsHidden,
            this.dieLabelsSuffix,
            this.maxCharacters
        );

        this.rect.setAttribute('width', this.dataManager.dieDimensions.width.toString());
        this.rect.setAttribute('height', this.dataManager.dieDimensions.height.toString());

        // this.rect.height = 22.44897959183673;
        // this.rect.width = 22.44897959183673;

        const renderer = new RenderingModule(this.dataManager, this.canvas);
        const zoomHandler = new ZoomHandler(
            this.canvas,
            this.rect,
            this.zoomContainer,
            this.dataManager,
            this.quadrant,
            renderer
        );

        zoomHandler.createHoverDie();

        this.onmousemove = (e: MouseEvent) => {
            console.log(e.x+ " " + e.clientX);
            zoomHandler.mousemove(e);
            // zoomHandler.toggleHoverDie(true, e.offsetX, e.offsetY);
        };

        zoomHandler.attachZoomBehavior();
        renderer.drawWafer();
    }

    private quadrantChanged(): void {
        this.queueRender();
    }

    private orientationChanged(): void {
        this.queueRender();
    }

    private maxCharactersChanged(): void {
        this.queueRender();
    }

    private dieLabelsHiddenChanged(): void {
        this.queueRender();
    }

    private dieLabelsSuffixChanged(): void {
        this.queueRender();
    }

    private colorScaleModeChanged(): void {
        this.queueRender();
    }

    private highlightedValuesChanged(): void {
        this.queueRender();
    }

    private diesChanged(): void {
        this.queueRender();
    }

    private colorScaleChanged(): void {
        this.queueRender();
    }

    private queueRender(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        if (!this.renderQueued) {
            this.renderQueued = true;
            DOM.queueUpdate(() => this.render());
        }
    }
}

const nimbleWaferMap = WaferMap.compose({
    baseName: 'wafer-map',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleWaferMap());
