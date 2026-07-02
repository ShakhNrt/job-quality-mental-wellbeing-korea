const container = document.getElementById('scrollContainer');
const sections = container.querySelectorAll('.section');
const navDotsContainer = document.getElementById('navDots');

// Build nav dots
sections.forEach((section, i) => {
  const dot = document.createElement('div');
  dot.className = 'nav-dot';
  if (i === 0) dot.classList.add('active');
  const label = document.createElement('span');
  label.className = 'nav-dot-label';
  label.textContent = section.dataset.label || '';
  dot.appendChild(label);
  dot.addEventListener('click', () => {
    section.scrollIntoView({ behavior: 'smooth' });
  });
  navDotsContainer.appendChild(dot);
});

const dots = navDotsContainer.querySelectorAll('.nav-dot');

// Intersection observer for section visibility and entrance animations
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const inner = entry.target.querySelector('.section-inner');
      if (inner) inner.classList.add('visible');
      const index = Array.from(sections).indexOf(entry.target);
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }
  });
}, {
  root: container,
  threshold: 0.5
});

sections.forEach(s => sectionObserver.observe(s));

// Plotly chart configs
const plotlyLayout = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { family: 'DM Sans', color: '#1A1A1A' },
  margin: { t: 30, r: 40, b: 60, l: 70 },
  xaxis: {
    gridcolor: '#E8E8E8',
    linecolor: '#1A1A1A',
    linewidth: 1.5,
    zeroline: false,
    tickfont: { size: 12 },
    fixedrange: true
  },
  yaxis: {
    gridcolor: '#E8E8E8',
    linecolor: '#1A1A1A',
    linewidth: 1.5,
    zeroline: false,
    tickfont: { size: 12 },
    fixedrange: true
  },
  hoverlabel: {
    bgcolor: '#1A1A1A',
    font: { family: 'DM Sans', color: '#F5F5F5', size: 13 },
    bordercolor: 'transparent'
  }
};

const plotlyConfig = {
  displayModeBar: false,
  responsive: true,
  scrollZoom: false,
  staticPlot: false
};

// ===== DATA =====

// WHO-5 histogram (binwidth=4, from R)
const who5HistData = [
  {mid:2,count:189},{mid:6,count:119},{mid:10,count:201},{mid:14,count:270},{mid:18,count:800},
  {mid:22,count:559},{mid:26,count:750},{mid:30,count:774},{mid:34,count:659},{mid:38,count:841},
  {mid:42,count:1019},{mid:46,count:1377},{mid:50,count:1585},{mid:54,count:1412},{mid:58,count:1711},
  {mid:62,count:1786},{mid:66,count:2468},{mid:70,count:2455},{mid:74,count:1643},{mid:78,count:2281},
  {mid:82,count:1412},{mid:86,count:1232},{mid:90,count:398},{mid:94,count:107},{mid:98,count:155}
];

// Job Quality histogram (binwidth=2, from R)
const jqHistData = [
  {mid:15,count:1},{mid:17,count:2},{mid:19,count:7},{mid:21,count:5},{mid:23,count:9},
  {mid:25,count:17},{mid:27,count:23},{mid:29,count:66},{mid:31,count:75},{mid:33,count:115},
  {mid:35,count:93},{mid:37,count:187},{mid:39,count:208},{mid:41,count:335},{mid:43,count:365},
  {mid:45,count:807},{mid:47,count:1025},{mid:49,count:1636},{mid:51,count:733},{mid:53,count:2228},
  {mid:55,count:2709},{mid:57,count:826},{mid:59,count:2811},{mid:61,count:2107},{mid:63,count:1097},
  {mid:65,count:209},{mid:67,count:821},{mid:69,count:455},{mid:71,count:236},{mid:73,count:395},
  {mid:75,count:484},{mid:77,count:541},{mid:79,count:302},{mid:81,count:546},{mid:83,count:697},
  {mid:85,count:348},{mid:87,count:771},{mid:89,count:746},{mid:91,count:887},{mid:93,count:213},
  {mid:95,count:558},{mid:97,count:234},{mid:99,count:273}
];

