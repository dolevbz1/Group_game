export function removeFilledLayers(anim: any): any {
  const isFilledOnly = (layer: any): boolean => {
    const types: string[] = (layer.shapes ?? []).flatMap((s: any) =>
      (s.it ?? []).map((i: any) => i.ty)
    );
    return types.length > 0 && types.every((t) => t !== 'st');
  };

  const filterAssets = (assets: any[]): any[] =>
    assets.map((asset) =>
      asset.id === 'comp_0' && asset.layers
        ? { ...asset, layers: asset.layers.filter((l: any) => !isFilledOnly(l)) }
        : asset
    );

  return { ...anim, assets: filterAssets(anim.assets ?? []) };
}

export function overrideStrokeWidth(anim: any, width: number): any {
  const processItems = (items: any[]): any[] =>
    items.map((item) => {
      if (item.ty === 'st') return { ...item, w: { ...item.w, k: width } };
      if (item.it) return { ...item, it: processItems(item.it) };
      return item;
    });

  const processLayers = (layers: any[]): any[] =>
    layers.map((layer) =>
      layer.shapes ? { ...layer, shapes: processItems(layer.shapes) } : layer
    );

  const processAssets = (assets: any[]): any[] =>
    assets.map((asset) =>
      asset.layers ? { ...asset, layers: processLayers(asset.layers) } : asset
    );

  return {
    ...anim,
    assets: processAssets(anim.assets ?? []),
    layers: processLayers(anim.layers ?? []),
  };
}

export function overridePrimaryColor(anim: any, color: number[]) {
  const rgba = color.length === 4 ? color : [...color, 1];

  const patchItems = (items: any[]): any[] =>
    items.map((item) => {
      if (item.ty === 'st' || item.ty === 'fl') {
        const { x: _x, ...cRest } = item.c ?? {};
        return { ...item, c: { ...cRest, k: rgba } };
      }
      if (item.it) return { ...item, it: patchItems(item.it) };
      return item;
    });

  const patchLayers = (layers: any[]): any[] =>
    layers.map((layer) => {
      if (layer.nm === 'control') {
        return {
          ...layer,
          ef: layer.ef.map((ef: any) => ({
            ...ef,
            ef: ef.ef.map((p: any) =>
              p.mn === 'ADBE Color Control-0001'
                ? { ...p, v: { ...p.v, k: color } }
                : p
            ),
          })),
        };
      }
      if (layer.shapes) return { ...layer, shapes: patchItems(layer.shapes) };
      return layer;
    });

  const patchAssets = (assets: any[]): any[] =>
    assets.map((asset) =>
      asset.layers ? { ...asset, layers: patchLayers(asset.layers) } : asset
    );

  return {
    ...anim,
    assets: patchAssets(anim.assets ?? []),
    layers: patchLayers(anim.layers ?? []),
  };
}

export const BLACK: number[] = [0, 0, 0, 1];
export const WHITE: number[] = [1, 1, 1, 1];
export const GREEN: number[] = [52 / 255, 199 / 255, 89 / 255, 1];
