from ..extensions import db
from sqlalchemy import ForeignKey

class Users(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.Text, unique=False, nullable=False)
    role = db.Column(db.Integer, ForeignKey('user_roles.id'), default=1)

    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "password": self.password,
            "role": self.role
        }
    
    
class User_Roles(db.Model):
    __tablename__ = 'user_roles'

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(20), unique=True, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "role": self.role
        }   
    

class Addresses(db.Model):
    __tablename__ = 'addresses'

    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.Text, nullable=False)
    postal_code = db.Column(db.String(20), nullable=False)
    unit_number = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('users.id'))

    def to_json(self):
        return {
            "id": self.id,
            "address": self.address,
            "postalCode": self.postal_code,
            "unitNumber": self.unit_number
        }