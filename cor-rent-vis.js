const COLORS = {
  '11': '#e8e6f2',
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

window.renderRentMap = id => {

  const cssNamespace = 'cor-viz-rents'
  const M = d3.playbooks.choroplethMap({
    width: 600,  // german shape ratio
    height: 810,
    elementId: `${cssNamespace}__map--${id}`,
    cssNamespace,
    dataUrl: './data/map_data.csv',
    geoDataUrl: './data/landkreise_simplify200.topo.json',
    isTopojson: true,
    topojsonLayerName: 'landkreise_simplify200',
    responsiveSvg: true,
    getId: f => f.properties.RS,
    color: d => COLORS[d]
  }).render()
    .selector({
      element: `#${cssNamespace}__selector--${id}`,
      getLabel: f => f.name
    })
    .infobox({
      element: `#${cssNamespace}__infobox--${id}`,
      template: `
        <p><strong>Miete 2016</strong><br>{rent_median} € / m²</p>
        <p><strong>Anstieg seit 2012</strong><br>{percent_change} %</p>
      `
    })


  const timeLineElId = `${cssNamespace}__timeline--${id}`
  d3.playbooks.timeLineChart.defaults({
    elementId: timeLineElId,
    cssNamespace: `${cssNamespace}-timeline`,
    width: 200,
    height: 400,
    curve: d3.curveStep,
    timeFormat: '%Y',
    color: COLORS['33'],
    yExtent: [0, 15],
    // getYAxis: ({yScale}) => d3.axisRight(yScale),
    // getXAxis: ({xScale}) => d3.axisTop(xScale),
    showXLabel: false,
    // showYLabel: false,
    yLabel: '€ / m²',
    yTicks: 15,
    xTicks: 4,
    yScaleNice: false,
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
  })

  const wrapperEl = d3.select(`.${cssNamespace}__infobox-wrapper`)
  const timeLineEl = d3.select(`#${timeLineElId}`)

  const renderTimeline = d => {

    timeLineEl.selectAll('*').remove()
    wrapperEl.classed('-hidden', false)

    const data = [
      YEARS,
      YEARS.map(y => Number(d[y]))
    ]

    d3.playbooks.timeLineChart({
      data
    }).render()

  }

  const unHilight = () => {
    timeLineEl.selectAll('*').remove()
    wrapperEl.classed('-hidden', true)
  }

  M.control().on(riot.EVT.updateInfobox, d => renderTimeline(d))
  M.control().on(riot.EVT.emptyInfobox, () => unHilight())
}
