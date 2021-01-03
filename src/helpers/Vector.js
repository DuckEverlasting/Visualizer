export class Vector {
  constructor(a, b) {
    if (a instanceof Vector) {
      this.x = a.x;
      this.y = a.y;
    } else if (typeof a === "string") {
      const [x, y] = a.split("_");
      this.x = parseInt(x);
      this.y = parseInt(y);
    } else {
      this.x = Math.round(a);
      this.y = Math.round(b);
    }
  }

  add(a, b) {
    if (a instanceof Vector) {
      this.x += a.x;
      this.y += a.y;
    } else {
      this.x += a;
      this.y += b;
    }
    return this;
  }

  sub(a, b) {
    if (a instanceof Vector) {
      this.x -= a.x;
      this.y -= a.y;
    } else {
      this.x -= a;
      this.y -= b;
    }
    return this;
  }

  equals(v) {
    if (v === null) {return false;}
    return this.x === v.x && this.y === v.y
  }

  distanceFrom(v) {
    return Math.max(Math.abs(this.x - v.x), Math.abs(this.y - v.y));
  }

  toString() {
    return `${this.x}_${this.y}`;
  }
}

export function vect(a, b) {
  return new Vector(a, b);
}
