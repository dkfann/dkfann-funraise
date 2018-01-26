# Funraise Giving Form

This giving form was created using HTML5, LESS, ES6 Javascript, and Flask for the Python backend. It uses Stripe Checkout to handle passing the credit card information to the Flask backend.

## How To Run
To run locally, you can clone this repository and then follow these steps:

1. With Python and `pip` installed, run `pip install -r requirements.txt`. This will install the packages required to run the Python backend.
2. Create a virtual environment by running `python -m venv venv`. If you're running a Python version older than 3.4, you might need to run `virtualenv venv` with `virutalenv` installed.
3. If you're running a Linux machine, run `source venv/bin/activate` to start the virtual environment. Then run `export FLASK_APP=giving.py`. If you're on a Windows machine, run `venv\Scripts\activate` to start the virtual environment. Then run `set FLASK_APP = "giving.py"`. If this doesn't work, you might need to run `$env:FLASK_APP = "giving.py"`.
4. Run `flask run`. The app should be accessible at `localhost:5000`.

You can also access the heroku app at: https://dkfann-funraise.herokuapp.com/

## Front-End Details
I opted to use HTML5, LESS, and ES6 JS so I could quickly generate the markup, styling, and interactions without having to have too many dependencies. While developing, I used Gulp for my CSS and JS conversions to utilize the LESS and ES6 features.
Integrated Stripe Checkout into the form for payment processing. It's using a test key so only the test credit card values work with it.
These values can be found here: https://stripe.com/docs/testing.
For example, you can use `4242424242424242` as a test Visa credit card with any expiration date (in the future) and any zip code.

## Back-End Details
The backend is handled by Flask to be able to set up a quick server for the donor and payment information to hit an API endpoint.
The forms and validations are handled through WTForms. Upon a successful donation, the user is redirected to a `/charge` route which
displays the user's name, the recipient's name, and the amount donated.
