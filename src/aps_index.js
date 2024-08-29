(function() {
    let template = document.createElement('template');
    template.innerHTML = `
        <form id="form">
        <legend style="font-weight: bold;font-size: 18px;"> Gauge Settings </legend>
        <table>
            <tr>
                <td>Minimum Value</td>
                <td><input id="minValue" type="number" step="0.01" value="-1"></td>
            </tr>
            <tr>
                <td>Maximum Value</td>
                <td><input id="maxValue" type="number" step="0.01" value="1"></td>
            </tr>
            <tr>
                <td>Stop 1 (Low to Mid)</td>
                <td><input id="stop1" type="number" step="0.01" value="0.1"></td>
            </tr>
            <tr>
                <td>Stop 2 (Mid to High)</td>
                <td><input id="stop2" type="number" step="0.01" value="0.5"></td>
            </tr>
            <tr>
                <td>Stop 3 (High to Max)</td>
                <td><input id="stop3" type="number" step="0.01" value="0.9"></td>
            </tr>
        </table>
        <input type="submit" style="display:none;">
        </form>
    `;

    class SolidGaugeAps extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            this._shadowRoot.getElementById('form').addEventListener('submit', this._submit.bind(this));
        }

        _submit(e) {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('propertiesChanged', {
                detail: {
                    properties: {
                        minValue: this.minValue,
                        maxValue: this.maxValue,
                        stop1: this.stop1,
                        stop2: this.stop2,
                        stop3: this.stop3
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
    }
    customElements.define('com-sap-sample-solidgauge-aps', SolidGaugeAps);
})();