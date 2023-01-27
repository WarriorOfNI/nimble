import { range } from 'd3-array';
import { ScaleBand, scaleBand, ScaleLinear, scaleLinear } from 'd3-scale';
import type { WaferMapDie } from '../types';
import { Dimensions, Margin, WaferMapQuadrant } from '../types';

interface GridDimensions {
    origin: {
        x: number,
        y: number
    };
    rows: number;
    cols: number;
}

/**
 * Computations calculates and stores different measures which are used in the Wafermap
 */
export class Computations {
    public containerDimensions!: Dimensions;
    public dieDimensions!: Dimensions;
    public radius: number;
    public margin: Margin;

    public horizontalScale!: ScaleBand<number>;
    public verticalScale!: ScaleBand<number>;

    private readonly baseMargin: Margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    } as const;

    private readonly dieSizeFactor = 1.5;
    private readonly defaultAlign = 0.5;

    public constructor(
        dies: Readonly<Readonly<WaferMapDie>[]>,
        axisLocation: Readonly<WaferMapQuadrant>,
        canvasDimensions: Readonly<Dimensions>
    ) {
        // debugger;
        const gridDimensions = this.calculateGridDimensions(dies);

        const canvasDiameter = Math.min(canvasDimensions.width, canvasDimensions.height);

        const canvasMargin = {
            top: (canvasDimensions.height - canvasDiameter) / 2,
            right: (canvasDimensions.width - canvasDiameter) / 2,
            bottom: (canvasDimensions.height - canvasDiameter) / 2,
            left: (canvasDimensions.width - canvasDiameter) / 2
        };
        this.radius = 0;
        this.margin = this.calculateMarginAddition(this.baseMargin, canvasMargin);

        this.computeDisplayDimensions(axisLocation, gridDimensions, canvasDimensions);

        while (this.radius > canvasDiameter / 2) {
            this.margin = this.calculateMarginAddition(this.margin, {
                top: this.radius - canvasDiameter / 2,
                right: this.radius - canvasDiameter / 2,
                bottom: this.radius - canvasDiameter / 2,
                left: this.radius - canvasDiameter / 2
            });
            this.computeDisplayDimensions(axisLocation, gridDimensions, canvasDimensions);
        }
    }

    private computeDisplayDimensions(
        axisLocation: Readonly<WaferMapQuadrant>,
        gridDimensions: GridDimensions,
        canvasDimensions: Readonly<Dimensions>
    ): void {
        this.containerDimensions = this.calculateContainerDimensions(
            canvasDimensions,
            this.margin
        );
        const containerDiameter = Math.min(this.containerDimensions.width, this.containerDimensions.height);

        // this scale is used for positioning the dies on the canvas
        this.horizontalScale = this.createHorizontalScale(
            axisLocation,
            gridDimensions,
            containerDiameter
        );

        // this scale is used for positioning the dies on the canvas
        this.verticalScale = this.createVerticalScale(
            axisLocation,
            gridDimensions,
            containerDiameter
        );
        this.dieDimensions = {
            width: this.horizontalScale.bandwidth(),
            height: this.verticalScale.bandwidth()
        };
        const dieDiameter = Math.min(this.dieDimensions.width, this.dieDimensions.height);
        this.radius = containerDiameter / 2 + dieDiameter * this.dieSizeFactor;
    }

    private calculateGridDimensions(
        dies: Readonly<Readonly<WaferMapDie>[]>
    ): GridDimensions {
        if (dies.length === 0 || dies[0] === undefined) {
            return { origin: { x: 0, y: 0 }, rows: 0, cols: 0 };
        }

        const minPoint = { x: dies[0].x, y: dies[0].y };
        const maxPoint = { x: dies[0].x, y: dies[0].y };

        for (const die of dies) {
            if (die.x < minPoint.x) {
                minPoint.x = die.x;
            }
            if (die.y < minPoint.y) {
                minPoint.y = die.y;
            }
            if (die.x > maxPoint.x) {
                maxPoint.x = die.x;
            }
            if (die.y > maxPoint.y) {
                maxPoint.y = die.y;
            }
        }

        return {
            origin: minPoint,
            rows: maxPoint.y - minPoint.y + 1,
            cols: maxPoint.x - minPoint.x + 1
        };
    }

    private calculateContainerDimensions(
        canvasDimensions: Dimensions,
        margin: Margin
    ): Dimensions {
        return {
            width: canvasDimensions.width - margin.left - margin.right,
            height: canvasDimensions.height - margin.top - margin.bottom
        };
    }

    private createHorizontalScale(
        axisLocation: WaferMapQuadrant,
        grid: GridDimensions,
        containerWidth: number
    ): ScaleBand<number> {
        const scale = scaleBand<number>()
            .domain(range(grid.origin.x, grid.origin.x + grid.cols))
            .range([0, containerWidth])
            .paddingInner(0.2)
            .paddingOuter(0)
            .align(0)
            .round(false);
        if (
            axisLocation === WaferMapQuadrant.bottomLeft
            || axisLocation === WaferMapQuadrant.topLeft
        ) {
            return scale.range([0, containerWidth]);
        }
        return scale.range([containerWidth, 0]);
    }

    private createVerticalScale(
        axisLocation: WaferMapQuadrant,
        grid: GridDimensions,
        containerHeight: number
    ): ScaleBand<number> {
        const scale = scaleBand<number>()
            .domain(range(grid.origin.y, grid.origin.y + grid.rows))
            .range([containerHeight, 0])
            .paddingInner(0.2)
            .paddingOuter(0)
            .align(0)
            .round(false);
        if (
            axisLocation === WaferMapQuadrant.bottomLeft
            || axisLocation === WaferMapQuadrant.bottomRight
        ) {
            return scale.range([containerHeight, 0]);
        }
        return scale.range([0, containerHeight]);
    }

    private calculateMarginAddition(baseMargin: Margin, addedMargin: Margin): Margin {
        return {
            top: baseMargin.top + addedMargin.top,
            right: baseMargin.right + addedMargin.right,
            bottom: baseMargin.bottom + addedMargin.bottom,
            left: baseMargin.left + addedMargin.left
        };
    }
}