// Occupation sub-index data (from R weighted means)
const occData = [
  {label:"Managers",safety:86.83,autonomy:29.58,management:73.54},
  {label:"Professionals",safety:93.58,autonomy:28.56,management:72.90},
  {label:"Clerks",safety:93.19,autonomy:26.56,management:71.77},
  {label:"Service Workers",safety:92.23,autonomy:26.78,management:70.62},
  {label:"Sales Workers",safety:93.69,autonomy:25.18,management:69.80},
  {label:"Agriculture/Forestry",safety:79.44,autonomy:21.49,management:70.91},
  {label:"Craft/Trades",safety:75.95,autonomy:30.61,management:68.87},
  {label:"Machine Operators",safety:81.17,autonomy:21.51,management:68.63},
  {label:"Elementary Workers",safety:87.05,autonomy:26.99,management:66.37}
];

// Scatter sample (500 pts from n=26,203)
const scatterData = [{"x":52.8,"y":40},{"x":34,"y":68},{"x":50,"y":60},{"x":63.9,"y":56},{"x":55.6,"y":52},{"x":50,"y":88},{"x":58.3,"y":40},{"x":91.7,"y":68},{"x":50,"y":48},{"x":61.1,"y":84},{"x":71,"y":20},{"x":66.7,"y":80},{"x":78.7,"y":52},{"x":43.2,"y":56},{"x":69.4,"y":48},{"x":78.7,"y":56},{"x":47.2,"y":80},{"x":63.9,"y":44},{"x":54.3,"y":56},{"x":50.9,"y":68},{"x":52.2,"y":28},{"x":57.1,"y":72},{"x":63.9,"y":80},{"x":63.9,"y":80},{"x":55.6,"y":48},{"x":58.3,"y":64},{"x":46.3,"y":64},{"x":61.1,"y":88},{"x":94.4,"y":76},{"x":46.6,"y":88},{"x":75,"y":72},{"x":69.1,"y":92},{"x":57.1,"y":52},{"x":50,"y":56},{"x":47.2,"y":60},{"x":77.8,"y":76},{"x":68.5,"y":88},{"x":54.9,"y":84},{"x":72.2,"y":92},{"x":50.6,"y":60},{"x":94.4,"y":72},{"x":46.9,"y":44},{"x":55.2,"y":28},{"x":41,"y":56},{"x":44.4,"y":12},{"x":47.2,"y":72},{"x":61.7,"y":52},{"x":49.4,"y":32},{"x":52.8,"y":56},{"x":37,"y":16},{"x":52.8,"y":80},{"x":59.9,"y":76},{"x":47.2,"y":72},{"x":76.2,"y":72},{"x":43.5,"y":24},{"x":58.3,"y":88},{"x":94.4,"y":52},{"x":52.8,"y":52},{"x":55.2,"y":88},{"x":55.6,"y":84},{"x":47.2,"y":52},{"x":75,"y":88},{"x":91,"y":76},{"x":50,"y":40},{"x":94.4,"y":72},{"x":88,"y":68},{"x":55.2,"y":80},{"x":52.8,"y":44},{"x":52.8,"y":80},{"x":55.6,"y":60},{"x":52.8,"y":68},{"x":77.8,"y":52},{"x":48.8,"y":36},{"x":47.2,"y":80},{"x":55.6,"y":64},{"x":66,"y":52},{"x":44.4,"y":20},{"x":100,"y":60},{"x":61.1,"y":76},{"x":87.3,"y":84},{"x":90.7,"y":48},{"x":69.4,"y":72},{"x":55.6,"y":84},{"x":86.1,"y":72},{"x":57.1,"y":80},{"x":88.9,"y":72},{"x":84.9,"y":48},{"x":100,"y":72},{"x":58.3,"y":28},{"x":42,"y":32},{"x":71.3,"y":76},{"x":52.2,"y":76},{"x":58.3,"y":88},{"x":58.3,"y":60},{"x":58.6,"y":68},{"x":61.1,"y":84},{"x":55.6,"y":64},{"x":69.1,"y":68},{"x":58,"y":76},{"x":58.3,"y":44},{"x":58.3,"y":76},{"x":92.6,"y":44},{"x":32.1,"y":64},{"x":80.9,"y":24},{"x":52.8,"y":12},{"x":50,"y":60},{"x":69.4,"y":64},{"x":42,"y":40},{"x":83.3,"y":56},{"x":48.5,"y":68},{"x":61.1,"y":80},{"x":94.4,"y":80},{"x":59.3,"y":76},{"x":59.3,"y":68},{"x":42,"y":16},{"x":53.1,"y":84},{"x":41.4,"y":48},{"x":63.9,"y":80},{"x":69.4,"y":28},{"x":52.8,"y":64},{"x":47.2,"y":60},{"x":50,"y":36},{"x":50,"y":76},{"x":61.1,"y":52},{"x":91.7,"y":20},{"x":61.1,"y":60},{"x":86.1,"y":72},{"x":55.6,"y":84},{"x":85.5,"y":92},{"x":72.2,"y":76},{"x":72.2,"y":36},{"x":57.7,"y":60},{"x":58.3,"y":32},{"x":86.1,"y":76},{"x":67.3,"y":48},{"x":48.8,"y":32},{"x":58.3,"y":20},{"x":88.9,"y":72},{"x":58.3,"y":76},{"x":45.4,"y":80},{"x":54.3,"y":80},{"x":69.8,"y":28},{"x":52.8,"y":80},{"x":52.8,"y":52},{"x":58.3,"y":48},{"x":61.1,"y":76},{"x":91.4,"y":72},{"x":75,"y":68},{"x":88.6,"y":60},{"x":63.9,"y":80},{"x":58.3,"y":48},{"x":79.9,"y":60},{"x":63.6,"y":80},{"x":46,"y":60},{"x":52.8,"y":68},{"x":81.2,"y":52},{"x":55.6,"y":76},{"x":86.1,"y":76},{"x":86.1,"y":60},{"x":59,"y":44},{"x":52.8,"y":80},{"x":43.8,"y":68},{"x":86.1,"y":4},{"x":68.8,"y":56},{"x":37.3,"y":36},{"x":52.8,"y":28},{"x":54.3,"y":36},{"x":58.3,"y":68},{"x":91.7,"y":36},{"x":55.6,"y":88},{"x":71.3,"y":76},{"x":38.3,"y":44},{"x":78.7,"y":8},{"x":49.4,"y":44},{"x":48.8,"y":52},{"x":57.1,"y":32},{"x":55.9,"y":48},{"x":61.1,"y":88},{"x":55.6,"y":76},{"x":58.3,"y":32},{"x":48.1,"y":84},{"x":78.1,"y":32},{"x":67,"y":44},{"x":81.5,"y":52},{"x":58.3,"y":52},{"x":83.3,"y":84},{"x":86.1,"y":44},{"x":58.3,"y":48},{"x":76.5,"y":72},{"x":61.1,"y":68},{"x":47.2,"y":52},{"x":53.1,"y":84},{"x":74.7,"y":68},{"x":93.8,"y":44},{"x":69.4,"y":68},{"x":58.3,"y":76},{"x":66.7,"y":64},{"x":58.3,"y":80},{"x":58.3,"y":48},{"x":62,"y":80},{"x":58.3,"y":60},{"x":63.6,"y":80},{"x":83.3,"y":52},{"x":90.4,"y":80},{"x":50,"y":84},{"x":69.4,"y":40},{"x":44.8,"y":20},{"x":57.1,"y":84},{"x":63.9,"y":72},{"x":48.1,"y":24},{"x":58.3,"y":68},{"x":50,"y":88},{"x":68.8,"y":68},{"x":63.9,"y":8},{"x":48.8,"y":72},{"x":55.6,"y":36},{"x":36.1,"y":40},{"x":88.9,"y":48},{"x":58.3,"y":84},{"x":58.3,"y":52},{"x":52.8,"y":36},{"x":77.2,"y":76},{"x":55.6,"y":76},{"x":91.7,"y":80},{"x":66.7,"y":20},{"x":43.2,"y":68},{"x":80.6,"y":24},{"x":52.8,"y":44},{"x":94.4,"y":88},{"x":69.4,"y":56},{"x":46.3,"y":68},{"x":79.9,"y":52},{"x":58,"y":40},{"x":43.5,"y":24},{"x":55.6,"y":64},{"x":94.4,"y":80},{"x":52.8,"y":80},{"x":66.7,"y":76},{"x":63.9,"y":16},{"x":76.5,"y":20},{"x":63.9,"y":60},{"x":94.4,"y":88},{"x":77.8,"y":64},{"x":56.5,"y":56},{"x":67.3,"y":20},{"x":66.7,"y":16},{"x":50,"y":40},{"x":79,"y":72},{"x":38.9,"y":48},{"x":94.4,"y":56},{"x":54.9,"y":76},{"x":58.3,"y":80},{"x":52.8,"y":64},{"x":55.6,"y":84},{"x":80.6,"y":60},{"x":61.1,"y":76},{"x":71.5,"y":80},{"x":88.9,"y":84},{"x":50,"y":32},{"x":61.1,"y":84},{"x":52.8,"y":60},{"x":58.3,"y":76},{"x":54.6,"y":60},{"x":47.8,"y":56},{"x":63.9,"y":68},{"x":94.4,"y":80},{"x":58.3,"y":80},{"x":43.8,"y":72},{"x":52.8,"y":28},{"x":85.2,"y":84},{"x":46.9,"y":68},{"x":55.6,"y":80},{"x":47.8,"y":44},{"x":48.8,"y":68},{"x":58.3,"y":88},{"x":63.9,"y":84},{"x":50,"y":40},{"x":55.6,"y":24},{"x":63.3,"y":64},{"x":57.7,"y":72},{"x":58.3,"y":72},{"x":61.1,"y":52},{"x":63.9,"y":84},{"x":58.3,"y":32},{"x":56.8,"y":32},{"x":58,"y":76},{"x":62.7,"y":28},{"x":51.5,"y":48},{"x":52.8,"y":64},{"x":55.2,"y":72},{"x":41.7,"y":52},{"x":55.6,"y":28},{"x":58.3,"y":64},{"x":88.9,"y":76},{"x":63.9,"y":80},{"x":47.2,"y":56},{"x":72.2,"y":64},{"x":52.2,"y":44},{"x":91.7,"y":72},{"x":83,"y":88},{"x":42.9,"y":32},{"x":56.8,"y":84},{"x":80.6,"y":72},{"x":61.1,"y":88},{"x":61.1,"y":88},{"x":51.2,"y":84},{"x":50,"y":76},{"x":74.1,"y":56},{"x":46.6,"y":72},{"x":50.6,"y":76},{"x":61.1,"y":80},{"x":78.1,"y":36},{"x":69.1,"y":20},{"x":54.9,"y":60},{"x":51.9,"y":68},{"x":61.1,"y":56},{"x":52.8,"y":80},{"x":30.6,"y":56},{"x":61.1,"y":84},{"x":63.9,"y":20},{"x":29.9,"y":56},{"x":75,"y":20},{"x":61.1,"y":88},{"x":100,"y":84},{"x":55.6,"y":76},{"x":51.9,"y":56},{"x":52.8,"y":68},{"x":88.9,"y":48},{"x":55.6,"y":84},{"x":43.5,"y":56},{"x":88.9,"y":68},{"x":50,"y":56},{"x":54.3,"y":60},{"x":58,"y":32},{"x":44.4,"y":36},{"x":66.7,"y":52},{"x":71.3,"y":40},{"x":60.5,"y":52},{"x":55.6,"y":56},{"x":66,"y":76},{"x":88.6,"y":64},{"x":47.8,"y":88},{"x":50,"y":48},{"x":46.3,"y":44},{"x":88.9,"y":60},{"x":58.3,"y":32},{"x":100,"y":100},{"x":91.7,"y":52},{"x":43.5,"y":60},{"x":85.2,"y":24},{"x":55.2,"y":52},{"x":52.8,"y":32},{"x":59.3,"y":60},{"x":54,"y":56},{"x":50,"y":76},{"x":58.6,"y":56},{"x":63.9,"y":92},{"x":88.9,"y":72},{"x":72.2,"y":68},{"x":57.4,"y":76},{"x":61.1,"y":88},{"x":55.6,"y":68},{"x":81.5,"y":84},{"x":53.7,"y":80},{"x":52.8,"y":24},{"x":58.3,"y":76},{"x":55.6,"y":56},{"x":54.9,"y":12},{"x":55.6,"y":80},{"x":42.9,"y":80},{"x":63.9,"y":24},{"x":63.9,"y":20},{"x":52.5,"y":48},{"x":55.6,"y":44},{"x":47.2,"y":80},{"x":31.8,"y":48},{"x":61.1,"y":72},{"x":83.3,"y":76},{"x":52.8,"y":44},{"x":53.4,"y":60},{"x":58.3,"y":68},{"x":46.9,"y":52},{"x":58.3,"y":76},{"x":58.3,"y":48},{"x":63.9,"y":88},{"x":61.1,"y":72},{"x":80.6,"y":60},{"x":58.3,"y":84},{"x":58.3,"y":56},{"x":61.1,"y":88},{"x":61.1,"y":56},{"x":92.6,"y":84},{"x":55.6,"y":64},{"x":97.2,"y":48},{"x":55.6,"y":64},{"x":59.3,"y":80},{"x":27.5,"y":40},{"x":94.4,"y":24},{"x":61.1,"y":60},{"x":83.3,"y":68},{"x":78.4,"y":64},{"x":55.6,"y":56},{"x":50.6,"y":84},{"x":42.3,"y":64},{"x":61.1,"y":56},{"x":58.3,"y":68},{"x":44.1,"y":56},{"x":52.8,"y":48},{"x":55.6,"y":60},{"x":66.7,"y":60},{"x":52.2,"y":32},{"x":58.3,"y":64},{"x":55.6,"y":60},{"x":43.2,"y":52},{"x":57.1,"y":84},{"x":55.6,"y":24},{"x":93.2,"y":84},{"x":55.6,"y":76},{"x":55.9,"y":36},{"x":82.1,"y":20},{"x":58.3,"y":64},{"x":61.1,"y":32},{"x":46.9,"y":16},{"x":55.6,"y":88},{"x":52.5,"y":60},{"x":57.1,"y":68},{"x":50,"y":72},{"x":50,"y":80},{"x":52.8,"y":72},{"x":61.1,"y":72},{"x":94.4,"y":52},{"x":50.6,"y":20},{"x":58.3,"y":48},{"x":52.8,"y":88},{"x":46,"y":60},{"x":63.9,"y":88},{"x":47.2,"y":60},{"x":56.8,"y":40},{"x":89.2,"y":60},{"x":80.6,"y":28},{"x":88.9,"y":76},{"x":50,"y":24},{"x":88.3,"y":68},{"x":50.3,"y":52},{"x":91.7,"y":40},{"x":66.7,"y":60},{"x":94.4,"y":80},{"x":39.8,"y":80},{"x":84,"y":64},{"x":66.7,"y":64},{"x":97.2,"y":92},{"x":82.1,"y":76},{"x":77.5,"y":24},{"x":44.4,"y":48},{"x":50.6,"y":84},{"x":55.9,"y":60},{"x":61.1,"y":84},{"x":67.3,"y":48},{"x":46,"y":12},{"x":44.4,"y":60},{"x":80.2,"y":32},{"x":47.5,"y":76},{"x":83.3,"y":72},{"x":94.1,"y":40},{"x":97.2,"y":80},{"x":70.7,"y":24},{"x":43.8,"y":76},{"x":44.4,"y":0},{"x":61.1,"y":76},{"x":52.8,"y":48},{"x":44.8,"y":36},{"x":55.6,"y":68},{"x":55.6,"y":68},{"x":52.8,"y":52},{"x":45.7,"y":16},{"x":52.5,"y":8},{"x":47.2,"y":60},{"x":50.3,"y":68},{"x":60.8,"y":72},{"x":52.8,"y":80},{"x":89.8,"y":68},{"x":58.3,"y":68},{"x":54.6,"y":0},{"x":49.4,"y":84},{"x":52.8,"y":72},{"x":87.7,"y":84},{"x":94.1,"y":64},{"x":69.4,"y":56},{"x":55.2,"y":68},{"x":61.1,"y":76},{"x":52.8,"y":76},{"x":77.8,"y":24},{"x":44.8,"y":68},{"x":55.6,"y":84},{"x":55.6,"y":88},{"x":54.9,"y":72},{"x":88.9,"y":40},{"x":91.7,"y":48},{"x":84.9,"y":80},{"x":57.4,"y":80}];

