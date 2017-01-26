# superbugs-maps

A wrapper around [this wrapper](https://github.com/simonwoerpel/d3-playbooks-maps) to render superbugs maps on [correctiv.org/keime](https://correctiv.org/keime)

## new `cmsPlugin`-instance:

**context**

`dataSlug`: see available csv files in `./data/` (without `.csv`)

`eudata`: set to `""` to omit

`yExtent`: fix value range (for coloring) to specified 2-array or set to `false` to let `d3.extent()` do the magic.

`legendFormat`: argument for `d3.format()` to format legend labels

`legendUnit`: `"%"` or `"€"` or whatever.

`reverseColor`: if set to anything `true-ish`, color scale will be inverted.

```json
{
  "title": "Title for Map",
  "description": "A longer description for inside the infobox",
  "eudata": "12 %",
  "annotation": "Annotation, like url to source pdf, html allowed",
  "dataSlug": "data_slug",
  "yExtent": "[0, 50]",
  "legendFormat": ".2f",
  "legendUnit": "%",
  "reverseColor": "false"
}
```

## csv format

`display_value`: what to show in the infobox, can be used either to format nicely or to add annotation for this specific row:

```csv
id,value,display_value
DE,3.9,"3,9 %"
GB,4.1,"4,1 % (England only)"
...
```

## base visualisation setup

**javascript**

```
lib/d3.v4.min.js
lib/topojson.v2.min.js
lib/riot.min.js
lib/d3-playbooks.maps.min.js
lib/d3-playbooks.riot-components.min.js
superbugs.min.js
```

**styles**

```
style.css
```

**init js**

```javascript
<script>
d3.playbooks.superbugsMap({
  id: "%id%",
  title: "%title%",
  description: "%description%",
  eudata: "%eudata%",
  annotation: "%annotation%",
  dataUrl: "%path%data/%dataSlug%.csv",
  geoDataUrl: "%path%data/europe.topo.json",
  yExtent: %yExtent%,
  legendFormat: "%legendFormat%",
  legendUnit: "%legendUnit%"
})
</script>
```

**html**

```html
<section class="superbugs-map-wrapper">
    <section class="superbugs-map" id="superbugs-map--%id%"></section>
    <section class="superbugs-map__legend" id="superbugs-map__legend--%id%"></section>
    <section class="superbugs-map__info-wrapper" id="superbugs-map__info-wrapper--%id%">
        <section class="superbugs-map__selector" id="superbugs-map__selector--%id%"></section>
        <section class="superbugs-map__infobox" id="superbugs-map__infobox--%id%"></section>
    </section>
</section>
```

## development / build

**install build deps**

`npm install babel-cli babel-preset-es2015 uglify-js`

**js**

`babel superbugs.js | uglifyjs -c -m > superbugs.min.js`

**css**

`sass -t compressed style.scss:style.css`
