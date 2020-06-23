import L from "leaflet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useDebounce } from "react-use";
import { MapOptions, MapLayerValue, Tile } from "@tile-generator/common";
import {
  createPreviewGrid,
  drawRivers,
  drawGrid,
  drawLayerComponents,
  bindTooltip,
} from "./utils";
import { LineString, Polygon } from "geojson";
import { mapFeatureToStyle } from "../../redux/modules/leaflet/selectors";
import { SubmissionStatus } from "../../redux/types";
import { LayerWithPath } from "./types";

export const useLeafletMap = () => {
  const [map, setMap] = useState<L.Map>();

  useEffect(() => {
    const map = L.map("map").setView([38, -122], 5);

    map.setMaxZoom(12);
    map.setMinZoom(2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // The map will load initially at a smaller size, then fail
    // to update properly for a larger size
    // This doesn't appear to be linked to load/resize events
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    setMap(map);
  }, []);

  return map;
};

export const useLayer = (
  map: L.Map | undefined,
  initialLayer?: L.Layer | undefined
): [(newLayer: L.Layer | undefined) => void, L.Layer | undefined] => {
  const [layer, setLayer] = useState(initialLayer);
  const [previousLayer, setPreviousLayer] = useState<L.Layer>();

  useEffect(() => {
    if (map === undefined) return;
    if (previousLayer) map.removeLayer(previousLayer);
    if (layer !== undefined) {
      layer.addTo(map);
    }
  }, [layer, previousLayer, map]);

  return [
    useCallback(
      (newLayer: L.Layer | undefined) => {
        setLayer(newLayer);
        setPreviousLayer(layer);
      },
      [setLayer, setPreviousLayer, layer]
    ),
    layer,
  ];
};

export const useAreaSelect = (
  map: L.Map | undefined,
  onBoundsChange: (bounds: L.LatLngBounds) => void,
  submissionStatus: SubmissionStatus
) => {
  const [previous, setPrevious] = useState<L.AreaSelect>();
  const [dimensions, setDimensions] = useState({
    width: 300,
    height: 300 * (10 / (10 + 0.5)),
  });

  const areaSelect = useMemo(() => {
    if (!map || submissionStatus !== SubmissionStatus.none) {
      return;
    }
    const areaSelect = L.areaSelect({
      ...dimensions,
      keepAspectRatio: false,
    });
    areaSelect.addTo(map);

    return areaSelect;
  }, [map, submissionStatus]);

  useEffect(() => {
    areaSelect && onBoundsChange(areaSelect.getBounds());
  }, [areaSelect, onBoundsChange]);

  useEffect(() => {
    if (areaSelect) setPrevious(areaSelect);
    if (!areaSelect && previous)
      // @ts-ignore
      setDimensions({ height: previous._height, width: previous._width });
  }, [areaSelect]);

  useEffect(() => {
    if (!areaSelect && previous) {
      previous.remove();
      setPrevious(undefined);
    }
  }, [previous, areaSelect]);

  return areaSelect;
};

export const useRiverLayer = (
  map: L.Map | undefined,
  selectedLayer: MapLayerValue | undefined,
  riverLines: LineString[],
  zoomLevel: number
) => {
  const [setRivers] = useLayer(map);

  const leafletLayer = useMemo(() => {
    if (selectedLayer === "rivers") return drawRivers(riverLines, zoomLevel);
    else return undefined;
  }, [selectedLayer, riverLines, zoomLevel]);

  useEffect(() => {
    setTimeout(() => setRivers(leafletLayer), 0);
  }, [leafletLayer, setRivers]);
};

export const useTileLayer = (
  map: L.Map | undefined,
  grid: Polygon[],
  layer: Tile[]
) => {
  const [setLayer] = useLayer(map);
  const leafletLayer = useMemo(
    () =>
      map &&
      drawLayerComponents(grid, layer, mapFeatureToStyle).eachLayer(
        bindTooltip(map)
      ),
    [grid, layer, map]
  );

  useEffect(() => {
    if (leafletLayer) setLayer(leafletLayer);
  }, [setLayer, leafletLayer]);
};

const useMapMove = (map: L.Map | undefined) => {
  const [isMoving, setDragging] = useState(false);

  useEffect(() => {
    if (!map) return;

    const dragEnd = () => {
      setDragging(false);
    };
    const dragStart = () => {
      setDragging(true);
    };

    map.on("zoomstart", dragStart);
    map.on("zoomend", dragEnd);
    map.on("dragstart", dragStart);
    map.on("dragend", dragEnd);

    return () => {
      map.removeEventListener("dragstart", dragStart);
      map.removeEventListener("dragend", dragEnd);
      map.removeEventListener("zoomstart", dragStart);
      map.removeEventListener("zoomend", dragEnd);
    };
  }, [map]);

  return isMoving;
};

export const usePreviewLayer = (
  map: L.Map | undefined,
  areaSelect: L.AreaSelect | undefined,
  onBoundsChange: (bounds: L.LatLngBounds) => void,
  settings: MapOptions
) => {
  const isMoving = useMapMove(map);

  const grid = useMemo(() => {
    if (!map || !areaSelect) return;
    return drawGrid(
      // todo: change on bounds changing as well
      // todo: if bounds have changed but not dimensions, just transform the previous layer
      // https://github.com/w8r/Leaflet.Path.Transform
      createPreviewGrid(areaSelect.getBounds(), settings.dimensions),
      () => ({
        opacity: 0.2,
        color: "black",
      })
    );
  }, [map, areaSelect, settings]);

  const [setPreview, layer] = useLayer(map, grid);

  useEffect(() => {
    const path = (layer as LayerWithPath)?._path;

    if (path && isMoving) path.style.display = "none";
    if (path && !isMoving) path.style.display = "auto";
  }, [isMoving, layer]);

  useEffect(() => {
    if (!areaSelect) return;

    const handler = () => {
      onBoundsChange(areaSelect.getBounds());
      setPreview(grid);
    };
    // @ts-ignore
    areaSelect.on("change", handler);
    // @ts-ignore
    return () => areaSelect.off("change", handler);
  }, [areaSelect, setPreview, onBoundsChange, grid]);

  useDebounce(
    () => {
      setPreview(grid);
    },
    200,
    [grid, settings, setPreview]
  );
};

export const useZoom = (map: L.Map | undefined) => {
  const [zoom, setZoom] = useState(5);

  useEffect(() => {
    const handler = () => {
      setZoom(map?.getZoom() || 5);
    };
    map?.addEventListener("zoom", handler);

    return () => {
      map?.removeEventListener("zoom", handler);
    };
  }, [map]);

  return zoom;
};
