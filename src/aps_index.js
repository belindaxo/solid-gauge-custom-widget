(function () {
    let template = document.createElement('template');
    template.innerHTML = `
        <form id="form">
        <legend style="font-weight: bold;font-size: 18px;"> Font </legend>
        <table>
            <tr>
                <td>Chart Title</td>
            </tr>
            <tr>
                <td><input id="chartTitle" type="text"></td>
            </tr>
            <tr>
                <table>
                    <tr>
                        <td>Size</td>
                        <td>Font Style</td>
                        <td>Alignment</td>
                        <td>Color</td>
                    </tr>
                    <tr>
                        <td>
                            <select id="titleSize">
                                <option value="10px">10</option>
                                <option value="12px">12</option>
                                <option value="14px">14</option>
                                <option value="16px" selected>16</option>
                                <option value="18px">18</option>
                                <option value="20px">20</option>
                                <option value="22px">22</option>
                                <option value="24px">24</option>
                                <option value="32px">32</option>
                                <option value="48px">48</option>
                            </select>
                        </td>
                        <td>
                            <select id="titleFontStyle">
                                <option value="normal">Normal</option>
                                <option value="bold" selected>Bold</option>
                            </select>
                        </td>
                        <td>
                            <select id="titleAlignment">
                                <option value="left" selected>Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                            </select>
                        </td>
                        <td>
                            <input id="titleColor" type="color" value="#004B8D">
                        </td>
                    </tr>
                </table>
            </tr>
            <legend style="font-weight: bold;font-size: 18px;"> Label Format </legend>
            <tr>
                <table>
                    <tr>
                        <td>Size</td>
                        <td>Label Format</td>
                    </tr>
                    <tr>
                        <td>
                            <select id="labelSize">
                                <option value="10px">10</option>
                                <option value="12px">12</option>
                                <option value="14px" selected>14</option>
                                <option value="16px">16</option>
                                <option value="18px">18</option>
                                <option value="20px">20</option>
                                <option value="22px">22</option>
                                <option value="24px">24</option>
                                <option value="32px">32</option>
                                <option value="48px">48</option>
                            </select>
                        </td>
                        <td>
                            <select id="labelFormat">
                                <option value="percentChange" selected>Percent (Change)</option>
                                <option value="percentTotal">Percent (Total)</option>
                                <option value="unformatted">Unformatted</option>
                            </select>
                        </td>
                    </tr>
                </table>
            </tr> 
        </table>
        <legend style="font-weight: bold;font-size: 18px;"> Gauge Settings </legend>
        <table>
        <tr>
            <td>Minimum Value</td>
            <td><input id="minValue" type="number" step="0.01" value="-2"></td>
        </tr>
        <tr>
            <td>Maximum Value</td>
            <td><input id="maxValue" type="number" step="0.01" value="2"></td>
        </tr>
        </table>
        <table>
            <tr>
                Use the following formula to normalize stops to range [0, 1]:
            </tr>
            <tr>
                <math display="block" style="margin-top: 10px; margin-bottom: 10px;">
                    <mfrac>
                        <msup>
                            <mi>value - min</mi>
                        </msup>
                        <mn>max - min</mn>
                    </mfrac>
                </math>
            </tr>
            <tr>
                <td>Stop 1</td>
                <td><input id="stop1" type="number" step="0.0001" value="0.475" min="0" max="1"></td>
            </tr>
            <tr>
                <td>Stop 2</td>
                <td><input id="stop2" type="number" step="0.0001" value="0.5" min="0" max="1"></td>
            </tr>
            <tr>
                <td>Stop 3</td>
                <td><input id="stop3" type="number" step="0.0001" value="0.5" min="0" max="1"></td>
            </tr>
            <tr>
                <td>Target Indicator Value</td>
                <td><input id="targetValue" type="number" step="0.01" value="0"></td>
            </tr>
            <tr>
                <td>
                    <input id="invertGauge" type="checkbox">
                    <label for="invertGauge">Invert Gauge</label>
                </td>
            </tr>
        </table>
        <tr>
            <button id="resetDefaults" type="button" style="margin-top: 10px; margin-bottom: 10px;">Reset to Default</button>
        </tr>
        <input type="submit" style="display:none;">
        </form>
    `;

    class SolidGaugeAps extends HTMLElement {
        constructor() {
            super();

            const DEFAULTS = {
                chartTitle: '',
                titleSize: '16px',
                titleFontStyle: 'bold',
                titleAlignment: 'left',
                titleColor: '#004b8d',
                chartSubtitle: '',
                labelSize: '14px',
                labelFormat: 'percentChange',
                minValue: -2,
                maxValue: 2,
                stop1: 0.475,
                stop2: 0.5,
                stop3: 0.5,
                targetValue: 0,
                invertGauge: false
            }

            this._shadowRoot = this.attachShadow({ mode: 'open' });
            this._shadowRoot.appendChild(template.content.cloneNode(true));
            this._shadowRoot.getElementById('form').addEventListener('submit', this._submit.bind(this));
            this._shadowRoot.getElementById('titleSize').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('titleFontStyle').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('titleAlignment').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('titleColor').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('labelSize').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('labelFormat').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('minValue').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('maxValue').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('stop1').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('stop2').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('stop3').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('targetValue').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('invertGauge').addEventListener('change', () => {
                const min = parseFloat(this._shadowRoot.getElementById('minValue').value);
                const max = parseFloat(this._shadowRoot.getElementById('maxValue').value);

                const stop1Input = this._shadowRoot.getElementById('stop1');
                const stop2Input = this._shadowRoot.getElementById('stop2');
                const stop3Input = this._shadowRoot.getElementById('stop3');

                const isInverted = this._shadowRoot.getElementById('invertGauge').checked;

                if (isInverted) {
                    // Inverted: Green <= 0%, Yellow 0–10%, Red >10%
                    const stop1 = (0 - min) / (max - min);     // 0 → 0.5
                    const stop2 = stop1;                       // 0 → 0.5
                    const stop3 = (0.1 - min) / (max - min);   // 0.1 → 0.525

                    stop1Input.value = stop1;
                    stop2Input.value = stop2;
                    stop3Input.value = stop3;
                } else {
                    // Normal (non-inverted) stops: Red < -10%, Yellow -10%–0%, Green >= 0%
                    const stop1 = (-0.1 - min) / (max - min);  // -0.1 → 0.475
                    const stop2 = (0 - min) / (max - min);     // 0 → 0.5
                    const stop3 = stop2;                       // 0 → 0.5

                    stop1Input.value = stop1;
                    stop2Input.value = stop2;
                    stop3Input.value = stop3;
                }

                this._submit(new Event('submit'));
            });

            // Reset button logic
            this._shadowRoot.getElementById('resetDefaults').addEventListener('click', () => {
                for (const key in DEFAULTS) {
                    if (key === 'chartTitle') {
                        continue; // Skip this field
                    }

                    const element = this._shadowRoot.getElementById(key);
                    if (!element) continue; // Skip if element not found

                    if (typeof DEFAULTS[key] === 'boolean') {
                        element.checked = DEFAULTS[key];
                    } else {
                        element.value = DEFAULTS[key];
                    }
                }
                this._submit(new Event('submit')); // Trigger submit event to update properties
            });

        }

        _submit(e) {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('propertiesChanged', {
                detail: {
                    properties: {
                        chartTitle: this.chartTitle,
                        titleSize: this.titleSize,
                        titleFontStyle: this.titleFontStyle,
                        titleAlignment: this.titleAlignment,
                        titleColor: this.titleColor,
                        labelSize: this.labelSize,
                        labelFormat: this.labelFormat,
                        minValue: this.minValue,
                        maxValue: this.maxValue,
                        stop1: this.stop1,
                        stop2: this.stop2,
                        stop3: this.stop3,
                        targetValue: this.targetValue,
                        invertGauge: this.invertGauge
                    }
                }
            }));
        }

        get chartTitle() {
            return this._shadowRoot.getElementById('chartTitle').value;
        }

        set chartTitle(value) {
            this._shadowRoot.getElementById('chartTitle').value = value;
        }

        get titleSize() {
            return this._shadowRoot.getElementById('titleSize').value;
        }

        set titleSize(value) {
            this._shadowRoot.getElementById('titleSize').value = value;
        }

        get titleFontStyle() {
            return this._shadowRoot.getElementById('titleFontStyle').value;
        }

        set titleFontStyle(value) {
            this._shadowRoot.getElementById('titleFontStyle').value = value;
        }

        get titleAlignment() {
            return this._shadowRoot.getElementById('titleAlignment').value;
        }

        set titleAlignment(value) {
            this._shadowRoot.getElementById('titleAlignment').value = value;
        }

        get titleColor() {
            return this._shadowRoot.getElementById('titleColor').value;
        }

        set titleColor(value) {
            this._shadowRoot.getElementById('titleColor').value = value;
        }

        get labelSize() {
            return this._shadowRoot.getElementById('labelSize').value;
        }

        set labelSize(value) {
            this._shadowRoot.getElementById('labelSize').value = value;
        }

        get labelFormat() {
            return this._shadowRoot.getElementById('labelFormat').value;
        }

        set labelFormat(value) {
            this._shadowRoot.getElementById('labelFormat').value = value;
        }

        get minValue() {
            return this._shadowRoot.getElementById('minValue').value;
        }

        set minValue(value) {
            this._shadowRoot.getElementById('minValue').value = value;
        }

        get maxValue() {
            return this._shadowRoot.getElementById('maxValue').value;
        }

        set maxValue(value) {
            this._shadowRoot.getElementById('maxValue').value = value;
        }

        get stop1() {
            return this._shadowRoot.getElementById('stop1').value;
        }

        set stop1(value) {
            this._shadowRoot.getElementById('stop1').value = value;
        }

        get stop2() {
            return this._shadowRoot.getElementById('stop2').value;
        }

        set stop2(value) {
            this._shadowRoot.getElementById('stop2').value = value;
        }

        get stop3() {
            return this._shadowRoot.getElementById('stop3').value;
        }

        set stop3(value) {
            this._shadowRoot.getElementById('stop3').value = value;
        }

        get targetValue() {
            return this._shadowRoot.getElementById('targetValue').value;
        }

        set targetValue(value) {
            this._shadowRoot.getElementById('targetValue').value = value;
        }

        get invertGauge() {
            return this._shadowRoot.getElementById('invertGauge').checked;
        }

        set invertGauge(value) {
            this._shadowRoot.getElementById('invertGauge').checked = value;
        }
    }
    customElements.define('com-sap-sample-solidgauge-aps', SolidGaugeAps);
})();