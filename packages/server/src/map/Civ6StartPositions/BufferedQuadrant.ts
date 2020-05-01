import { Quadrant } from "./types";

export interface BufferSides {
  left: number;
  right: number;
  bottom: number;
  top: number;
}

export default class BufferedQuadrant {
  buffer: number;
  buffers: BufferSides;
  quadrant: Quadrant;

  constructor(
    quadrant: Quadrant,
    buffer: number,
    sides = ["left", "right", "bottom", "top"] as Array<keyof BufferSides>
  ) {
    this.buffer = buffer;
    this.buffers = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };
    this.quadrant = { ...quadrant };

    for (const side of sides) this.add(side);
  }

  remove = (side: keyof BufferSides) => {
    switch (side) {
      case "top":
        this.quadrant.start.i -= this.buffers.top;
        break;
      case "left":
        this.quadrant.start.j -= this.buffers.left;
        break;
      case "bottom":
        this.quadrant.end.i += this.buffers.bottom;
        break;
      case "right":
        this.quadrant.end.j += this.buffers.right;
        break;
    }

    this.buffers[side] = 0;
  };

  add = (side: keyof BufferSides) => {
    switch (side) {
      case "top":
        this.quadrant.start.i += this.buffer;
        break;
      case "left":
        this.quadrant.start.j += this.buffer;
        break;
      case "bottom":
        this.quadrant.end.i -= this.buffer;
        break;
      case "right":
        this.quadrant.end.j -= this.buffer;
        break;
    }

    this.buffers[side] = this.buffer;
  };
}
