d3.playbooks.superbugsMap = ({
  id,
  title,
  description,
  annotation,
  eudata,
  dataUrl,
  geoDataUrl,
  yExtent,
  legendFormat,
  legendUnit,
  reverseColor
}) => {

  const color = ['#fff5f0','#fee0d2','#fcbba1','#fc9272','#fb6a4a','#ef3b2c','#cb181d','#a50f15','#67000d']
  if (reverseColor) color.reverse()

  const superbugsMap = d3.playbooks.choroplethMap({
    width: 800,
    height: 400,
    elementId: `superbugs-map--${id}`,
    cssNamespace: 'superbugs-map',
    geoDataUrl,
    dataUrl,
    yExtent,
    color,
    nullColor: '#cce2df',
    responsiveSvg: true,
    //isTopojson: true,
    //topojsonLayerName: 'europe_clipped',
    projection: d3.geoConicConformal(),
    getId: f => f.properties.RS,
 //   drawExtra: M => {
 //     const cyprus = M.data.find(d => d.iso_a2 === 'CY')
 //     const [[x0, y0], [x1, y1]] = M.path.bounds(cyprus)
 //     M.g.append('text')
 //       .attr('x', x0 - 10)
 //       .attr('y', y0 - 20)
 //       .text(cyprus.name)
 //       .style('font-size', 10)
 //       .style('fill', 'gray')
 //     M.g.append('rect')
 //       .attr('x', x0 - 10)
 //       .attr('y', y0 - 15)
 //       .attr('width', x1 - x0 + 20)
 //       .attr('height', y1 - y0 + 20)
 //       .style('fill', 'none')
 //       .style('stroke', 'gray')
 //       .style('stroke-width', .5)
 //   }
 })

  const euDataTempl = eudata ? `<p class="infobox__eudata">EU: ${eudata}</p>` : ''

  superbugsMap.render().infobox({
    element: `#superbugs-map__infobox--${id}`,
    template: `
      <h3>{display_value}</h3>
      <h4>${title}</h4>
      <p class="infobox__description">${description}</p>
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
    itemTemplate: `<li style="background-color:{color}">{label} ${legendUnit}</li>`
  })

  // initial hilight
  superbugsMap.ready().then(() => {
    const germany = superbugsMap.data().find(d => d.iso_a2 === 'DE')
    superbugsMap.hilight(germany)
    superbugsMap.control().trigger('update_infobox', germany)
    superbugsMap.control().trigger('update_selector', germany)
  })

}