// Regression stats (from full n=26,203 OLS)
const regStats = { intercept: 51.6926, slope: 0.1311, r2: 0.0099, n: 26203 };

// Binned decile data
const binnedData = [
  {d:1,x:41.23,y:51.29},{d:2,x:49.00,y:55.77},{d:3,x:52.54,y:58.58},{d:4,x:55.24,y:61.68},
  {d:5,x:57.80,y:62.47},{d:6,x:60.16,y:65.28},{d:7,x:63.76,y:64.45},{d:8,x:73.79,y:59.06},
  {d:9,x:84.40,y:58.65},{d:10,x:93.19,y:65.65}
];

// ===== RENDER FUNCTIONS =====

function renderWho5Hist() {
  const el = document.getElementById('plotWho5Hist');
  if (!el || el.offsetHeight === 0) return;

  Plotly.newPlot(el, [{
    x: who5HistData.map(d => d.mid),
    y: who5HistData.map(d => d.count),
    type: 'bar',
    marker: {
      color: 'rgba(255, 77, 77, 0.7)',
      line: { color: '#1A1A1A', width: 0.5 }
    },
    width: 3.6,
    hovertemplate: 'Score: %{x}<br>Workers: %{y:,}<extra></extra>'
  }], {
    ...plotlyLayout,
    xaxis: {
      ...plotlyLayout.xaxis,
      title: { text: 'WHO-5 Score (0-100, higher = better well-being)', font: { size: 12 } },
      range: [0, 100],
      dtick: 10
    },
    yaxis: {
      ...plotlyLayout.yaxis,
      title: { text: 'Number of Workers', font: { size: 12 } }
    },
    bargap: 0.05
  }, plotlyConfig);
}

