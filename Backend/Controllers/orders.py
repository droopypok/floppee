from ..Models.usersModels import Shopping_Cart, Shopping_Cart_Item, Orders, Shipping_Orders, Product_Reviews, Users, Addresses, Product_Item, Products, Product_Options, Product_Type_Selections, DeliveryStatus
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from ..extensions import db
from flask_jwt_extended import jwt_required


orders_bp = Blueprint("/orders/", __name__)

## shopping cart



# shopping cart item

@orders_bp.route('/view_cart/<int:id>/', methods=["GET", "OPTIONS"])
@cross_origin()
@jwt_required()
def view_cart(id):
    cart_items = db.session.query(Shopping_Cart_Item, Product_Item, Products, Users)\
        .join(Product_Item, Shopping_Cart_Item.product_id == Product_Item.id)\
        .join(Products, Product_Item.product_id == Products.id)\
        .join(Users, Products.seller_id == Users.id)\
        .filter(Shopping_Cart_Item.userId == id, Shopping_Cart_Item.bought == False)\
        .all()

    print(cart_items)

    if cart_items:
        json_cart_items = []

        for cart_item, product_item, product, seller in cart_items:
            # Fetch options for the current product item
            options = db.session.query(Product_Type_Selections)\
                .join(Product_Options, Product_Type_Selections.id == Product_Options.product_type_selection_id)\
                .filter(Product_Options.product_item_id == product_item.id)\
                .all()

            # Create JSON object for cart item
            json_cart_item = {
                "id": cart_item.id,
                "productId": product.id,
                "productItemId": product_item.id,
                "productName": product.product_name,
                "quantity": cart_item.quantity,
                "sellerName": seller.username,
                "price": product_item.price,
                "options": [option.option for option in options]  # Include options for the current product item
            }

            json_cart_items.append(json_cart_item)

        return jsonify({"shopping_cart": json_cart_items}), 200
    else:
        return jsonify({"message": "Shopping cart is empty"}), 200



@orders_bp.route('/add_to_cart/', methods=["POST", "OPTIONS"])
@cross_origin()
@jwt_required()
def add_to_cart():
    data = request.json
    print(data)

    user_id = data['userId']
    product_id = data['productId']
    quantity = int(data.get('quantity', 0)) 
    adjustQuantity = int(data.get('adjustQuantity', 0)) 


    # Check if the item already exists in the shopping cart
    existing_item = Shopping_Cart_Item.query.filter_by(userId=user_id, product_id=product_id, bought=False).first()

    if existing_item:
        if quantity:
            existing_item.quantity += quantity
            db.session.commit()
            return jsonify({"message": "Updated quantity", "updatedItem": existing_item.to_json()})
        elif adjustQuantity:
            existing_item.quantity = adjustQuantity
            db.session.commit()
            return jsonify({"message": "Updated quantity", "updatedItem": existing_item.to_json()})
        else:
            return jsonify({"message": "No quantity provided"}), 400

    # Add the item to the shopping cart
    new_cart_item = Shopping_Cart_Item(userId=user_id, product_id=product_id, quantity=quantity)
    db.session.add(new_cart_item)
    db.session.commit()

    return jsonify({"message": "Item added to the shopping cart successfully", "newItem": new_cart_item.to_json() }), 201


@orders_bp.route('/remove_from_cart/<int:id>/', methods=["DELETE", "OPTIONS"])
@cross_origin()
@jwt_required()
def remove_from_cart(id):
    cart_item = Shopping_Cart_Item.query.get(id)

    if cart_item:
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({"message": "Item removed from the shopping cart successfully"}), 200
    else:
        return jsonify({"error": "Item not found in the shopping cart"}), 404


@orders_bp.route('/checkout/', methods=["POST"])
@cross_origin()
@jwt_required()
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





@orders_bp.route('/create_order/', methods=["PUT", "OPTIONS"])
@cross_origin()
@jwt_required()
def create_order():
    data = request.json
    buyer_id = data["buyerId"]

    created_orders = []

    for order_data in data["orders"]:
        product_item_id = order_data.get('productItemId')
        shopping_cart_id = order_data.get('id')
        options = order_data.get('options')
        productName = order_data.get('productName')

        shopping_cart_item = Shopping_Cart_Item.query.get(shopping_cart_id)
        if not shopping_cart_item:
            return jsonify({"status": "error", "message": "Quantity not found?"}), 404

        ordered_quantity = shopping_cart_item.quantity

        existing_order = Orders.query.filter_by(shopping_cart_id=shopping_cart_id).first()
        if existing_order:
            return jsonify({"status": "error", "message":  "product already exists!"}), 400
        
        shopping_cart_item.bought = True


        product_item = Product_Item.query.get(product_item_id)
        if product_item:
            if product_item.quantity >= ordered_quantity:
                product_item.quantity -= ordered_quantity
            else:
                return jsonify({"status": "error", "message":  f"{productName} {options}\
                                 Ordered quantity exceeds available quantity of {product_item.quantity}!"}), 400


        new_order = Orders(
            buyer_id=buyer_id,
            product_item_id=product_item_id,
            shopping_cart_id=shopping_cart_id,
        )

        db.session.add(new_order)
        created_orders.append(new_order)          

    try:
        db.session.commit()
        return jsonify({"message": "Orders created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": "Error creating orders", "error": str(e)}), 500



