d3.playbooks.superbugsMap = ({
  id,
  title,
  description,
  annotation,
  eudata,
  dataUrl,
  yExtent,
  legendFormat='.0f',
}) => {

  const superbugsMap = d3.playbooks.choroplethMap({
    width: 800,
    height: 800,
    elementId: `superbugs-map--${id}`,
    cssNamespace: 'superbugs-map',
    geoDataUrl: './data/europe.topo.json',
    dataUrl,
    yExtent,
    nullColor: '#eee',
    responsiveSvg: true,
    isTopojson: true,
    topojsonLayerName: 'europe_clipped',
    getId: f => f.properties.iso_a2,
  })

  const euDataTempl = eudata ? `<p class="infobox__eudata">EU: ${eudata}</p>` : ''

  superbugsMap.render().infobox({
    element: `#superbugs-map__infobox--${id}`,
    template: `
      <h3>{name}</h3>
      <p class="infobox__data">{display_value}</p>
      <h4>${title}</h4>
      <p class="infobox__subtitle">${description}</p>
      ${euDataTempl}
      <p class="infobox__annotation">${annotation}</p>
    `
  }).selector({
    element: `#superbugs-map__selector--${id}`,
    getLabel: f => f.name
  }).legend({
    getLabel: q => d3.format(legendFormat)(q),
    element: `#superbugs-map__legend--${id}`,
    wrapperTemplate: '<ul name="legend">{body}</ul>',
    itemTemplate: '<li style="background-color:{color}">{label} %</li>'
  })

  // initial hilight
  superbugsMap.ready().then(() => {
    const germany = superbugsMap.data().filter(d => d.iso_a2 === 'DE')[0]
    superbugsMap.hilight(germany)
    superbugsMap.control().trigger('update_infobox', germany)
    superbugsMap.control().trigger('update_selector', germany)
  })

}
