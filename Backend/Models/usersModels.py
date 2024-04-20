import sys
sys.path.append("..")

from Backend.config import db

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(150), unique=False, nullable=False)
    role = db.Column(db.Integer, unique=False, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "password": self.password,
            "role": self.role
        }
    