export function conv4326To900913(coord) {
  var transCoord = [0.0, 0.0];
  transCoord[0] = coord[0] * 111319.49077777777778;
  transCoord[1] = Math.log(Math.tan((90.0 + coord[1]) * 0.00872664625997)) * 6378136.99911215736947;
  return transCoord;
};
