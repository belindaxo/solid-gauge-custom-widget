import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);
import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);
import SolidGauge from 'highcharts/modules/solid-gauge';
SolidGauge(Highcharts);

var parseMetadata = metadata => {
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
                <div id="container" style="width: 100%; height: 100%;></div>
            `;
        }

    onCustomWidgetResize(width, height) {
        this._renderChart();
    }

    onCustomWidgetAfterUpdate(changedProperties) {
        this._renderChart();
    }

    onCustomWidgetDestroy(){
        if (this._chart) {
            this._chart.destroy();
            this._chart = null;
        }
    }

    static get observedAttributes() {
        return [
            'chartTitle', 'titleSize', 'titleFontStyle', 'titleAlignment', 'titleColor',
            'subtitle', 'subtitleSize', 'subtitleFontStyle', 'subtitleAlignment', 'subtitleColor',
            'minValue', 'maxValue', 'flipGauge', 'threshold1', 'threshold2', 'threshold3'
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
                if (this._chart) {
                    this._chart.destroy();
                    this._chart = null;
                }
                return;
            }

            const { data, metadata } = dataBinding;
            const { measures } = parseMetadata(metadata);
            if (!measures.length) {
                if (this._chart) {
                    this._chart.destroy();
                    this._chart = null;
                }
                return;
            }

            const series = measures.map(measure => ({
                name: measure.label,
                data: [data[0][measure.key].raw],
                tooltip: {
                    valueSuffix: '%'
                }
            }));

            const minValue = parseFloat(this.minValue) || 0;
            const maxValue = parseFloat(this.maxValue) || 100;
            const flipGauge = this.flipGauge === 'true';

            const thresholds =[
                [minValue, this.threshold1 ? parseFloat(this.threshold1): minValue + (maxValue - minValue) * 0.33, flipGauge ? '#DF5353' : '#55BF3B'], // red/green
                [this.threshold1 ? parseFloat(this.threshold1): minValue + (maxValue - minValue) * 0.33, this.threshold2 ? parseFloat(this.threshold2): minValue + (maxValue - minValue) * 0.66, '#DDDF0D'], // yellow
                [this.threshold2 ? parseFloat(this.threshold2): minValue + (maxValue - minValue) * 0.66, maxValue, flipGauge ? '#55BF3B' : '#DF5353'] // green/red
            ]

            const chartOptions = {
                chart: {
                    type: 'solidgauge'
                },
                title: {
                    text: this.chartTitle || '',
                    align: this.titleAlignment || 'center',
                    style: {
                        fontSize: this.titleSize || '20px',
                        fontWeight: this.titleFontStyle || 'bold',
                        color: this.titleColor || '#333333'
                    }
                },
                pane: {
                    center: ['50%', '85%'],
                    size: '140%',
                    startAngle: flipGauge ? 90 : -90,
                    endAngle: flipGauge ? -90 : 90,
                    background: {
                        backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#fafafa',
                        borderRadius: 5,
                        innerRadius: '60%',
                        outerRadius: '100%',
                        shape: 'arc'
                    }
                },
                yAxis: {
                    min: minValue,
                    max: maxValue,
                    stops: thresholds,
                    lineWidth: 0,
                    minorTickInterval: null,
                    tickAmount: 2,
                    labels: {
                        y: 10,
                        format: '{value}%'
                    }
                },
                plotOptions: {
                    solidgauge: {
                        dataLabels: {
                            y: -30,
                            borderWidth: 0,
                            useHTML: true,
                            format: '<div style="text-align:center"><span style="font-size:25px">{y}%</span></div>' // Centered numeric indicator 
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