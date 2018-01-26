from flask_wtf import FlaskForm
from wtforms import HiddenField, DecimalField, StringField
from wtforms.fields.html5 import EmailField
from wtforms.validators import NumberRange, DataRequired, Email, Optional, ValidationError

def amount_validation(form, field):
    print('in amount validation')
    try:
        int(field.data)
    except ValueError:
        raise ValidationError('Invalid amount value')

    if int(field.data) <= 0:
        raise ValidationError('Donation amount must be greater than $0')

class DonationAmountForm(FlaskForm):
    amount = HiddenField('amount', default=10000, validators=[amount_validation])
    token_id = HiddenField('token_id')
    recipient = HiddenField('recipient')

    name = StringField('name', validators=[DataRequired()])
    email = EmailField('email', validators=[DataRequired(), Email()])
    custom_amount = DecimalField('custom_amount', validators=[Optional()])