function renderJqHist() {
  const el = document.getElementById('plotJqHist');
  if (!el || el.offsetHeight === 0) return;

  Plotly.newPlot(el, [{
    x: jqHistData.map(d => d.mid),
    y: jqHistData.map(d => d.count),
    type: 'bar',
    marker: {
      color: 'rgba(255, 77, 77, 0.55)',
      line: { color: '#1A1A1A', width: 0.3 }
    },
    width: 1.8,
    hovertemplate: 'Job Quality: %{x}<br>Workers: %{y:,}<extra></extra>'
  }], {
    ...plotlyLayout,
    xaxis: {
      ...plotlyLayout.xaxis,
      title: { text: 'Job Quality Score (0-100, higher = better)', font: { size: 12 } },
      range: [10, 100],
      dtick: 10
    },
    yaxis: {
      ...plotlyLayout.yaxis,
      title: { text: 'Number of Workers', font: { size: 12 } }
    },
    bargap: 0.03
  }, plotlyConfig);
}

function renderScatter() {
  const el = document.getElementById('plotScatter');
  if (!el || el.offsetHeight === 0) return;

  const xLine = [15, 100];
  const yLine = xLine.map(x => regStats.intercept + regStats.slope * x);

  Plotly.newPlot(el, [
    {
      x: scatterData.map(d => d.x),
      y: scatterData.map(d => d.y),
      type: 'scatter',
      mode: 'markers',
      marker: {
        color: 'rgba(26, 26, 26, 0.15)',
        size: 5,
        line: { width: 0 }
      },
      hovertemplate: 'Job Quality: %{x:.1f}<br>WHO-5: %{y:.0f}<extra></extra>'
    },
    {
      x: xLine,
      y: yLine,
      type: 'scatter',
      mode: 'lines',
      line: { color: '#FF4D4D', width: 3 },
      hoverinfo: 'skip'
    }
  ], {
    ...plotlyLayout,
    xaxis: {
      ...plotlyLayout.xaxis,
      title: { text: 'Job Quality Score (0-100)', font: { size: 12 } },
      range: [15, 105]
    },
    yaxis: {
      ...plotlyLayout.yaxis,
      title: { text: 'WHO-5 Well-being Score (0-100)', font: { size: 12 } },
      range: [-5, 105]
    },
    showlegend: false,
    annotations: [{
      x: 0.98,
      y: 0.98,
      xref: 'paper',
      yref: 'paper',
      text: `R² = ${regStats.r2.toFixed(4)}<br>p < 0.001<br>n = ${regStats.n.toLocaleString()}`,
      showarrow: false,
      font: { family: 'DM Sans', size: 13, color: '#1A1A1A' },
      align: 'right',
      xanchor: 'right',
      yanchor: 'top',
      bgcolor: 'rgba(245, 245, 245, 0.85)',
      borderpad: 8
    }]
  }, plotlyConfig);
}

