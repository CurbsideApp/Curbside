export const getDistance = (start: number[], end: number[]): number => {
  const xDistance = start[0] - end[0];
  const yDistance = start[1] - end[1];
  const sqx = xDistance * xDistance;
  const sqy = yDistance * yDistance;
  const distSum = sqx + sqy;
  const sqrtDist = Math.sqrt(distSum);
  return sqrtDist;
};

export default {
  getDistance
};
