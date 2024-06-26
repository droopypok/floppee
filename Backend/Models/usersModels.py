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
    seller_id = db.Column(db.Integer, ForeignKey('users.id'))

    items = db.relationship("Product_Item", backref="product", cascade="all, delete-orphan")
    type_selections = db.relationship("Product_Type_Selections", backref="product", cascade="all, delete-orphan")

    def to_json(self):
        user = Users.query.filter_by(id=self.seller_id).first()
        return {
            "id": self.id,
            "productName": self.product_name,
            "description": self.description,
            "category": self.category,
            "sellerId": self.seller_id,
            "sellerName": user.username
        }


class Product_Item(db.Model):
    __tablename__ = 'product_item'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, ForeignKey('products.id'))
    quantity = db.Column(db.Integer, nullable=False)
    product_image = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)

    options = db.relationship("Product_Options", backref="item", cascade="all, delete-orphan")
    cart = db.relationship("Shopping_Cart_Item", backref="item", cascade="all, delete-orphan")


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
    option = db.Column(db.String(50))

    def to_json(self):
        return {
            "id": self.id,
            "category": self.category,
            "option": self.option,
        }


class Product_Type_Selections(db.Model):
    __tablename__ = 'product_type_selections'

    id = db.Column(db.Integer, primary_key=True)
    product_type_id = db.Column(db.Integer, ForeignKey('product_types.id'))
    product_id = db.Column(db.Integer, ForeignKey('products.id'))
    option = db.Column(db.String(50))

    def to_json(self):
        return {
            "id": self.id,
            "option": self.option,
            "productId": self.product_id,
            "productTypeId": self.product_type_id
        }
        

class Product_Options(db.Model):
    __tablename__ = 'product_options'

    id = db.Column(db.Integer, primary_key=True)
    product_type_selection_id = db.Column(db.Integer, ForeignKey('product_type_selections.id'))
    product_item_id = db.Column(db.Integer, ForeignKey('product_item.id'))

    product = db.relationship("Product_Item", backref="item")
    type_selections = db.relationship("Product_Type_Selections")

    def to_json(self):
        return {
            "id": self.id,
            "productTypeSelectionId": self.product_type_selection_id,
            "product_item_id": self.product_item_id
        }



## shopping cart schema

class Shopping_Cart_Item(db.Model):
    __tablename__ = 'shopping_cart_item'
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, ForeignKey('product_item.id'))
    quantity = db.Column(db.Integer)
    bought = db.Column(db.Boolean, default=False)
    userId = db.Column(db.Integer, ForeignKey('users.id'))

    def to_json(self):
        return {
            "id": self.id,
            "productId": self.product_id,
            "bought": self.bought,
            "quantity": self.quantity
        }


class Shopping_Cart(db.Model):
    __tablename__ = 'shopping_cart'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.id'))


#order fulfilment

class Orders (db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    buyer_id = db.Column(db.Integer, ForeignKey('users.id'))
    product_item_id = db.Column(db.Integer, ForeignKey('product_item.id'))
    shopping_cart_id = db.Column(db.Integer, ForeignKey('shopping_cart_item.id'))
    shipping_address = db.Column(db.Integer, ForeignKey('addresses.id'))
    delivery_status = db.Column(db.Integer, ForeignKey('delivery_status.id'), default=1)

    def to_json(self):
        return {
            "id": self.id,
            "buyerId": self.buyer_id,
            "productItemId": self.product_item_id,
            "shoppingCartId": self.shopping_cart_id,
            "shippingAddress": self.shipping_address,
            "deliveryStatus": self.delivery_status 
        }
    
class Shipping_Orders (db.Model):
    __tablename__ = 'shipping_orders'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, ForeignKey('orders.id'))
    product_id = db.Column(db.Integer, ForeignKey('product_item.id'))
    quantity = db.Column(db.Integer, nullable=False)


class DeliveryStatus(db.Model):
    __tablename__ = 'delivery_status'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(20), unique=True, nullable=False)


class Product_Reviews (db.Model):
    __tablename__ = 'product_reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.id'))
    product_id = db.Column(db.Integer, ForeignKey('product_item.id'))
    review = db.Column(db.Text, nullable=True)
