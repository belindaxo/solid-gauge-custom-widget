(function() {
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
                                <option value="16px">16</option>
                                <option value="18px" selected>18</option>
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
                            <input id="titleColor" type="color" value="#333333">
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
            <tr>
                <td>Stop 1 (Low to Mid)</td>
                <td><input id="stop1" type="number" step="0.0001" value="0.4875" min="0" max="1"></td>
            </tr>
            <tr>
                <td>Stop 2 (Mid to High)</td>
                <td><input id="stop2" type="number" step="0.0001" value="0.5" min="0" max="1"></td>
            </tr>
            <tr>
                <td>Stop 3 (High to Max)</td>
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
        <input type="submit" style="display:none;">
        </form>
    `; 

    class SolidGaugeAps extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: 'open' });
            this._shadowRoot.appendChild(template.content.cloneNode(true));
            this._shadowRoot.getElementById('form').addEventListener('submit', this._submit.bind(this));
            this._shadowRoot.getElementById('titleSize').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('titleFontStyle').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('titleAlignment').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('titleColor').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('minValue').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('maxValue').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('stop1').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('stop2').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('stop3').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('targetValue').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('invertGauge').addEventListener('change', this._submit.bind(this));

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