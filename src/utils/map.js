export const distanceFrom = function (latlng, myLatLng) {
  var lat = [myLatLng.lat, latlng.lat];
  var lng = [myLatLng.lng, latlng.lng];
  var r = 6378137;
  var dLat = ((lat[1] - lat[0]) * Math.PI) / 180;
  var dLng = ((lng[1] - lng[0]) * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat[0] * Math.PI) / 180) *
      Math.cos((lat[1] * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = r * c;
  return Math.round(d / 1000);
};