function renderSubIndex() {
  const el = document.getElementById('plotSubIndex');
  if (!el || el.offsetHeight === 0) return;

  const labels = occData.map(d => d.label);

  Plotly.newPlot(el, [
    {
      y: labels,
      x: occData.map(d => d.safety),
      type: 'bar',
      orientation: 'h',
      name: 'Safety',
      marker: { color: 'rgba(255, 77, 77, 0.8)', line: { color: '#1A1A1A', width: 0.5 } },
      hovertemplate: '%{y}<br>Safety: %{x:.1f}<extra></extra>'
    },
    {
      y: labels,
      x: occData.map(d => d.autonomy),
      type: 'bar',
      orientation: 'h',
      name: 'Autonomy',
      marker: { color: 'rgba(26, 26, 26, 0.55)', line: { color: '#1A1A1A', width: 0.5 } },
      hovertemplate: '%{y}<br>Autonomy: %{x:.1f}<extra></extra>'
    },
    {
      y: labels,
      x: occData.map(d => d.management),
      type: 'bar',
      orientation: 'h',
      name: 'Management',
      marker: { color: 'rgba(204, 204, 204, 0.9)', line: { color: '#1A1A1A', width: 0.5 } },
      hovertemplate: '%{y}<br>Management: %{x:.1f}<extra></extra>'
    }
  ], {
    ...plotlyLayout,
    xaxis: {
      ...plotlyLayout.xaxis,
      title: { text: 'Weighted Score (0-100)', font: { size: 12 } },
      range: [0, 100]
    },
    yaxis: {
      ...plotlyLayout.yaxis,
      title: '',
      tickfont: { size: 11 },
      automargin: true
    },
    barmode: 'group',
    legend: {
      orientation: 'h',
      x: 0.5,
      xanchor: 'center',
      y: 1.06,
      font: { family: 'DM Sans', size: 12 }
    },
    margin: { t: 40, r: 30, b: 50, l: 140 }
  }, plotlyConfig);
}

