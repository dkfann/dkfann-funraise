from flask import render_template, request, redirect, flash, make_response, session
from app import app
from app.forms import DonationAmountForm

import stripe
import json
import os.path

stripe_keys = {
    'secret_key': app.config['SECRET_KEY'],
    'publishable_key': app.config['PUBLISHABLE_KEY'],
}

stripe.api_key = stripe_keys['secret_key']

donation_data = None
with open(os.path.join(os.path.dirname(__file__), "./data/data.json")) as json_data:
    donation_data = json.load(json_data)

@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST'])
def index():
    form = DonationAmountForm()
    if form.validate_on_submit():
        amount = request.form['amount']
        name = request.form['name']
        recipient = request.form['recipient']

        customer = stripe.Customer.create(
            email='customer@example.com',
            source=request.form['token_id']
        )

        charge = stripe.Charge.create(
            customer=customer.id,
            amount=amount,
            currency='usd',
            description='Flask Charge'
        )

        # Set the session keys to be used for the charge route.
        session['amount'] = amount
        session['name'] = name
        session['recipient'] = recipient
        return redirect('/charge')
    return render_template('index.html', key=stripe_keys['publishable_key'], form=form, donation_data=donation_data['donation_data'])

@app.route('/charge', methods=['GET'])
def charge():
    amount = session['amount']
    amount = '${:.2f}'.format(float(amount) / 100)
    name = session['name']
    recipient = session['recipient']

    return render_template('charge.html', amount=amount, name=name, recipient=recipient)
