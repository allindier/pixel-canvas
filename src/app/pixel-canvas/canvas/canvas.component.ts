import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

type Coordinate = [number, number];

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.html',
  styleUrls: ['./canvas.css']
})
export class CanvasComponent implements AfterViewInit {

  private static DASH_ARRAY = [8,4];

  @ViewChild('canvas') canvas: ElementRef;
  private context: CanvasRenderingContext2D;

  private width = 6;
  private pixelWidth = 400;
  private height = 4;
  private pixelHeight = 400;

  constructor() { }

  ngAfterViewInit() {
    let context = (<HTMLCanvasElement> this.canvas.nativeElement).getContext('2d');
    if (context === null) {
      throw 'Unable to obtain 2D context for canvas.';
    } else {
      this.context = context;
    }

    this.drawPixelOutlines();
  }

  /**
   * Draws the outlines of the pixels on the canvas.  Draws a dashed line, but does reset that back
   * to its old value.
   */
  private drawPixelOutlines() {
    const oldLineDash = this.context.getLineDash();
    this.context.setLineDash(CanvasComponent.DASH_ARRAY);

    // TODO: Don't dupe the code
    // Draw the horizontal lines
    const barWidth = this.pixelWidth / this.width;
    let linePosition = barWidth;
    for (let i = 1; i < this.width; i++) {
      CanvasComponent.drawLine(this.context, [linePosition, 0], [linePosition, this.pixelHeight]);

      linePosition += barWidth;
    }

    // Draw the vertical lines
    const barHeight = this.pixelHeight / this.height;
    linePosition = barHeight;
    for (let i = 1; i < this.height; i++) {
      CanvasComponent.drawLine(this.context, [0, linePosition], [this.pixelWidth, linePosition]);

      linePosition += barHeight;
    }
    this.context.setLineDash(oldLineDash);
  }

  /**
   * Draws a single line from the given start coordinate to the end.
   * @param context Canvas context to draw the line on
   * @param start Start coordinate to use
   * @param end End coordinate to use
   */
  private static drawLine(context: CanvasRenderingContext2D, start: Coordinate, end: Coordinate) {
    context.beginPath();
    context.moveTo(start[0], start[1]);
    context.lineTo(end[0], end[1]);
    context.stroke();
  }

}
