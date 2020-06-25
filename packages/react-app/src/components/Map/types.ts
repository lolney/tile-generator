export interface LayerWithPath extends L.Layer {
  _path: HTMLElement;
}

export interface InvalidatableLayer extends L.Layer {
  invalidated: () => boolean;
}
