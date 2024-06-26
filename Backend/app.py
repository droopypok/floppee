import os
from flask import Flask, request, jsonify, make_response
from .extensions import db, jwt, migrate
from dotenv import load_dotenv
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from datetime import timedelta
from sqlalchemy import inspect

load_dotenv()

def create_app():
    app = Flask(__name__)
    bcrypt = Bcrypt(app)
    CORS(app, supports_credentials=True)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False   
    app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

    from .Controllers.users import users_bp
    from .Controllers.addresses import address_bp
    from .Controllers.products import products_bp
    from .Controllers.orders import orders_bp

    app.register_blueprint(users_bp)
    app.register_blueprint(address_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(orders_bp)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)


    return app
