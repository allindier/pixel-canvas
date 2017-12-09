import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "pixel-canvas",
  styleUrls: ["./pixel-canvas.css"],
  templateUrl: "./pixel-canvas.html",
})
export class PixelCanvasComponent {
  // Class currently does nothing
}
