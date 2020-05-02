const rad = (degrees: number) => (Math.PI * degrees) / 180;
const deg = (radians: number) => (180 * radians) / Math.PI;

const calcWithRadians = (degrees: number, calc: (x: number) => number) => {
  const radians = rad(degrees);
  return deg(calc(radians));
};

export const mercatorProject = (y: number) =>
  calcWithRadians(
    y,
    (lat: number) => 2 * Math.atan(Math.exp(lat)) - 0.5 * Math.PI
  );

export const inverseMercatorProject = (y: number) => {
  calcWithRadians(y, (lat: number) =>
    Math.log(Math.tan(lat) + 1 / Math.cos(lat))
  );
};
