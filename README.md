# PointMapper
A canvas app for mapping and exporting clicked points.

## Point effects
Effects are listed in the `effects` array in `script.js`. Each effect provides:

- `createState()` to create independent state for each point.
- `update({ point, state, pointer, deltaTime })` to update that state once per
  frame. `pointer` uses canvas coordinates or is `null`, and `deltaTime` is in
  milliseconds. Return `true` while the effect needs another animation frame.
- `draw({ point, state, context })` to draw the effect for that point.

Effects are updated and drawn in array order, so multiple effects can be
stacked. Keep effect state separate from point coordinates so saving points
continues to export only their positions. The initial cursor-radius effect
colors points bright red within 50 canvas pixels of the pointer, then fades
them back to grey over two seconds after they leave the radius.