function renderBinned() {
  const el = document.getElementById('plotBinned');
  if (!el || el.offsetHeight === 0) return;

  Plotly.newPlot(el, [{
    x: binnedData.map(d => d.x),
    y: binnedData.map(d => d.y),
    mode: 'lines+markers',
    type: 'scatter',
    line: { color: '#FF4D4D', width: 3, shape: 'spline' },
    marker: { color: '#FF4D4D', size: 10, line: { color: '#1A1A1A', width: 1.5 } },
    fill: 'tozeroy',
    fillcolor: 'rgba(255, 77, 77, 0.06)',
    text: binnedData.map(d => `Decile ${d.d}<br>Job Quality: ${d.x.toFixed(1)}<br>WHO-5: ${d.y.toFixed(1)}`),
    hoverinfo: 'text'
  }], {
    ...plotlyLayout,
    xaxis: { ...plotlyLayout.xaxis, title: { text: 'Mean Job Quality Score', font: { size: 13 } }, range: [35, 100] },
    yaxis: { ...plotlyLayout.yaxis, title: { text: 'Mean WHO-5 Score', font: { size: 13 } }, range: [48, 70] }
  }, plotlyConfig);
}

function renderCoefficients() {
  const el = document.getElementById('plotCoefficients');
  if (!el || el.offsetHeight === 0) return;

  const models = ['Base', '+ Demographics', '+ Work Conditions', '+ Rewards'];
  const coefs = [0.1661, 0.0894, 0.0695, 0.0504];

  Plotly.newPlot(el, [{
    x: models,
    y: coefs,
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#FF4D4D', width: 3 },
    marker: { color: '#FF4D4D', size: 14, symbol: 'circle', line: { color: '#1A1A1A', width: 1.5 } },
    text: coefs.map((c, i) => `${models[i]}<br>Coefficient: ${c.toFixed(4)}<br>p < 0.001`),
    hoverinfo: 'text'
  }, {
    x: models,
    y: coefs,
    type: 'bar',
    marker: { color: 'rgba(255, 77, 77, 0.12)' },
    hoverinfo: 'skip',
    showlegend: false
  }], {
    ...plotlyLayout,
    xaxis: { ...plotlyLayout.xaxis, title: '', tickangle: 0 },
    yaxis: { ...plotlyLayout.yaxis, title: { text: 'Job Quality Coefficient', font: { size: 13 } }, range: [0, 0.2] },
    showlegend: false,
    barmode: 'overlay'
  }, plotlyConfig);
}

