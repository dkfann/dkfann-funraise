document.addEventListener("DOMContentLoaded", () => {
    const paymentForm = document.getElementById('payment-form');
    const donationAmountField = document.getElementById('amount');
    const tokenIdField = document.getElementById('token_id');
    const donationOptions = document.querySelectorAll('.js-donation-option');
    const customAmountField = document.getElementById('custom_amount');
    const recipientField = document.getElementById('recipient');
    const stripeKeyField = document.getElementById('stripe-key');

    recipientField.value = paymentForm.getAttribute('data-recipient');
    let donationAmountDisplay = document.getElementById('js-donation-amount-display');

    setupStripe();
    bindDonationAmountDisplay();
    bindDonationOptions();
    bindCustomAmountField();

    function setupStripe() {
        const stripe = Stripe(stripeKeyField.getAttribute('data-key'));
        const elements = stripe.elements();

        const style = {
            base: {
                color: '#303238',
                fontSize: '16px',
                color: "#32325d",
                fontSmoothing: 'antialiased',
                '::placeholder': {
                  color: '#ccc',
                },
            },
            invalid: {
                color: '#e5424d',
                ':focus': {
                  color: '#303238',
                },
            },
        };

        const card = elements.create('card', { style });

        card.mount('#card-element');

        card.addEventListener('change', event => {
            const displayError = document.getElementById('card-errors');

            if (event.error) {
                displayError.textContent = event.error.message;
            }
            else {
                displayError.textContent = '';
            }
        });

        const form = paymentForm;

        form.addEventListener('submit', event => {
            event.preventDefault();

            stripe.createToken(card)
                .then(result => {
                    if (result.error) {
                        const errorElement = document.getElementById('card-errors');
                        errorElement.textContent = result.error.message;
                    }
                    else {
                        tokenIdField.value = result.token.id;
                        form.submit();
                    }
                })
                .catch(reject => {
                    console.warn(reject);
                });
        });
    }

    function bindDonationAmountDisplay() {
        // Get the initial amount from the field
        const initialAmount = donationAmountField.value;
        setDonationAmountDisplay(initialAmount);

        document.addEventListener('amountChange', event => {
            setDonationAmountDisplay(event.detail.value, event.detail.convertForDisplay);
            setDonationAmountField(event.detail.value, event.detail.convertForField);
        });
    }

    function setDonationAmountDisplay(amount, convert=true) {
        if (isNumeric(amount)) {
            donationAmountDisplay.textContent = convert
                ? `$${(parseFloat(amount) / 100).toFixed(2)}`
                : `$${parseFloat(amount).toFixed(2)}`;
        }
    }

    function isNumeric(num) {
        return !Number.isNaN(parseFloat(num)) && Number.isFinite(parseFloat(num));
    }

    function setDonationAmountField(amount, convert) {
        donationAmountField.value = convert
            ? amount * 100
            : amount;
    }

    function bindDonationOptions() {
        // When initializing, if there is an option with a matching amount to the initial
        // field amount, select it
        selectMatchingDonationOption(donationAmountField.value);

        document.getElementById('js-donation-options').addEventListener('click', event => {
            if (event.target && event.target.matches('div.js-donation-option')) {
                const donationOption = event.target;
                deselectAllDonationOptions();
                donationOption.classList.add('is-selected');

                donationAmountField.value = donationOption.getAttribute('data-amount');
                const amountChangeEvent = new CustomEvent('amountChange', {
                    detail: {
                        value: donationAmountField.value,
                        convertForDisplay: true,
                        convertForField: false,
                    },
                });
                document.dispatchEvent(amountChangeEvent);

                // Clear out the custom amount field
                customAmountField.value = '';
            }
        });
    }

    function bindCustomAmountField() {
        customAmountField.addEventListener('focusout', event => {
            if (isNumeric(customAmountField.value) && parseFloat(customAmountField.value) > 0) {
                const amountChangeEvent = new CustomEvent('amountChange', {
                    detail: {
                        value: customAmountField.value,
                        convertForDisplay: false,
                        convertForField: true,
                    },
                });
                document.dispatchEvent(amountChangeEvent);

                // Deselect any of the preset donation amounts
                deselectAllDonationOptions();
            }
        });
    }

    function deselectAllDonationOptions() {
        donationOptions.forEach(elem => {
            elem.classList.remove('is-selected');
        });
    }

    function selectMatchingDonationOption(amount) {
        donationOptions.forEach(elem => {
            if (elem.getAttribute('data-amount') == amount) {
                elem.classList.add('is-selected');
                return;
            }
        });
    }
});