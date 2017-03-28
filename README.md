# cor-viz-rents

A wrapper around [this](https://github.com/simonwoerpel/d3-playbooks) and [this wrapper](https://github.com/simonwoerpel/d3-playbooks-maps) to render some simple maps and charts for showing german rent prices.

[Preview](https://correctiv.github.io/rent-prices-germany/)

## new `cmsPlugin`-instance for each viz:

- bivariate map
- scatter plot
- comparison between *ruhr* and *munich*
- comparison between 2012 and 2016

### bivariate map

**html**

```html
<figure class="figure -paragraph-width">
  <div class="figure__container">
    <section class="cor-viz-rents__section">
      <img class="cor-viz-rents__bivariate-legend" src="./legend.svg">
      <div id="rents-map"></div>
    </section>
    <figcaption class="figure__caption">
      <section class="cor-viz-rents__section">
        <div class="cor-viz-rents__selector" id="rents-map-selector"></div>
        <div class="cor-viz-rents__infobox" id="rents-map-infobox"></div>
        <div id="rents-map-timeline"></div>
      </section>
    </figcaption>
  </div>
</figure>
<p class="cor-viz-rents__credits"><b>Daten:</b> <a href="">Data Source</a></p>
```

**init js**

```html
<script type="text/javascript" charset="utf-8">
  renderRentMap();
</script>
```

### scatter plot

**html**

```html
<figure class="figure -paragraph-width">
  <div class="figure__container">
    <section class="cor-viz-rents__section">
      <div id="scatter-plot"></div>
    </section>
    <figcaption class="figure__caption">
      <section class="cor-viz-rents__section">
        <div class="figure__title"><p>Einwohner</p></div>
        <div class="cor-viz-rents__legend" id="scatter-plot-legend"></div>
        <div class="cor-viz-rents__selector" id="scatter-plot-selector"></div>
        <div class="cor-viz-rents__infobox" id="scatter-plot-infobox"></div>
      </section>
    </figcaption>
  </div>
</figure>
<p class="cor-viz-rents__credits"><b>Daten:</b> <a href="">Data Source</a></p>
```

**init js**

```html
<script type="text/javascript" charset="utf-8">
  renderScatter();
</script>
```

### compare 'Ruhrgebiet' with 'Munich'

**html**

```html
<figure class="figure -paragraph-width">
  <div class="figure__container">
    <section class="cor-viz-rents__section cor-viz-rents__section--small-multiples">
      <div class="cor-viz-rents__chart" id="comparison-ruhr">
        <p class="cor-viz-rents__title">Ruhrgebiet</p>
      </div>
      <div class="cor-viz-rents__chart" id="comparison-muc">
        <p class="cor-viz-rents__title">Region um München</p>
      </div>
    </section>
  </div>
</figure>
<p class="cor-viz-rents__annotation"><strong>Ruhrgebiet:</strong> Herne, Oberhausen, Essen, Gelsenkirchen, Duisburg, Bochum, Dortmund</p>
<p class="cor-viz-rents__annotation"><strong>Region um München:</strong> München, Dachau, Ebersberg, Fürstenfeldbruck, München (Kreis), Starnberg</p>
<p class="cor-viz-rents__credits"><strong>Daten:</strong> <a href="">Data Source</a></p>
```

**init js**

```html
<script type="text/javascript" charset="utf-8">
  renderComparisonLines();
</script>
```


### compare 2012 with 2016

**html**

```html
<figure class="figure -paragraph-width">
  <div class="figure__container">
    <section class="cor-viz-rents__section cor-viz-rents__section--small-multiples">
      <div class="cor-viz-rents__map" id="comparison-map-2012">
        <p class="cor-viz-rents__title">2012</p>
      </div>
      <div class="cor-viz-rents__map" id="comparison-map-2016">
        <p class="cor-viz-rents__title">2016</p>
      </div>
    </section>
    <figcaption class="figure__caption">
      <section class="cor-viz-rents__section">
        <div class="figure__title"><p>Mietpreis pro&nbsp;m²</p></div>
        <div class="cor-viz-rents__legend" id="comparison-maps-legend"></div>
      </section>
    </figcaption>
  </div>
</figure>
<p class="cor-viz-rents__credits"><strong>Daten:</strong> <a href="">Data Source</a></p>
```

**init js**

```html
<script type="text/javascript" charset="utf-8">
  renderComparisonMaps();
</script>
```


## base visualisation setup

**javascript**

```
lib/d3.v4.min.js
lib/topojson.v2.min.js
lib/riot.min.js
lib/d3-playbooks.base.min.js
lib/d3-playbooks.maps.min.js
lib/d3-playbooks.riot-components.min.js
cor-viz-rents.min.js
```

**styles**

```
cor-viz-rents.min.css
```

## development / build

### install build deps

`npm install`

### build js and css for deployment

`npm run build`

### watch and build js and css during development

`npm run dev`

start a webserver to view `index.html`.
