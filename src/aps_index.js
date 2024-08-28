(function() {
    let template = document.createElement("template");
    template.innerHTML = `
        <form id="form">
            <legend style="font-weight: bold;font-size: 18px;">Gauge Settings</legend>
            <table>
                <tr>
                    <td>Minimum Value</td>
                    <td><input id="minValue" type="number" value="0"></td>
                </tr>
                <tr>
                    <td>Maximum Value</td>
                    <td><input id="maxValue" type="number" value="100"></td>
                </tr>
                <tr>
                    <td>Flip Gauge</td>
                    <td><input id="flipGauge" type="checkbox"></td>
                </tr>
            </table>
            <legend style="font-weight: bold;font-size: 18px;">Thresholds</legend>
            <table>
                <tr>
                    <td>Threshold 1 (Low to Mid)</td>
                    <td><input id="threshold1" type="number" value="33"></td>
                </tr>
                <tr>
                    <td>Threshold 2 (Mid to High)</td>
                    <td><input id="threshold2" type="number" value="66"></td>
                </tr>
                <tr>
                    <td>Threshold 3 (High)</td>
                    <td><input id="threshold3" type="number" value="100"></td>
                </tr>
            </table>
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
                                    <option value="left">Left</option>
                                    <option value="center" selected>Center</option>
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
            <table>
                <tr>
                    <td>Chart Subtitle</td>
                </tr>
                <tr>
                    <td><input id="chartSubtitle" type="text"></td>
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
                                <select id="subtitleSize">
                                    <option value="10px">10</option>
                                    <option value="12px" selected>12</option>
                                    <option value="14px">14</option>
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
                                <select id="subtitleFontStyle">
                                    <option value="normal" selected>Normal</option>
                                    <option value="italic">Italic</option>
                                </select>
                            </td>
                            <td>
                                <select id="subtitleAlignment">
                                    <option value="left">Left</option>
                                    <option value="center" selected>Center</option>
                                    <option value="right">Right</option>
                                </select>
                            </td>
                            <td>
                                <input id="subtitleColor" type="color" value="#666666">
                            </td>
                        </tr>
                    </table>
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
            this._shadowRoot.getElementById('minValue').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('maxValue').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('flipGauge').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('threshold1').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('threshold2').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('threshold3').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('titleSize').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('titleFontStyle').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('titleAlignment').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('titleColor').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('subtitleSize').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('subtitleFontStyle').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('subtitleAlignment').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('subtitleColor').addEventListener('change', this._submit.bind(this));
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
                        chartSubtitle: this.chartSubtitle,
                        subtitleSize: this.subtitleSize,
                        subtitleFontStyle: this.subtitleFontStyle,
                        subtitleAlignment: this.subtitleAlignment,
                        subtitleColor: this.subtitleColor,
                        minValue: this.minValue,
                        maxValue: this.maxValue,
                        flipGauge: this.flipGauge,
                        threshold1: this.threshold1,
                        threshold2: this.threshold2,
                        threshold3: this.threshold3
                    }
                }
            }));
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
    
        get flipGauge() {
            return this._shadowRoot.getElementById('flipGauge').checked;
        }
    
        set flipGauge(value) {
            this._shadowRoot.getElementById('flipGauge').checked = value;
        }
    
        get threshold1() {
            return this._shadowRoot.getElementById('threshold1').value;
        }
    
        set threshold1(value) {
            this._shadowRoot.getElementById('threshold1').value = value;
        }
    
        get threshold2() {
            return this._shadowRoot.getElementById('threshold2').value;
        }
    
        set threshold2(value) {
            this._shadowRoot.getElementById('threshold2').value = value;
        }
    
        get threshold3() {
            return this._shadowRoot.getElementById('threshold3').value;
        }
    
        set threshold3(value) {
            this._shadowRoot.getElementById('threshold3').value = value;
        }

        set chartTitle(value) {
            this._shadowRoot.getElementById('chartTitle').value = value;
        }

        get chartTitle() {
            return this._shadowRoot.getElementById('chartTitle').value;
        }

        set titleSize(value) {
            this._shadowRoot.getElementById('titleSize').value = value;
        }

        get titleSize() {
            return this._shadowRoot.getElementById('titleSize').value;
        }

        set titleFontStyle(value) {
            this._shadowRoot.getElementById('titleFontStyle').value = value;
        }

        get titleFontStyle() {
            return this._shadowRoot.getElementById('titleFontStyle').value;
        }

        set titleAlignment(value) {
            this._shadowRoot.getElementById('titleAlignment').value = value;
        }

        get titleAlignment() {
            return this._shadowRoot.getElementById('titleAlignment').value;
        }

        set titleColor(value) {
            this._shadowRoot.getElementById('titleColor').value = value;
        }

        get titleColor() {
            return this._shadowRoot.getElementById('titleColor').value;
        }

        set chartSubtitle(value) {
            this._shadowRoot.getElementById('chartSubtitle').value = value;
        }

        get chartSubtitle() {
            return this._shadowRoot.getElementById('chartSubtitle').value;
        }

        set subtitleSize(value) {
            this._shadowRoot.getElementById('subtitleSize').value = value;
        }

        get subtitleSize() {
            return this._shadowRoot.getElementById('subtitleSize').value;
        }

        set subtitleFontStyle(value) {
            this._shadowRoot.getElementById('subtitleFontStyle').value = value;
        }

        get subtitleFontStyle() {
            return this._shadowRoot.getElementById('subtitleFontStyle').value;
        }

        set subtitleAlignment(value) {
            this._shadowRoot.getElementById('subtitleAlignment').value = value;
        }

        get subtitleAlignment() {
            return this._shadowRoot.getElementById('subtitleAlignment').value;
        }

        set subtitleColor(value) {
            this._shadowRoot.getElementById('subtitleColor').value = value;
        }

        get subtitleColor() {
            return this._shadowRoot.getElementById('subtitleColor').value;
        }
    }
    customElements.define('com-sap-sample-solidgauge-aps', SolidGaugeAps);
})();