function renderDecomposition() {
  const el = document.getElementById('plotDecomposition');
  if (!el || el.offsetHeight === 0) return;

  const components = ['Management Quality', 'Workplace Safety', 'Task Autonomy'];
  const effects = [0.222, 0.043, -0.013];
  const colors = effects.map(e => e >= 0 ? '#FF4D4D' : '#CCCCCC');

  Plotly.newPlot(el, [{
    y: components,
    x: effects,
    type: 'bar',
    orientation: 'h',
    marker: {
      color: colors,
      line: { color: '#1A1A1A', width: 1 }
    },
    text: effects.map(e => e.toFixed(3)),
    textposition: 'outside',
    textfont: { family: 'Syne', size: 16, color: '#1A1A1A' },
    hoverinfo: 'skip'
  }], {
    ...plotlyLayout,
    xaxis: {
      ...plotlyLayout.xaxis,
      title: { text: 'Standardized Coefficient (fully controlled)', font: { size: 13 } },
      range: [-0.05, 0.28],
      zeroline: true,
      zerolinecolor: '#1A1A1A',
      zerolinewidth: 1.5
    },
    yaxis: {
      ...plotlyLayout.yaxis,
      title: '',
      tickfont: { family: 'Syne', size: 14 }
    },
    margin: { t: 30, r: 80, b: 60, l: 180 }
  }, plotlyConfig);
}

// ===== CHART OBSERVER =====

const chartRenderers = {
  plotWho5Hist: renderWho5Hist,
  plotJqHist: renderJqHist,
  plotBinned: renderBinned,
  plotScatter: renderScatter,
  plotSubIndex: renderSubIndex,
  plotCoefficients: renderCoefficients,
  plotDecomposition: renderDecomposition
};

const chartObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      if (chartRenderers[id]) {
        chartRenderers[id]();
        chartObserver.unobserve(entry.target);
      }
    }
  });
}, { root: container, threshold: 0.3 });

document.querySelectorAll('.plot-container[id]').forEach(el => chartObserver.observe(el));

// Handle resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    Object.keys(chartRenderers).forEach(id => {
      const el = document.getElementById(id);
      if (el && el.data) Plotly.Plots.resize(el);
    });
  }, 250);
});