@orders_bp.route('/get_all_orders/<int:id>/', methods=["GET", "OPTIONS"])
@cross_origin()
def get_all_orders(id):
    
    query = db.session.query(Orders, Product_Item, Products, Product_Options, Product_Type_Selections, Users, Shopping_Cart_Item, DeliveryStatus)\
        .join(Product_Item, Orders.product_item_id == Product_Item.id)\
        .join(Products, Product_Item.product_id == Products.id)\
        .join(Product_Options, Product_Item.id == Product_Options.product_item_id)\
        .join(Product_Type_Selections, Product_Options.product_type_selection_id == Product_Type_Selections.id)\
        .join(Users, Users.id == Orders.buyer_id)\
        .join(Shopping_Cart_Item, Orders.shopping_cart_id == Shopping_Cart_Item.id)\
        .join(DeliveryStatus, DeliveryStatus.id == Orders.delivery_status)\
        .filter(Orders.buyer_id == id, Shopping_Cart_Item.bought == True)\
        .all()

    orders_list = []
    processed_order_ids = set()  # To keep track of processed order IDs

    for order, product_item, product, product_option, product_type_selection, user, cart_item, status in query:
        order_id = order.id
        
        # Check if the order ID has already been processed
        if order_id in processed_order_ids:
            continue  
    
        processed_order_ids.add(order_id)
      
        options_query = db.session.query(Product_Type_Selections)\
            .join(Product_Options, Product_Type_Selections.id == Product_Options.product_type_selection_id)\
            .filter(Product_Options.product_item_id == product_item.id)\
            .all()
        
        order_data = {
            "buyer_username": user.username,
            "seller_username": product.seller_id,
            "productId": product.id,
            "productName": product.product_name,
            "quantity": cart_item.quantity,
            "price": product_item.price,
            "deliveryStatus": status.status,
            "options": [option.option for option in options_query]  # Include options for the current product item
        }

        orders_list.append(order_data)

    return jsonify({"orders": orders_list})


@orders_bp.route('/get_all_pending_orders/<int:id>/', methods=["GET", "OPTIONS"])
@cross_origin()
def get_all_pending_orders(id):
    
    query = db.session.query(Orders, Product_Item, Products, Product_Options, Product_Type_Selections, Users, Shopping_Cart_Item, DeliveryStatus)\
        .join(Product_Item, Orders.product_item_id == Product_Item.id)\
        .join(Products, Product_Item.product_id == Products.id)\
        .join(Product_Options, Product_Item.id == Product_Options.product_item_id)\
        .join(Product_Type_Selections, Product_Options.product_type_selection_id == Product_Type_Selections.id)\
        .join(Users, Users.id == Orders.buyer_id)\
        .join(Shopping_Cart_Item, Orders.shopping_cart_id == Shopping_Cart_Item.id)\
        .join(DeliveryStatus, DeliveryStatus.id == Orders.delivery_status)\
        .filter(Products.seller_id == id, Orders.delivery_status == 1)\
        .all()

    orders_list = []
    processed_order_ids = set()  # To keep track of processed order IDs

    for order, product_item, product, product_option, product_type_selection, user, cart_item, status in query:
        order_id = order.id
        
        # Check if the order ID has already been processed
        if order_id in processed_order_ids:
            continue  
    
        processed_order_ids.add(order_id)
      
        options_query = db.session.query(Product_Type_Selections)\
            .join(Product_Options, Product_Type_Selections.id == Product_Options.product_type_selection_id)\
            .filter(Product_Options.product_item_id == product_item.id)\
            .all()
        
        order_data = {
            "buyer_username": user.username,
            "seller_username": product.seller_id,
            "productId": product.id,
            "productName": product.product_name,
            "quantity": cart_item.quantity,
            "price": product_item.price,
            "deliveryStatus": status.status,
            "options": [option.option for option in options_query]  # Include options for the current product item
        }

        orders_list.append(order_data)

    return jsonify({"orders": orders_list})



## shipping orders


# product reviews