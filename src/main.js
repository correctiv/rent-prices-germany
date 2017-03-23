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

// bivariate map
window.renderRentMap = id => {

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
        <dl>
          <dt>{rent_median} € / m²</dt>
          <dd>Miete 2016</dd>
          <dt>{percent_change} %</dt>
          <dd>Anstieg seit 2012</dd>
        </dl>
      `
    })


  const timeLineElId = `${cssNamespace}__timeline--${id}`
  d3.playbooks.timeLineChart.defaults({
    elementId: timeLineElId,
    cssNamespace: `${cssNamespace}-timeline`,
    width: 200,
    height: 250,
    curve: d3.curveStep,
    timeFormat: '%Y',
    color: COLORS['33'],
    yExtent: [3.5, 15],
    getYAxis: ({yScale}) => d3.axisRight(yScale),
    // getXAxis: ({xScale}) => d3.axisTop(xScale),
    showXLabel: false,
    showYLabel: false,
    yTickFormat: d => d > 3 ? d + ' €' : '',
    yLabel: '€ / m²',
    yTicks: 3,
    xTicks: 4,
    yScaleNice: false,
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 10
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


// scatter plot
window.renderScatter = id => {

  d3.playbooks.scatterChart({
    cssNamespace,
    // width: 1000,  // .-full-width ??
    // height: 600,
    elementId: `${cssNamespace}__scatter--${id}`,
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
      element: `#${cssNamespace}__selector--${id}`,
      getLabel: d => d.name
    })

    .infobox({
      element: `#${cssNamespace}__infobox--${id}`,
      template: `
        <p><strong>Miete 2016</strong><br>{rent_median} € / m²</p>
        <p><strong>Anstieg seit 2012</strong><br>{percent_change} %</p>
      `
    })

    .legend({
      element: `#${cssNamespace}__legend--${id}`,
      wrapperTemplate: '<div class="cor-viz-rents__scatter-legend-list">{body}</div>',
      itemTemplate: `
        <div class="cor-viz-rents__scatter-legend-item">
          <svg width="{size}" height="{size}">
            <circle r={radius} cx=15 cy=15 style="fill:{color}"></circle>
          </svg>
          <span>{label}</span>
        </div>
      `
    })

}
