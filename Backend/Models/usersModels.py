from ..extensions import db
from sqlalchemy import ForeignKey

## user schemas

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
    

class User_Address(db.Model):
    __tablename__ = 'user_address'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.id'))
    address_id = db.Column(db.Integer, ForeignKey('addresses.id'))



## Products Schema

class Products(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=False)
    product_image = db.Column(db.Text, nullable=True)
    product_name = db.Column(db.String(80), nullable=False)
    category = db.Column(db.Integer, ForeignKey('categories.id'))

    def to_json(self):
        return {
            "id": self.id,
            "productName": self.product_name,
            "description": self.description,
            "category": self.category
        }



class Product_Item(db.Model):
    __tablename__ = 'product_item'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, ForeignKey('products.id'))
    quantity = db.Column(db.Integer, nullable=False)
    product_image = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Integer, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "productID": self.product_id,
            "quantity": self.quantity,
            "productImage": self.product_image,
            "price": self.price
        }


class Categories(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(50), unique=True, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "category": self.category_name
        }



class Product_Types(db.Model):
    __tablename__ = 'product_types'

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.Integer, ForeignKey('categories.id'))
    option = db.Column(db.String(50), unique=True)


class Product_Type_Selections(db.Model):
    __tablename__ = 'product_type_selections'

    id = db.Column(db.Integer, primary_key=True)
    product_type_id = db.Column(db.Integer, ForeignKey('product_types.id'))
    option = db.Column(db.String(50), unique=True)



## shopping cart schema

class Shopping_Cart_Item(db.Model):
    __tablename__ = 'shopping_cart_item'
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, ForeignKey('product_item.id'))


class Shopping_Cart(db.Model):
    __tablename__ = 'shopping_cart'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.id'))




#order fulfilment

class Orders (db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    shipping_address = db.Column(db.Integer, ForeignKey('shipping_orders.id'))
    product_item_id = db.Column(db.Integer, ForeignKey('product_item.id'))


class Shipping_Orders (db.Model):
    __tablename__ = 'shipping_orders'

    id = db.Column(db.Integer, primary_key=True)
    shipping_address = db.Column(db.Integer, ForeignKey('addresses.id'))


class Product_Reviews (db.Model):
    __tablename__ = 'product_reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.id'))
    product_id = db.Column(db.Integer, ForeignKey('product_item.id'))
    review = db.Column(db.Text, nullable=True)
