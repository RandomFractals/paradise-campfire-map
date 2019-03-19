import { dispatcher } from '../common/dispatcher';
import { mapboxAccessToken, mapboxConfig } from '../common/config'

let map = null;
mapboxgl.accessToken = mapboxAccessToken;

export const initMap = () => {
  // create mapbox map
  map = new mapboxgl.Map(mapboxConfig);

  // add basic nav controls
  const navigationControls = new mapboxgl.NavigationControl({showCompass: false, showZoom: true});
  map.addControl(navigationControls, 'top-left'); // position

  // add map move event handler
  function update() {
    dispatcher.call('mapMove', null);
  }
  map.on('move', debounce(update, 100));
  return map;
}

export const getMap = () => map;

export const setMap = createdMap => {
  if (map) {
    map.remove();
  } 
  map = createdMap;
}

export const resizeMap = () => {
  if (map) {
    map.resize();
  }
}

export const clearMap = () => {
  if (map) {
    map.remove();
  } 
  map = null;
}

export const zoomOut = () => {
  console.log('map:zoomOut: bounds:', mapboxConfig);
  map.fitBounds(mapboxConfig.maxBounds);
}

export const setBounds = bounds => {
  map.fitBounds([bounds._sw, bounds._ne], {linear: true});
}

export const getBounds = () => map.getBounds();

export const updateMap = (vegaImage) => {
  const mapBounds = map.getBounds();
  const imageBounds = [
      [mapBounds.getNorthWest().lng, mapBounds.getNorthWest().lat],
      [mapBounds.getNorthEast().lng, mapBounds.getNorthEast().lat],
      [mapBounds.getSouthEast().lng, mapBounds.getSouthEast().lat],
      [mapBounds.getSouthWest().lng, mapBounds.getSouthWest().lat]
    ];
  const mapOverlayName = 'overlay';
  if (typeof map.getLayer(mapOverlayName) === 'undefined') {
    map.addSource(mapOverlayName, {
      type: 'image',
      url: vegaImage,
      coordinates: imageBounds
    });
    map.addLayer({
      id: mapOverlayName,
      source: mapOverlayName,
      type: 'raster',
      paint: {'raster-opacity': 0.85, 'raster-fade-duration': 0}
    });
  }
  else {    
    const imageSrc = map.getSource(mapOverlayName);
    imageSrc.updateImage({
      url: vegaImage,
      coordinates: imageBounds
    });
  }
};

// debounce for map tiles update: map.on('move', debounce(update, 100)); // see up! :)
function debounce(funct, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = () => {
      timeout = null;
      if (!immediate) {
        funct.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      funct.apply(context, args);
    }
  };
};
