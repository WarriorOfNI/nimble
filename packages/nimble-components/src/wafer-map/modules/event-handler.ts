import type { WaferMap } from '..';
import type { RenderingModule } from './rendering';
import type { Dimensions, WaferMapDie, WaferMapQuadrant, ZoomHandlerData, EventHandlerData } from '../types';
import { HoverHandler } from './hover-handler';
import { ZoomHandler } from './zoom-handler';

/**
 * EventHandler deals with user interactions and events
 */
export class EventHandler {
    private readonly zoomHandler: ZoomHandler;
    // private readonly hoverHandler: HoverHandler;

    public constructor(
        private readonly eventHandlerData:EventHandlerData,
    ) {
        
        this.zoomHandler = new ZoomHandler(eventHandlerData.zoomHandlerData);
        
        this.zoomHandler.onZoom=(event)=>{
            // this.hoverHandler.toggleHoverDie(false);
            this.zoomHandler.reScale();
            // this.hoverHandler.createHoverDie();
        };

        // this.hoverHandler = new HoverHandler(
        //     canvas,
        //     rect,
        //     this.zoomHandler,
        //     dataManager,
        //     quadrant
        // );
        // this.hoverHandler.createHoverDie();

        // this.zoomHandler.hideHoverDieFunction = () => {
        //     // this.hoverHandler.toggleHoverDie(false);
        // };
    }

    public attachEvents(waferMap: WaferMap): void {
        waferMap.onmousemove = (e: MouseEvent) => {
            // this.hoverHandler.mousemove(e);
        };
        waferMap.onmouseout = () => {
            // this.hoverHandler.mouseout();
        };
    }

    public resetZoomTransform(): void {
        this.zoomHandler.resetTransform();
    }

    public get lastSelectedDie(): WaferMapDie | undefined {
        // return this.hoverHandler.lastSelectedDie;
        return {value:'100', x:10, y:10,}
    }
}
