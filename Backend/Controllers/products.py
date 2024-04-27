from ..Models.usersModels import Products, Product_Item, Product_Type_Selections, Product_Types, Categories, Users
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from ..extensions import db

## Products Table

products_bp = Blueprint("/products/", __name__)

@products_bp.route('/products/', methods=["GET", "OPTIONS"])
@cross_origin()
def get_all_products():
    products = Products.query.all()
    json_products = list(map(lambda x: x.to_json(), products))
    return jsonify({"products": json_products})


@products_bp.route('/products/<int:id>/', methods=["POST", "OPTIONS"])
@cross_origin()
def get_product(id):
    print(id)
    product = Products.query.filter_by(seller_id = id)

    print(product)

    json_products = list(map(lambda x: x.to_json(), product))

    print(json_products)

    if json_products:
        return jsonify({"product": json_products})
    
    else:
        return jsonify({"error": "NO product found"}), 400


@products_bp.route('/create_product/', methods=["POST", "OPTIONS"])
@cross_origin()
def create_product():
    data = request.json

    required_fields = ['description', 'name', 'category', 'id']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    description = data['description']
    name = data['name']
    category_name = data['category']
    seller_id = data['id']

    category = Categories.query.filter_by(category_name=category_name).first()
    
    new_product = Products(description=description, product_name=name, category=category.id, seller_id=seller_id)

    db.session.add(new_product)
    db.session.commit()

    return jsonify({"message": "Product created successfully"}), 200


@products_bp.route('/update_product/<int:id>/', methods=["PUT", "OPTIONS"])
@cross_origin()
def update_product(id):
    data = request.json

    product = Products.query.get(id)

    if product is None:
        return jsonify({"error": "Product not found"}), 404

    if 'description' in data:
        product.description = data['description']
    if 'name' in data:
        product.name = data['name']
    if 'category' in data:
        category_name = data['category']
        category = Categories.query.filter_by(category_name=category_name).first()
        product.category_id = category.id

  
        db.session.commit()
    
        return jsonify({"message": "Product updated successfully"}), 200



@products_bp.route('/delete_product/<int:id>', methods=["DELETE", "OPTIONS"])
@cross_origin()
def delete_product(id): 
    product = Products.query.get(id)

    if product is None:
        return jsonify({"error": "Product not found"}), 400

    db.session.delete(product)
    db.session.commit()

    return jsonify({"message": "Product deleted successfully"}), 200



## Categories
@products_bp.route('/categories/', methods=["GET", "OPTIONS"])
@cross_origin()
def get_all_categories():
    categories = Categories.query.all()
    json_categories = list(map(lambda category: category.to_json(), categories))
    return jsonify({"categories": json_categories})


## Get ALL products from Categories

@products_bp.route('/categories/<int:id>/', methods=["POST", "OPTIONS"])
@cross_origin()
def get_products_by_category(id):
    category = Categories.query.get(id)

    if category is None:
        return jsonify({"error": "Category not found"}), 404

    products = Products.query.filter_by(category=id).all()
    json_products = list(map(lambda product: product.to_json(), products))

    return jsonify({"products": json_products})



#Get all product item from product id

@products_bp.route('/product_items/<int:id>/', methods=["GET", "OPTIONS"])
@cross_origin()
def get_product_items_by_product_id(id):
    product_items = Product_Item.query.filter_by(product_id=id).all()
    
    if not product_items:
        return jsonify({"error": "No product items found for the given product ID"}), 404

    json_product_items = list(map(lambda item: item.to_json(), product_items))
    return jsonify({"product_items": json_product_items})


#Get product item by id
@products_bp.route('/product_items/<int:id>/', methods=["GET", "OPTIONS"])
@cross_origin()
def get_product_item(id):
    product_item = Product_Item.query.get(id)

    if product_item:
        return jsonify({"product_item": product_item.to_json()})
    else:
        return jsonify({"error": "Product item not found"}), 404
    

@products_bp.route('/product_items/', methods=["POST", "OPTIONS"])
@cross_origin()
def create_product_item():
    data = request.json

    required_fields = ['product_id', 'quantity', 'productImage', 'price']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    product_id = data['product_id']
    quantity = data['quantity']
    product_image = data['productImage']
    price = data['price']

    new_product_item = Product_Item(
        product_id=product_id,
        quantity=quantity,
        product_image=product_image,
        price=price
    )

    db.session.add(new_product_item)
    db.session.commit()

    return jsonify({"message": "Product item created successfully"}), 201



@products_bp.route('/product_items/<int:id>/', methods=["PATCH", "OPTIONS"])
@cross_origin()
def update_product_item(id):
    data = request.json

    product_item = Product_Item.query.get(id)

    if product_item is None:
        return jsonify({"error": "Product item not found"}), 404

    if 'quantity' in data:
        product_item.quantity = data['quantity']
    if 'product_image' in data:
        product_item.product_image = data['product_image']
    if 'price' in data:
        product_item.price = data['price']

    db.session.commit()

    return jsonify({"message": "Product item updated successfully"}), 200



@products_bp.route('/product_items/<int:id>/', methods=["DELETE", "OPTIONS"])
@cross_origin()
def delete_product_item(id):
    product_item = Product_Item.query.get(id)

    if product_item is None:
        return jsonify({"error": "Product item not found"}), 404

    db.session.delete(product_item)
    db.session.commit()

    return jsonify({"message": "Product item deleted successfully"}), 200



# Product Options By Category

@products_bp.route('/product_types/<int:id>/', methods=["GET", "OPTIONS"])
@cross_origin()
def get_product_types_by_category_id(id):
    product_types = Product_Types.query.filter_by(category=id).all()

    if not product_types:
        return jsonify({"error": "No product types were found"}), 404

    json_product_types = list(map(lambda product_type: product_type.to_json(), product_types))
    return jsonify({"product_types": json_product_types})



# Product Type Selections by Product_Type_id

@products_bp.route('/product_type_selections/<int:id>/', methods=["GET", "OPTIONS"])
@cross_origin()
def get_product_type_selections_by_product_type_id(id):
    product_type_selections = Product_Type_Selections.query.filter_by(product_type_id=id).all()

    if not product_type_selections:
        return jsonify({"error": "No product type selections were found"}), 404

    json_product_type_selections = list(map(lambda product_type_selection: product_type_selection.to_json(), product_type_selections))
    return jsonify({"product_type_selections": json_product_type_selections})




