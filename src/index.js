import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);
import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);
import SolidGauge from 'highcharts/modules/solid-gauge';
SolidGauge(Highcharts);

const parseMetadata = metadata => {
    const { dimensions: dimensionsMap, mainStructureMembers: measuresMap } = metadata;
    const dimensions = [];
    for (const key in dimensionsMap) {
        const dimension = dimensionsMap[key];
        dimensions.push({ key, ...dimension });
    }
    const measures = [];
    for (const key in measuresMap) {
        const measure = measuresMap[key];
        measures.push({ key, ...measure });
    }
    return { dimensions, measures, dimensionsMap, measuresMap };
}

(function() {
    class SolidGauge extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = `
                <div id="container" style="width:100%; height:100%;"></div>
            `;
        }

        onCustomWidgetResize(width, height) {
            this._renderChart();
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            this._renderChart();
        }

        onCustomWidgetDestroy() {
            if (this._chart) {
                this._chart.destroy();
                this._chart = null;
            }
        }

        static get observedAttributes() {
            return [
                'chartTitle', 'titleSize', 'titleFontStyle', 'titleAlignment', 'titleColor',    // Title Properties
                'minValue', 'maxValue', 'stop1', 'stop2', 'stop3', 'targetValue'                // Gauge Properties
            ];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                this[name] = newValue;
                this._renderChart();
            }
        }

        _renderChart() {
            const dataBinding = this.dataBinding;

            if (!dataBinding || dataBinding.state !== 'success') {
                return;
            }

            const { data, metadata } = dataBinding;
            const { dimensions, measures } = parseMetadata(metadata);


            const categoryData = [];

            const series = measures.map(measure => {
                return {
                    id: measure.id,
                    name: measure.label,
                    data: [],
                    key: measure.key,
                    dataLabels: {
                        formatter: function() {
                            return '<span style="font-size:25px">' + Highcharts.numberFormat(this.y * 100, 1) + '%' + '</span>';
                        }
                    },
                    type: 'solidgauge'
                }
            });

            data.forEach(row => {
                categoryData.push(dimensions.map(dimension => {
                    return row[dimension.key].label;
                }).join('/'));
                series.forEach(series => {
                    series.data.push(row[series.key].raw);
                });
            });

            const chartOptions = {
                chart: {
                    type: 'solidgauge',
                },
                title: {
                    text: this.chartTitle || "",
                    align: this.titleAlignment || "left",
                    style: {
                        fontSize: this.titleSize || "18px",
                        fontStyle: this.titleFontStyle || "bold",
                        color: this.titleColor || "#333333"
                    }
                },
                pane: {
                    center: ['50%', '85%'],
                    size: '140%',
                    startAngle: -90,
                    endAngle: 90,
                    background: {
                        backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#fafafa',
                        borderRadius: 5,
                        innerRadius: '60%',
                        outerRadius: '100%',
                        shape: 'arc'
                    }
                },
                tooltip: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                yAxis: {
                    min: parseFloat(this.minValue) || -1,
                    max: parseFloat(this.maxValue) || 1,
                    stops: [
                        [parseFloat(this.stop1) || 0.1, '#DF5353'], // red
                        [parseFloat(this.stop2) || 0.5, '#DDDF0D'], // yellow
                        [parseFloat(this.stop3) || 0.9, '#55BF3B'] // green
                    ],
                    lineWidth: 0,
                    tickWidth: 0,
                    minorTickInterval: null,
                    tickAmount: 2,
                    tickPositions: [this.targetValue] || [0],
                    tickWidth: 3,
                    tickLength: 105,
                    title: {
                        y: -70
                    },
                    labels: {
                        enabled: false
                    }
                },
                plotOptions: {
                    solidgauge: {
                        borderRadius: 3,
                        dataLabels: {
                            y: 5, 
                            borderWidth: 0,
                            useHTML: true
                        }
                    }
                },
                series
            }
            this._chart = Highcharts.chart(this.shadowRoot.getElementById('container'), chartOptions);
        }
    }
    customElements.define('com-sap-sample-solidgauge', SolidGauge);
})();