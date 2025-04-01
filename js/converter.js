document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const conversionType = document.getElementById('conversionType');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const valueInput = document.getElementById('value');
    const convertBtn = document.getElementById('convertBtn');
    const resultsDiv = document.getElementById('results');
    const originalValue = document.getElementById('originalValue');
    const convertedValue = document.getElementById('convertedValue');
    const errorDiv = document.getElementById('error');

    // Units configuration
    const units = {
        height: [
            { value: 'cm', name: 'Centimeters' },
            { value: 'm', name: 'Meters' },
            { value: 'in', name: 'Inches' },
            { value: 'ft', name: 'Feet' }
        ],
        weight: [
            { value: 'g', name: 'Grams' },
            { value: 'kg', name: 'Kilograms' },
            { value: 'oz', name: 'Ounces' },
            { value: 'lb', name: 'Pounds' }
        ]
    };

    // Conversion factors
    const conversionFactors = {
        height: {
            cm: {
                m: 0.01,
                in: 0.393701,
                ft: 0.0328084
            },
            m: {
                cm: 100,
                in: 39.3701,
                ft: 3.28084
            },
            in: {
                cm: 2.54,
                m: 0.0254,
                ft: 0.0833333
            },
            ft: {
                cm: 30.48,
                m: 0.3048,
                in: 12
            }
        },
        weight: {
            g: {
                kg: 0.001,
                oz: 0.035274,
                lb: 0.00220462
            },
            kg: {
                g: 1000,
                oz: 35.274,
                lb: 2.20462
            },
            oz: {
                g: 28.3495,
                kg: 0.0283495,
                lb: 0.0625
            },
            lb: {
                g: 453.592,
                kg: 0.453592,
                oz: 16
            }
        }
    };

    // Event listeners
    conversionType.addEventListener('change', function () {
        const selectedType = this.value;

        // Reset form
        fromUnit.innerHTML = '<option value="">Select unit</option>';
        toUnit.innerHTML = '<option value="">Select unit</option>';
        valueInput.value = '';
        resultsDiv.style.display = 'none';
        errorDiv.textContent = '';

        if (selectedType) {
            // Enable unit selects
            fromUnit.disabled = false;
            toUnit.disabled = false;

            // Populate unit options
            units[selectedType].forEach(unit => {
                fromUnit.innerHTML += `<option value="${unit.value}">${unit.name} (${unit.value})</option>`;
                toUnit.innerHTML += `<option value="${unit.value}">${unit.name} (${unit.value})</option>`;
            });
        } else {
            fromUnit.disabled = true;
            toUnit.disabled = true;
            valueInput.disabled = true;
            convertBtn.disabled = true;
        }
    });

    fromUnit.addEventListener('change', updateConvertButtonState);
    toUnit.addEventListener('change', updateConvertButtonState);
    valueInput.addEventListener('input', updateConvertButtonState);

    convertBtn.addEventListener('click', convertValue);

    function updateConvertButtonState() {
        const isReady = conversionType.value &&
            fromUnit.value &&
            toUnit.value &&
            valueInput.value &&
            !isNaN(valueInput.value);

        valueInput.disabled = !(conversionType.value && fromUnit.value && toUnit.value);
        convertBtn.disabled = !isReady;
    }

    function convertValue() {
        const type = conversionType.value;
        const from = fromUnit.value;
        const to = toUnit.value;
        const value = parseFloat(valueInput.value);

        // Validate
        if (from === to) {
            showError("Please select different units for conversion.");
            return;
        }

        if (isNaN(value)) {
            showError("Please enter a valid number.");
            return;
        }

        try {
            // Show loading state
            convertBtn.disabled = true;
            convertBtn.textContent = 'Converting...';

            // Perform conversion
            const result = performConversion(type, from, to, value);

            // Display results
            originalValue.textContent = `${value} ${getUnitName(type, from)} =`;
            convertedValue.textContent = `${result.toFixed(2)} ${getUnitName(type, to)}`;
            resultsDiv.style.display = 'block';
            errorDiv.textContent = '';
        } catch (error) {
            showError("Conversion failed. Please try again.");
            console.error("Conversion error:", error);
        } finally {
            convertBtn.disabled = false;
            convertBtn.textContent = 'Convert';
        }
    }

    function performConversion(type, from, to, value) {
        // Get the conversion factor
        const factor = conversionFactors[type][from][to];

        if (factor === undefined) {
            throw new Error("Conversion not supported");
        }

        return value * factor;
    }

    function getUnitName(type, unit) {
        const unitObj = units[type].find(u => u.value === unit);
        return unitObj ? unitObj.name : unit;
    }

    function showError(message) {
        errorDiv.textContent = message;
        resultsDiv.style.display = 'none';
    }
});