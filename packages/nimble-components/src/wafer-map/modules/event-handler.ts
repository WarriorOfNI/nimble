import type { WaferMap } from '..';
import type { Dimensions, WaferMapDie, WaferMapQuadrant } from '../types';
import type { DataManager } from './data-manager';
import { HoverHandler } from './hover-handler';
import type { RenderingModule } from './rendering';
import { ZoomHandler } from './zoom-handler';

/**
 * EventHandler deals with user interactions and events
 */
export class EventHandler {
    private readonly zoomHandler: ZoomHandler;
    private readonly hoverHandler: HoverHandler;

    public constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly zoomContainer: HTMLElement,
        private readonly containerDimensions: Dimensions,
        private readonly dataManager: DataManager,
        private readonly canvasDimensions: Readonly<Dimensions>,
        private readonly renderer: RenderingModule,
        private readonly rect: HTMLElement,
        private readonly quadrant: WaferMapQuadrant
    ) {
        this.zoomHandler = new ZoomHandler(
            canvas,
            zoomContainer,
            containerDimensions,
            canvasDimensions
        );

        this.hoverHandler = new HoverHandler(
            canvas,
            rect,
            this.zoomHandler,
            dataManager,
            quadrant
        );
        this.hoverHandler.createHoverDie(rect);

        this.zoomHandler.renderingFunction = (transform: number) => {
            renderer.drawWafer(transform);
            this.hoverHandler.createHoverDie(rect);
        };

        this.zoomHandler.hideHoverDieFunction = () => {
            this.hoverHandler.toggleHoverDie(rect, false);
        };
    }

    public attachEvents(waferMap: WaferMap): void {
        waferMap.onmousemove = (e: MouseEvent) => {
            this.hoverHandler.mousemove(e);
        };
        waferMap.onmouseout = (e: MouseEvent) => {
            this.hoverHandler.mouseout(e);
        };
        this.zoomHandler.attachZoomBehavior();
    }

    public resetZoomTransform(): void {
        this.zoomHandler.resetTransform();
    }

    public get lastSelectedDie(): WaferMapDie | undefined {
        return this.hoverHandler.lastSelectedDie;
    }
}
