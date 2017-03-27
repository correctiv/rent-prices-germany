const COLORS = {
  '11': '#e8e6f2',
  // '11': '#d7d6e1', // FIXME ??
  '12': '#b5d3e7',
  '13': '#4fadd0',
  '21': '#e5b4d9',
  '22': '#b8b3d8',
  '23': '#3983bb',
  '31': '#de4fa6',
  '32': '#b03598',
  '33': '#2a1a8a',
}

const YEARS = [
  '2012',
  '2013',
  '2014',
  '2015',
  '2016'
]

const cssNamespace = 'cor-viz-rents'
d3.playbooks.defaults({cssNamespace})

// initial hilight
const initialHilight = (viz, name='Wolfsburg') => {
  viz.ready().then(() => {
    const initial = viz.data().find(d => d.name === name)
    viz.hilight(initial)
    viz.control().trigger(riot.EVT.updateSelector, initial)
    viz.control().trigger(riot.EVT.updateInfobox, initial)
  })
}

// bivariate map
window.renderRentMap = () => {

  const M = d3.playbooks.choroplethMap({
    width: 600,  // german shape ratio
    height: 810,
    cssNamespace,  // FIXME
    elementId: 'rents-map',
    dataUrl: './data/map_data.csv',
    geoDataUrl: './data/landkreise_simplify200.topo.json',
    isTopojson: true,
    topojsonLayerName: 'landkreise_simplify200',
    responsiveSvg: true,
    getId: f => f.properties.RS,
    color: d => COLORS[d]
  }).render()
    .selector({
      element: '#rents-map-selector',
      getLabel: f => f.name
    })
    .infobox({
      element: '#rents-map-infobox',
      template: `
        <dl>
          <dt>{rent_median} € / m²</dt>
          <dd>Miete 2016</dd>
          <dt>{percent_change} %</dt>
          <dd>Anstieg seit 2012</dd>
        </dl>
      `
    })


  // line chart in infobox
  const timeLineElId = 'rents-map-timeline'
  const timeLineEl = d3.select(`#${timeLineElId}`)

  d3.playbooks.timeLineChart.defaults({
    elementId: timeLineElId,
    width: 150,
    height: 200,
    curve: d3.curveStep,
    timeFormat: '%Y',
    yExtent: [3.5, 15],
    getYAxis: ({yScale}) => d3.axisRight(yScale),
    // getXAxis: ({xScale}) => d3.axisTop(xScale),
    showXLabel: false,
    showYLabel: false,
    yTickFormat: d => d > 3 ? d + ' €' : '',
    yLabel: '€ / m²',
    yTicks: 3,
    xTicks: 3,
    margin: {
      top: 20,
      right: 15,
      bottom: 20,
      left: 15
    }
  })

  const renderTimeline = d => {

    timeLineEl.selectAll('*').remove()

    const data = [
      YEARS,
      YEARS.map(y => Number(d[y]))
    ]

    d3.playbooks.timeLineChart({
      data,
      color: COLORS[d.value]
    }).render()

  }

  M.control().on(riot.EVT.updateInfobox, d => renderTimeline(d))
  initialHilight(M)

}


