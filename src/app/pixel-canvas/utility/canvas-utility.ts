
type Coordinate = [number, number];

export class CanvasUtility {

  /**
   * Dash array for drawing the pixels outlines
   */
  private static readonly DASH_ARRAY = [8, 4];

  private context: CanvasRenderingContext2D;
  private xOffset = 0;
  private yOffset = 0;
  private zoomValue = 10;

  constructor(private canvas: HTMLCanvasElement, private readonly width: number,
              private readonly height: number) {
    const context = canvas.getContext("2d");
    if (context === null) {
      throw new Error("Unable to obtain 2D context for canvas.");
    } else {
      this.context = context;
    }
  }

  /**
   * Calculates the offset due to zoom to be used for future calculations
   * @param pointer Coordinate for the current location of the mouse within the canvas
   * @param newZoom New zoom level for the canvas
   */
  public calculateOffset(pointer: Coordinate, newZoom: number) {
    const newWidth = this.width / newZoom;
    const newHeight = this.height / newZoom;
    const oldZoom = this.zoom;

    // Need to establish these values so that zoom doesn't jump around
    const xGap = this.width - newWidth;
    let leftSide = this.xOffset;
    if (leftSide < 0) {
      leftSide = 0;
    } else if (leftSide > xGap) {
      leftSide = xGap;
    }

    let rightSide = this.xOffset + this.width / oldZoom - newWidth;
    if (rightSide > xGap) {
      rightSide = xGap;
    } else if (rightSide < 0) {
      rightSide = 0;
    }

    const yGap = this.height - newHeight;
    let topSide = this.yOffset;
    if (topSide < 0) {
      topSide = 0;
    } else if (topSide > yGap) {
      topSide = yGap;
    }

    let bottomSide = this.yOffset + this.height / oldZoom - newHeight;
    if (bottomSide > yGap) {
      bottomSide = yGap;
    } else if (bottomSide < 0) {
      bottomSide = 0;
    }

    const innerXBoundary = [leftSide, rightSide];
    const innerYBoundary = [topSide, bottomSide];

    let newXOffset = pointer[0] - newWidth / 2;
    if (newXOffset < innerXBoundary[0]) {
      newXOffset = innerXBoundary[0];
    } else if (newXOffset > innerXBoundary[1]) {
      newXOffset = innerXBoundary[1];
    }
    this.xOffset = newXOffset;

    let newYOffset = pointer[1] - newHeight / 2;
    if (newYOffset < innerYBoundary[0]) {
      newYOffset = innerYBoundary[0];
    } else if (newYOffset > innerYBoundary[1]) {
      newYOffset = innerYBoundary[1];
    }

    this.yOffset = newYOffset;
  }

  /**
   * Clears the contents of the canvas.  Does not account for transforms to the canvas.
   */
  public clearCanvas() {
    this.context.clearRect(0, 0, this.width / this.zoom, this.height / this.zoom);
  }

  /**
   * Draws the outlines of the pixels on the canvas.  Draws a dashed line, but does reset that back
   * to its old value.
   * @param pixelWidth Width of each "pixel" on the canvas
   * @param pixelHeight Height of each "pixel" on the canvas
   */
  public drawPixelOutlines(pixelWidth: number, pixelHeight: number) {
    const oldLineDash = this.context.getLineDash();
    this.context.setLineDash(CanvasUtility.DASH_ARRAY);
    this.context.lineWidth = 1 / this.zoom;

    // TODO: Don't dupe the code
    // Draw the horizontal lines
    const barWidth = this.width / pixelWidth;
    let linePosition = barWidth - this.xOffset;
    for (let i = 1; i < pixelWidth; i++) {
      this.drawLine(this.context, [linePosition, -this.yOffset], [linePosition, this.height - this.yOffset]);

      linePosition += barWidth;
    }

    // Draw the vertical lines
    const barHeight = this.height / pixelHeight;
    linePosition = barHeight - this.yOffset;
    for (let i = 1; i < pixelHeight; i++) {
      this.drawLine(this.context, [-this.xOffset, linePosition], [this.width - this.xOffset, linePosition]);

      linePosition += barHeight;
    }
    this.context.setLineDash(oldLineDash);
  }

  /**
   * Draws the pixels from the canvas data into the context
   * @param pixels Pixels to draw on the canvas
   * @param pixelWidth Width of each "pixel" on the canvas
   * @param pixelHeight Height of each "pixel" on the canvas
   */
  public drawPixels(pixels: string[][], pixelWidth: number, pixelHeight: number) {
    const drawWidth = this.width / pixelWidth;
    const drawHeight = this.height / pixelHeight;
    pixels.forEach((column, xIndex) => {
      column.forEach((pixel, yIndex) => {
        this.context.fillStyle = pixel;
        this.context.fillRect(xIndex * drawWidth - this.xOffset, yIndex * drawHeight - this.yOffset,
          drawWidth, drawHeight);
      });
    });
  }

  /**
   * Dispatches a canvas click event.  Does a little quick math to determine where on the canvas the click
   * happened.
   *
   * @param event Mouse event from the HTML
   */
  public getEventPosition(event: MouseEvent): Coordinate {
    const boundingRect = this.canvas.getBoundingClientRect();

    const xValue = (event.clientX - boundingRect.left) / this.zoom + this.xOffset;
    const yValue = (event.clientY - boundingRect.top) / this.zoom + this.yOffset;

    return [xValue, yValue];
  }

  /**
   * Draws a single line from the given start coordinate to the end.
   * @param context Canvas context to draw the line on
   * @param start Start coordinate to use
   * @param end End coordinate to use
   */
  private drawLine(context: CanvasRenderingContext2D, start: Coordinate, end: Coordinate) {
    context.beginPath();
    context.moveTo(start[0], start[1]);
    context.lineTo(end[0], end[1]);
    context.stroke();
  }

  get zoom() {
    return this.zoomValue / 10;
  }

  set zoom(zoomValue: number) {
    this.zoomValue = zoomValue;
    this.context.setTransform(zoomValue / 10, 0, 0, zoomValue / 10, 0, 0);
  }
}
