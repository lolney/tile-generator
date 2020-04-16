import L from "leaflet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useDebounce } from "react-use";
import { MapOptions, MapLayerValue, Tile } from "../../../common/types";
import { createPreviewGrid, drawLayer, drawRivers } from "./utils";
import { LineString, Polygon } from "geojson";
import { mapFeatureToStyle } from "../../redux/modules/leaflet/selectors";
import { SubmissionStatus } from "../../redux/types";

export const useLeafletMap = () => {
  const [map, setMap] = useState<L.Map>();

  useEffect(() => {
    const map = L.map("map").setView([38, -122], 4);

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
) => {
  const [layer, setLayer] = useState(initialLayer);
  const [previousLayer, setPreviousLayer] = useState<L.Layer>();

  // todo: update layer instead of adding + removing
  useEffect(() => {
    if (map === undefined) return;
    if (previousLayer) map.removeLayer(previousLayer);
    if (layer !== undefined) {
      layer.addTo(map);
    }
  }, [layer, previousLayer, map]);

  return useCallback(
    (newLayer: L.Layer | undefined) => {
      setLayer(newLayer);
      setPreviousLayer(layer);
    },
    [setLayer, setPreviousLayer, layer]
  );
};

export const useAreaSelect = (
  map: L.Map | undefined,
  onBoundsChange: (bounds: L.LatLngBounds) => void,
  submissionStatus: SubmissionStatus
) => {
  const [previous, setPrevious] = useState<L.AreaSelect>();

  const areaSelect = useMemo(() => {
    if (!map || submissionStatus !== SubmissionStatus.none) return;
    const areaSelect = L.areaSelect({
      width: 300,
      height: 300 * (10 / (10 + 0.5)),
      keepAspectRatio: true,
    });
    areaSelect.addTo(map);

    onBoundsChange(areaSelect.getBounds());

    return areaSelect;
  }, [map, onBoundsChange, submissionStatus]);

  useEffect(() => {
    if (areaSelect) setPrevious(areaSelect);
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
  riverLines: LineString[]
) => {
  const setRivers = useLayer(map);
  // TODO: when using useMemo, rivers don't show
  const leafletLayer = (() => {
    if (selectedLayer === "rivers") return drawRivers(riverLines);
    else return undefined;
  })();

  useEffect(() => {
    setRivers(leafletLayer);
  }, [leafletLayer, setRivers]);
};

export const useTileLayer = (
  map: L.Map | undefined,
  grid: Polygon[],
  layer: Tile[]
) => {
  const setLayer = useLayer(map);
  const leafletLayer = useMemo(
    () => drawLayer(grid, layer, mapFeatureToStyle),
    [grid, layer]
  );

  useEffect(() => {
    setLayer(leafletLayer);
  }, [setLayer, leafletLayer]);
};

export const usePreviewLayer = (
  map: L.Map | undefined,
  areaSelect: L.AreaSelect | undefined,
  onBoundsChange: (bounds: L.LatLngBounds) => void,
  settings: MapOptions
) => {
  const grid = useMemo(() => {
    if (!map || !areaSelect) return;
    return drawLayer(
      // todo: change on bounds changing as well
      // todo: if bounds have changed but not dimensions, just transform the previous layer
      // https://github.com/w8r/Leaflet.Path.Transform
      createPreviewGrid(areaSelect.getBounds(), settings.dimensions),
      [],
      () => ({
        opacity: 0.2,
        color: "black",
      })
    );
  }, [map, areaSelect, settings]);

  const setPreview = useLayer(map, grid);

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
    [grid, settings] //todo: setpreview
  );
};
