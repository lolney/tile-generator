declare module "leaflet-area-select" {
  function areaSelect(box: AreaSelectOptions): AreaSelect;

  interface AreaSelectOptions {
    width?: number;
    height?: number;
    keepAspectRatio?: boolean;
  }

  interface Dimension {
    width: number;
    height: number;
  }

  interface AreaSelect {
    addTo(map: Map): Map;
    getBounds(): LatLngBounds;
    remove(): void;
    on(event: string, handler: () => void): void;
    setDimensions(dim: Dimension): void;
  }
}
