from flask_wtf import FlaskForm
from wtforms import HiddenField, DecimalField, StringField
from wtforms.fields.html5 import EmailField
from wtforms.validators import NumberRange, DataRequired, Email, Optional

class DonationAmountForm(FlaskForm):
    amount = HiddenField('amount', default=10000)
    token_id = HiddenField('token_id')
    recipient = HiddenField('recipient')

    name = StringField('name', validators=[DataRequired()])
    email = EmailField('email', validators=[DataRequired(), Email()])
    custom_amount = DecimalField('custom_amount', validators=[Optional()])