// scatter-plot
window.renderScatter = () => {

  const S = d3.playbooks.scatterChart({
    elementId: 'scatter-plot',
    dataUrl: './data/scatter.csv',
    xCol: 'rent_median',
    yLabel: 'Einwohner pro m²',
    xLabel: 'Mittlerer Mietpreis in € pro m²',
    yCol: 'density',
    getXDomain: () => [4, 16],
    sizeCol: 'size',
    sizeRange: [4, 20],
    groupCol: 'color',
    color: COLORS,
    yTicks: 5,
    yTickFormat: d => d > 0 ? d/1000 + ' T.' : '',
    getLegendItems: ({data}) => {
      const extent = d3.extent(data, d => Number(d['2016pop']))
      const getSize = d3.scaleLinear().domain(extent).range([4, 20])
      const population = [100000, 500000, 2000000]
      return population.reverse().map(p => {
        const radius = getSize(p)
        const label = p < 1000000 ? `${p / 1000} T.` : `${p / 1000000} Mio.`
        return {
          'color': COLORS['11'],
          'label': label,
          'size': 30,
          // 'size': radius * 2,
          'radius': radius
        }
      })
    }
  }).render()

    .selector({
      element: '#scatter-plot-selector',
      getLabel: d => d.name
    })

    .infobox({
      element: '#scatter-plot-infobox',
      template: `
        <dl>
          <dt>{rent_median} € / m²</dt>
          <dd>Miete 2016</dd>
          <dt>{percent_change} %</dt>
          <dd>Anstieg seit 2012</dd>
        </dl>
      `
    })

    .legend({
      element: '#scatter-plot-legend',
      wrapperTemplate: '{body}',
      itemTemplate: `
        <div class="cor-viz-rents__scatter-legend-item">
          <svg width="{size}" height="{size}">
            <circle r={radius} cx=15 cy=15 style="fill:{color}"></circle>
          </svg>
          <span>{label}</span>
        </div>
      `
    })

  initialHilight(S)
}


// comparison charts
window.renderComparisonLines = () => {

  d3.playbooks.multiTimeLineChart.defaults({
    width: 250,
    height: 300,
    xTicks: 3,
    yTickFormat: d => d > 0 ? d + ' €' : '',
    yLabel: 'Mittlerer Mietpreis pro m²',
    timeFormat: '%Y',
    showXLabel: false,
    curve: d3.curveStep,
    getYDomain: () => [0, 15],
    dataUrl: './data/comparison.csv',
    // drawExtra: ({
    //   data,
    //   drawedSelection,
    //   xScale,
    //   yScale,
    //   g
    // }) => {
    //   const last = data.slice(-1)[0]
    //   const find = d => Object.keys(last).find(k => last[k] === d)
    //   const labels = drawedSelection.data().map(d => {
    //     const _last = d.slice(-1)[0]
    //     const label = find(_last)
    //     const y = yScale(_last)
    //     return {label, y}
    //   })
    //   g.selectAll('.label').data(labels).enter().append('text')
    //     .attr('class', '.label')
    //     .attr('x', 100)
    //     .attr('y', d => d.y)
    //     .text(d => d.label)
    // }
  })

  d3.playbooks.multiTimeLineChart({
    elementId: 'comparison-ruhr',
    yCols:  ['Herne', 'Oberhausen', 'Essen', 'Gelsenkirchen', 'Duisburg', 'Bochum', 'Dortmund'],
    color: COLORS[21]
  }).render()

  d3.playbooks.multiTimeLineChart({
    elementId: 'comparison-muc',
    yCols:  ['München', 'Dachau', 'Ebersberg', 'Fürstenfeldbruck', 'München (Kreis)', 'Starnberg'],
    color: COLORS[23],
    showYLabel: false
  }).render()

}


// small multiple maps
window.renderComparisonMaps = () => {

  const renderMap = (year, legend=true) => {
    const sMap = d3.playbooks.choroplethMap({
      width: 600,  // german shape ratio
      height: 810,
      cssNamespace,  // FIXME
      elementId: `comparison-map-${year}`,
      yCol: year,
      yExtent: [5, 15],
      dataUrl: './data/map_data.csv',
      geoDataUrl: './data/landkreise_simplify200.topo.json',
      isTopojson: true,
      topojsonLayerName: 'landkreise_simplify200',
      responsiveSvg: true,
      getId: f => f.properties.RS,
      hilightNode: () => {},
      color: [COLORS['11'], COLORS['12'], COLORS['13'], COLORS['23'], COLORS['33']]
    }).render()

    if (legend) {
      sMap.legend({
        element: '#comparison-maps-legend',
        itemTemplate: `<li><span style="background-color:{color}"></span>{label}&nbsp;€</li>`
      })
    }
  }

  renderMap(2012)
  renderMap(2016, false)

}
