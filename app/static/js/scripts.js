'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

document.addEventListener("DOMContentLoaded", function () {
    var paymentForm = document.getElementById('payment-form');
    var donationAmountField = document.getElementById('amount');
    var tokenIdField = document.getElementById('token_id');
    var donationOptions = document.querySelectorAll('.js-donation-option');
    var customAmountField = document.getElementById('custom_amount');
    var recipientField = document.getElementById('recipient');
    var stripeKeyField = document.getElementById('stripe-key');

    recipientField.value = paymentForm.getAttribute('data-recipient');
    var donationAmountDisplay = document.getElementById('js-donation-amount-display');

    setupStripe();
    bindDonationAmountDisplay();
    bindDonationOptions();
    bindCustomAmountField();

    function setupStripe() {
        var _base;

        var stripe = Stripe(stripeKeyField.getAttribute('data-key'));
        var elements = stripe.elements();

        var style = {
            base: (_base = {
                color: '#303238',
                fontSize: '16px'
            }, _defineProperty(_base, 'color', "#32325d"), _defineProperty(_base, 'fontSmoothing', 'antialiased'), _defineProperty(_base, '::placeholder', {
                color: '#ccc'
            }), _base),
            invalid: {
                color: '#e5424d',
                ':focus': {
                    color: '#303238'
                }
            }
        };

        var card = elements.create('card', { style: style });

        card.mount('#card-element');

        card.addEventListener('change', function (event) {
            var displayError = document.getElementById('card-errors');

            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });

        var form = paymentForm;

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            stripe.createToken(card).then(function (result) {
                if (result.error) {
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    tokenIdField.value = result.token.id;
                    form.submit();
                }
            }).catch(function (reject) {
                console.warn(reject);
            });
        });
    }

    function bindDonationAmountDisplay() {
        // Get the initial amount from the field
        var initialAmount = donationAmountField.value;
        setDonationAmountDisplay(initialAmount);

        document.addEventListener('amountChange', function (event) {
            setDonationAmountDisplay(event.detail.value, event.detail.convertForDisplay);
            setDonationAmountField(event.detail.value, event.detail.convertForField);
        });
    }

    function setDonationAmountDisplay(amount) {
        var convert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (isNumeric(amount)) {
            donationAmountDisplay.textContent = convert ? '$' + (parseFloat(amount) / 100).toFixed(2) : '$' + parseFloat(amount).toFixed(2);
        }
    }

    function isNumeric(num) {
        return !Number.isNaN(parseFloat(num)) && Number.isFinite(parseFloat(num));
    }

    function setDonationAmountField(amount, convert) {
        donationAmountField.value = convert ? amount * 100 : amount;
    }

    function bindDonationOptions() {
        // When initializing, if there is an option with a matching amount to the initial
        // field amount, select it
        selectMatchingDonationOption(donationAmountField.value);

        document.getElementById('js-donation-options').addEventListener('click', function (event) {
            if (event.target && event.target.matches('div.js-donation-option')) {
                var donationOption = event.target;
                deselectAllDonationOptions();
                donationOption.classList.add('is-selected');

                donationAmountField.value = donationOption.getAttribute('data-amount');
                var amountChangeEvent = new CustomEvent('amountChange', {
                    detail: {
                        value: donationAmountField.value,
                        convertForDisplay: true,
                        convertForField: false
                    }
                });
                document.dispatchEvent(amountChangeEvent);

                // Clear out the custom amount field
                customAmountField.value = '';
            }
        });
    }

    function bindCustomAmountField() {
        customAmountField.addEventListener('focusout', function (event) {
            if (isNumeric(customAmountField.value) && parseFloat(customAmountField.value) > 0) {
                var amountChangeEvent = new CustomEvent('amountChange', {
                    detail: {
                        value: customAmountField.value,
                        convertForDisplay: false,
                        convertForField: true
                    }
                });
                document.dispatchEvent(amountChangeEvent);

                // Deselect any of the preset donation amounts
                deselectAllDonationOptions();
            }
        });
    }

    function deselectAllDonationOptions() {
        donationOptions.forEach(function (elem) {
            elem.classList.remove('is-selected');
        });
    }

    function selectMatchingDonationOption(amount) {
        donationOptions.forEach(function (elem) {
            if (elem.getAttribute('data-amount') == amount) {
                elem.classList.add('is-selected');
                return;
            }
        });
    }
});