import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgRedux } from '@angular-redux/store/lib/src/components/ng-redux';
import { IAppState } from '../../store';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { IPixelCanvas } from '../pixel-canvas.store';
import { Subscription } from 'rxjs/Subscription';

type Coordinate = [number, number];

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.html',
  styleUrls: ['./canvas.css']
})
export class CanvasComponent implements AfterViewInit, OnDestroy {

  private static readonly DASH_ARRAY = [8,4];

  @ViewChild('canvas') canvas: ElementRef;
  private context: CanvasRenderingContext2D;

  private canvasData: IPixelCanvas;
  private subscription: Subscription;

  private pixelWidth: number;
  private pixelHeight: number;

  readonly canvasWidth = 400;
  readonly canvasHeight = 400;

  constructor(private readonly ngRedux: NgRedux<IAppState>) { }

  ngAfterViewInit() {
    const canvasElement = <HTMLCanvasElement> this.canvas.nativeElement;
    let context = canvasElement.getContext('2d');
    if (context === null) {
      throw 'Unable to obtain 2D context for canvas.';
    } else {
      this.context = context;
    }

    canvasElement.addEventListener('click', (event: MouseEvent) => {
      const xCoord = event.clientX - canvasElement.offsetLeft;
      const yCoord = event.clientY - canvasElement.offsetTop;

      const xValue = Math.floor(xCoord * this.canvasData.width / this.canvasWidth);
      const yValue = Math.floor(yCoord * this.canvasData.height / this.canvasHeight);

      this.context.fillStyle = this.canvasData.color;
      this.context.fillRect(xValue * this.pixelWidth, yValue * this.pixelHeight,
        this.pixelWidth, this.pixelHeight);
    });

    this.subscription = this.ngRedux.select<IPixelCanvas>('canvas').subscribe((canvas: IPixelCanvas) => {
      this.canvasData = canvas;
      this.pixelHeight = this.canvasHeight / canvas.height;
      this.pixelWidth = this.canvasWidth / canvas.width;

      this.clearCanvas();
      this.drawPixelOutlines();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Clears the contents of the canvas.  Does not account for transforms to the canvas.
   */
  private clearCanvas() {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
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
    const barWidth = this.canvasWidth / this.canvasData.width;
    let linePosition = barWidth;
    for (let i = 1; i < this.canvasData.width; i++) {
      CanvasComponent.drawLine(this.context, [linePosition, 0], [linePosition, this.canvasHeight]);

      linePosition += barWidth;
    }

    // Draw the vertical lines
    const barHeight = this.canvasHeight / this.canvasData.height;
    linePosition = barHeight;
    for (let i = 1; i < this.canvasData.height; i++) {
      CanvasComponent.drawLine(this.context, [0, linePosition], [this.canvasWidth, linePosition]);

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
