import { Controller, ActionEvent } from "@hotwired/stimulus";
import { Target, TypedController } from "@vytant/stimulus-decorators";
import { chaosGame, getInitialPoints } from "../utilities/chaos-game";
import { drawCanvas, Circle, Point } from "@mathigon/euclid";

@TypedController
export default class extends Controller {
  @Target canvasTarget!: HTMLCanvasElement;
  @Target pointsTarget!: HTMLInputElement;
  @Target pointsLabelTarget!: HTMLLabelElement;
  @Target fractionTarget!: HTMLInputElement;
  @Target fractionLabelTarget!: HTMLLabelElement;
  @Target stepModeTarget!: HTMLInputElement;
  @Target stepsTarget!: HTMLDivElement;
  @Target stepLabelTarget!: HTMLDivElement;
  private width!: number;
  private height!: number;
  private startPoint!: Point | null;
  private allPoints!: Point[];
  private verticies!: Point[];
  private step = 1;

  connect() {
    this.width = this.canvasTarget.width;
    this.height = this.canvasTarget.height;
    this.draw();
  }

  moveStep(e: ActionEvent) {
    if (!this.startPoint) {
      return;
    }
    const direction = e.params.direction as "next" | "back";
    if (direction === "next") {
      if (this.step < parseInt(this.pointsTarget.value)) {
        this.step++;
      }
    } else if (direction === "back") {
      if (this.step > 1) {
        this.step--;
      }
    }
    this.stepLabelTarget.innerText = `Step ${this.step}`;
    this.draw();
  }

  reset() {
    this.startPoint = null;
    this.step = 1;
    this.draw();
  }

  clear() {
    const ctx = this.canvasTarget.getContext("2d") as CanvasRenderingContext2D;

    // clear the canvas
    ctx.save();
    ctx.fillStyle = "#888";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();

    this.verticies = getInitialPoints(this.width, this.height, 10);
    for (const v of this.verticies) {
      const circle = new Circle(v, 5);
      drawCanvas(ctx, circle, { fill: "#00f" });
    }
  }

  updateLabels() {
    const pointsValue = this.pointsTarget.value;
    this.pointsLabelTarget.innerText = `Number of points (${pointsValue})`;

    const fractionValue = this.fractionTarget.value;
    this.fractionLabelTarget.innerText = `Fraction Distance (${fractionValue})`;

    if (this.stepModeTarget.checked) {
      this.stepsTarget.classList.remove("hidden");
    } else {
      this.stepsTarget.classList.add("hidden");
    }
  }

  play() {
    if (this.startPoint) {
      this.allPoints = chaosGame(
        this.startPoint,
        this.verticies,
        5000,
        parseFloat(this.fractionTarget.value)
      );
      this.draw();
    }
  }

  setStartPoint(e: PointerEvent) {
    this.startPoint = new Point(e.offsetX, e.offsetY);
    this.play();
  }

  draw() {
    this.updateLabels();
    this.clear();

    const ctx = this.canvasTarget.getContext("2d") as CanvasRenderingContext2D;

    if (!this.startPoint) {
      return;
    }

    drawCanvas(ctx, new Circle(this.startPoint, 4), { fill: "#f00" });
    let i = 0;

    let sliceEnd = parseInt(this.pointsTarget.value);
    if (this.stepModeTarget.checked) {
      sliceEnd = this.step;
    }
    for (const p of this.allPoints.slice(1, sliceEnd)) {
      const circle = new Circle(p, 4);
      const style = { fill: "#0f0" };
      if (i < 20) {
        style.fill = "#c90303";
      }
      drawCanvas(ctx, circle, style);
      i++;
    }
  }
}
