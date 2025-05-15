/**
 * Module dependencies for Highcharts Solid Gauge chart.
 */
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);
import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);
import SolidGauge from 'highcharts/modules/solid-gauge';
SolidGauge(Highcharts);

/**
 * Parses metadata into structured dimensions and measures.
 * @param {Object} metadata - The metadata object from SAC data binding.
 * @returns {Object} An object containing parsed dimensions, measures, and their maps.
 */
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

(function () {
    /**
    * Custom Web Component for rendering a 3D Funnel Chart in SAP Analytics Cloud.
    * @extends HTMLElement
    */
    class SolidGauge extends HTMLElement {
        /**
         * Initializes the shadow DOM, styles, and chart container.
         */
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });

            // Create a CSSStyleSheet for the shadow DOM
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(`
                @font-face {
                    font-family: '72';
                    src: url('../fonts/72-Regular.woff2') format('woff2');
                }
                #container {
                    width: 100%;
                    height: 100%;
                    font-family: '72';
                }
            `);

            // Apply the stylesheet to the shadow DOM
            this.shadowRoot.adoptedStyleSheets = [sheet];


            this.shadowRoot.innerHTML = `
                <div id="container"></div>
            `;
        }

        /**
         * Called when the widget is resized.
         * @param {number} width - New width of the widget.
         * @param {number} height - New height of the widget.
         */
        onCustomWidgetResize(width, height) {
            this._renderChart();
        }

        /**
         * Called after widget properties are updated.
         * @param {Object} changedProperties - Object containing changed attributes.
         */
        onCustomWidgetAfterUpdate(changedProperties) {
            this._renderChart();
        }

        /**
         * Called when the widget is destroyed. Cleans up chart instance.
         */
        onCustomWidgetDestroy() {
            if (this._chart) {
                this._chart.destroy();
                this._chart = null;
            }
        }

        /**
         * Specifies which attributes should trigger re-rendering on change.
         * @returns {string[]} An array of observed attribute names.
         */
        static get observedAttributes() {
            return [
                'chartTitle', 'titleSize', 'titleFontStyle', 'titleAlignment', 'titleColor', "labelSize",   // Font Properties
                'minValue', 'maxValue', 'stop1', 'stop2', 'stop3', 'targetValue'                            // Gauge Properties
            ];
        }

        /**
         * Called when an observed attribute changes.
         * @param {string} name - The name of the changed attribute.
         * @param {string} oldValue - The old value of the attribute.
         * @param {string} newValue - The new value of the attribute.
         */
        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                this[name] = newValue;
                this._renderChart();
            }
        }

        /**
         * Processes measures into series data.
         * @param {Array} measures - The measures from metadata.
         * @returns {Array} Processed series data.
         */
        _processSeriesData(measures) {
            return measures.map(measure => ({
                id: measure.id,
                name: measure.label,
                data: [],
                key: measure.key,
                type: 'solidgauge'
            }));
        }

        /**
         * Formats the data label for the gauge.
         * @param {boolean} isInverted - Indicates if the gauge is inverted.
         * @returns {Function} A function to format the data label.
         */
        _formatDataLabel(isInverted) {
            return function () {
                const currentValue = this.y;
                const color = (currentValue >= 0 && !isInverted) || (currentValue < 0 && isInverted) ? '#55BF3B' : currentValue == 0 ? '#000000' : '#DF5353';
                const deltaSign = currentValue > 0 ? '+' : '';
                const triangle = currentValue > 0 ? '\u25B2' : currentValue < 0 ? '\u25BC' : '';
                return `
                    <span style="color: ${color}">${triangle} ${deltaSign}${Highcharts.numberFormat(currentValue * 100, 1)}%</span>
                `;
            }
        }

        /**
         * Sets the stops for the gauge color gradient based on the invertGauge property.
         * @returns {Array} Stops for the gauge color gradient.
         */
        _setStops() {
            let stops = [];
            if (!this.invertGauge) {
                stops = [
                    [parseFloat(this.stop1) || 0.4875, '#DF5353'], // red
                    [parseFloat(this.stop2) || 0.5, '#DDDF0D'], // yellow
                    [parseFloat(this.stop3) || 0.5, '#55BF3B']  // green
                ]
            } else {
                stops = [
                    [parseFloat(this.stop1) || 0.4875, '#55BF3B'], // green
                    [parseFloat(this.stop2) || 0.5, '#DDDF0D'], // yellow
                    [parseFloat(this.stop3) || 0.5, '#DF5353']  // red
                ]
            }
            return stops;
        }

        _renderChart() {
            const dataBinding = this.dataBinding;

            if (!dataBinding || dataBinding.state !== 'success') {
                return;
            }

            const { data, metadata } = dataBinding;
            const { dimensions, measures } = parseMetadata(metadata);


            const categoryData = [];

            const series = this._processSeriesData(measures);

            data.forEach(row => {
                categoryData.push(dimensions.map(dimension => {
                    return row[dimension.key].label;
                }).join('/'));
                series.forEach(series => {
                    series.data.push(row[series.key].raw);
                });
            });

            // Determine the stops array based on the invertGauge property
            const stops = this._setStops();
            const isInverted = this.invertGauge;

            const chartOptions = {
                chart: {
                    type: 'solidgauge',
                    style: {
                        fontFamily: "'72', sans-serif"
                    }
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
                    min: parseFloat(this.minValue) || -2,
                    max: parseFloat(this.maxValue) || 2,
                    stops,
                    lineWidth: 0,
                    tickWidth: 0,
                    minorTickInterval: null,
                    tickAmount: 2,
                    title: {
                        y: -70
                    },
                    labels: {
                        enabled: false
                    },
                    plotLines: [{
                        value: parseFloat(this.targetValue) || 0, //target value
                        color: '#000000',
                        width: 2,
                        zIndex: 5, //ensure it's on top of the gauge
                        dashStyle: 'solid',
                    }]
                },
                plotOptions: {
                    solidgauge: {
                        borderRadius: 3,
                        dataLabels: {
                            y: 0,
                            borderWidth: 0,
                            useHTML: true,
                            style: {
                                fontSize: this.labelSize || "16px"
                            },
                            formatter: this._formatDataLabel(isInverted),
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