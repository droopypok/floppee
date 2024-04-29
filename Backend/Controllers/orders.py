from ..Models.usersModels import Shopping_Cart, Shopping_Cart_Item, Orders, Shipping_Orders, Product_Reviews, Users, Addresses, Product_Item, Products
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from ..extensions import db


orders_bp = Blueprint("/orders/", __name__)

## shopping cart



# shopping cart item

@orders_bp.route('/view_cart/<int:id>/', methods=["GET", "OPTIONS"])
@cross_origin()
def view_cart(id):
    cart_items = db.session.query(Shopping_Cart_Item, Product_Item, Products, Users)\
    .join(Product_Item, Shopping_Cart_Item.product_id == Product_Item.id)\
    .join(Products, Product_Item.product_id == Products.id)\
    .join(Users, Products.seller_id == Users.id)\
    .filter(Shopping_Cart_Item.userId == id, Shopping_Cart_Item.bought == False)\
    .all()

    if cart_items:
        json_cart_items = []
        for cart_item, product_item, product, user in cart_items:
      
            json_cart_item = {
                "id": cart_item.id,
                "productId": product.id,
                "productName": product.product_name,
                "quantity": cart_item.quantity,
                "sellerName": user.username,
                "price": product_item.price 
            }
            json_cart_items.append(json_cart_item)

        return jsonify({"shopping_cart": json_cart_items}), 200
    else:
        return jsonify({"message": "Shopping cart is empty"}), 200



@orders_bp.route('/add_to_cart/', methods=["POST", "OPTIONS"])
@cross_origin()
def add_to_cart():
    data = request.json
    print(data)

    user_id = data['userId']
    product_id = data['productId']
    quantity = int(data['quantity'])

    # Check if the item already exists in the shopping cart
    existing_item = Shopping_Cart_Item.query.filter_by(userId=user_id, product_id=product_id, bought=False).first()

    if existing_item:
        existing_item.quantity += quantity
        
        db.session.commit()

        return jsonify({"updatedItem": existing_item.to_json()})

    # Add the item to the shopping cart
    new_cart_item = Shopping_Cart_Item(userId=user_id, product_id=product_id, quantity=quantity)
    db.session.add(new_cart_item)
    db.session.commit()

    return jsonify({"message": "Item added to the shopping cart successfully", "newItem": new_cart_item.to_json() }), 201


@orders_bp.route('/remove_from_cart/<int:item_id>/', methods=["DELETE"])
@cross_origin()
def remove_from_cart(item_id):
    cart_item = Shopping_Cart_Item.query.get(item_id)

    if cart_item:
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({"message": "Item removed from the shopping cart successfully"}), 200
    else:
        return jsonify({"error": "Item not found in the shopping cart"}), 404


@orders_bp.route('/checkout/', methods=["POST"])
@cross_origin()
def checkout():
    data = request.json
    checkout = data.get('checkout')

    for item_id in checkout:
        # Update the bought status of each item in the shopping cart
        item = Shopping_Cart_Item.query.filter_by(id=item_id, bought=False).first()
        if item:
            item.bought = True

    db.session.commit()

    # Remove checked out items from the shopping cart
    Shopping_Cart_Item.query.filter(Shopping_Cart_Item.id.in_(checkout), Shopping_Cart_Item.bought == True).delete(synchronize_session=False)
    db.session.commit()

    return jsonify({"message": "Checkout successful"}), 200

## orders


## shipping orders


# product reviews