from ..Models.usersModels import Products, Product_Item, Product_Type_Selections, Product_Types, Categories, Users, Product_Options
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from ..extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

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
    products = db.session.query(
        Products.id,
        Products.description,
        Products.product_image,
        Products.product_name,
        Categories.category_name.label("category"),
        Products.seller_id
    ).join(
        Categories, lambda: Products.category == Categories.id
    ).filter(
        Products.seller_id == id
    ).all()

    json_products = list(map(lambda product: {
        "id": product.id,
        "productName": product.product_name,
        "description": product.description,
        "category": product.category,
        "sellerId": product.seller_id
    }, products))

    if json_products:
        return jsonify({"product": json_products})
    else:
        return jsonify({"error": "No product found"}), 400    


@products_bp.route('/create_new_product/', methods=["POST", "OPTIONS"])
@cross_origin()
@jwt_required()
def create_new_product():
    data = request.json

    user = get_jwt_identity()

    print(user)

    existingUser = Users.query.filter_by(username=user).first()

    if existingUser.role not in [2, 3]: 
        return jsonify({"error": "Unauthorized. Only sellers or admins can update products"}), 404



    required_fields = ['description', 'name', 'category', 'id',]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    description = data['description']
    product_name = data['name']
    category = data['category']
    seller_id = data['id']

    category = Categories.query.filter_by(category_name=category).first()
    
    new_product = Products(description=description, product_name=product_name, category=category.id, seller_id=seller_id)
    db.session.add(new_product)
    db.session.commit()

    new_product_id = new_product.id

    return jsonify({"message": "created product successffully", "product_id": new_product_id})

    

@products_bp.route('/update_product/<int:id>/', methods=["PATCH", "OPTIONS"])
@cross_origin()
@jwt_required()
def update_product(id):

    user = get_jwt_identity()

    existingUser = Users.query.filter_by(username=user).first()
    if existingUser.role not in [2, 3]: 
        return jsonify({"error": "Unauthorized. Only sellers or admins can update products"}), 404
    
    data = request.json

    product = Products.query.get(id)

    if product is None:
        return jsonify({"error": "Product not found"}), 404

    if 'description' in data:
        product.description = data['description']
        print("Description updated:", data['description'])

    if 'name' in data:
        product.product_name = data['name']
        print("Name updated", data['name'])

    if 'category' in data:
        category_name = data['category']
        category = Categories.query.filter_by(category_name=category_name).first()
        product.category = category.id
  
        db.session.commit()
    
        return jsonify({"message": "Product updated successfully"}), 200



@products_bp.route('/delete_product/<int:id>/', methods=["DELETE", "OPTIONS"])
@cross_origin()
@jwt_required()
def delete_product(id): 

    user = get_jwt_identity()

    existingUser = Users.query.filter_by(username=user).first()

    if existingUser.role not in [2, 3]: 
        return jsonify({"error": "Unauthorized. Only sellers or admins can update products"}), 404
    
    # Find the product to delete
    product = Products.query.get(id)
    if product is None:
        return jsonify({"error": "Product not found"}), 400

    # Delete the product
    db.session.delete(product)
    db.session.commit()

    return jsonify({"message": "Product and related items deleted successfully"}), 200



## Categories
@products_bp.route('/categories/', methods=["GET", "OPTIONS"])
@cross_origin()
def get_all_categories():
    categories = Categories.query.all()
    json_categories = list(map(lambda category: category.to_json(), categories))
    return jsonify({"categories": json_categories})


## Get ALL products from Categories

@products_bp.route('/categories/<name>/', methods=["GET", "OPTIONS"])
@cross_origin()
def get_products_by_category(name):

    category = Categories.query.filter_by(category_name=name).first()
  

    if category is None:
        return jsonify({"error": "Category not found"}), 404
    

    products = Products.query.filter_by(category=category.id).all()
    
    json_products = list(map(lambda product: product.to_json(), products))

    return jsonify({"products": json_products})



#Get product by product Id
@products_bp.route('/productId/<int:id>/', methods=["GET", "OPTIONS"])
@cross_origin()
def get_selected_product(id):
    product = Products.query.get(id)

    if product:
        return jsonify({"product": product.to_json()})
    else:
        return jsonify({"error": "Product not found"})
    


#Get all product item from product id

@products_bp.route('/product_items/<int:id>/', methods=["GET", "OPTIONS"])
@cross_origin()
def get_product_items_by_product_id(id):
    product_items = Product_Item.query.filter_by(product_id=id).all()
    
    if not product_items:
        return jsonify({"error": "No product items found for the given product ID"}), 404

    json_product_items = []
    for item in product_items:
        product_options = (
            db.session.query(Product_Options, Product_Type_Selections.option)
            .join(Product_Type_Selections, Product_Options.product_type_selection_id == Product_Type_Selections.id)
            .join(Product_Types, Product_Type_Selections.product_type_id == Product_Types.id)
            .filter(Product_Options.product_item_id == item.id)
            .all()
        )
        options = [option.option for option in product_options]
        json_product_items.append({
            "id": item.id,
            "productID": item.product_id,
            "quantity": item.quantity,
            "productImage": item.product_image,
            "price": item.price,
            "options": options
        })

    return jsonify({"product_items": json_product_items})


#Get product item by id
@products_bp.route('/item/<int:id>/', methods=["GET", "OPTIONS"])
@cross_origin()
def get_product_item(id):
    product_item = Product_Item.query.get(id)

    if product_item:
        return jsonify({"product_item": product_item.to_json()})
    else:
        return jsonify({"error": "Product item not found"}), 404
    

@products_bp.route('/product_items/', methods=["POST", "OPTIONS"])
@cross_origin()
@jwt_required
def create_product_item():

    user = get_jwt_identity()

    existingUser = Users.query.filter_by(username=user).first()

    if existingUser.role not in [2, 3]: 
        return jsonify({"error": "Unauthorized. Only sellers or admins can update products"}), 404
    
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

    return jsonify({"message": "Product item created successfully"}), 200



@products_bp.route('/product_items/<int:id>/', methods=["PATCH", "OPTIONS"])
@cross_origin()
@jwt_required()
def update_product_item(id):

    user = get_jwt_identity()

    existingUser = Users.query.filter_by(username=user).first()

    if existingUser.role not in [2, 3]: 
        return jsonify({"error": "Unauthorized. Only sellers or admins can update products"}), 404
    
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
@jwt_required()
def delete_product_item(id):

    user = get_jwt_identity()

    existingUser = Users.query.filter_by(username=user).first()
    if existingUser.role not in [2, 3]: 
        return jsonify({"error": "Unauthorized. Only sellers or admins can update products"}), 404

    product_item = Product_Item.query.get(id)

    if product_item is None:
        return jsonify({"error": "Product item not found"}), 404

    db.session.delete(product_item)
    db.session.commit()

    return jsonify({"message": "Product item deleted successfully"}), 200



# Product Options By Category

@products_bp.route('/products_types/<name>/', methods=["GET", "OPTIONS"])
@cross_origin()
def get_product_types_by_category(name):
    category = Categories.query.filter_by(category_name=name).first()
    product_types = Product_Types.query.filter_by(category=category.id).all()

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



@products_bp.route('/create_options/', methods=["PUT", "OPTIONS"])
@cross_origin()
@jwt_required()
def create_options_productId():

    user = get_jwt_identity()

    existingUser = Users.query.filter_by(username=user).first()

    if existingUser.role not in [2, 3]: 
        return jsonify({"error": "Unauthorized. Only sellers or admins can update products"}), 404
    
    data = request.json

    required_fields = ['productId', 'productTypeId', 'option', ]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    product_id = data['productId']
    product_type_id = data['productTypeId']
    option = data['option']

    new_option = Product_Type_Selections(product_id=product_id, product_type_id=product_type_id, option=option, )
    db.session.add(new_option)
    db.session.commit()

    return jsonify({"message": "Created option!"}), 200


@products_bp.route('/product_options/<int:id>/', methods=["POST", "OPTIONS"])
@cross_origin()
def get_all_product_options(id):
    product_options = Product_Type_Selections.query.filter_by(product_id=id).all()

    json_product_options = list(map(lambda x: x.to_json(), product_options))

    return jsonify({"productOptions": json_product_options})


@products_bp.route('/create_new_product_item/', methods=["PUT", "OPTIONS"])
@cross_origin()
@jwt_required()
def create_new_product_item():

    user = get_jwt_identity()

    existingUser = Users.query.filter_by(username=user).first()

    if existingUser.role not in [2, 3]: 
        return jsonify({"error": "Unauthorized. Only sellers or admins can update products"}), 404
    
    data = request.json

    required_fields = ['productId', 'productItems']

    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    product_id = data['productId']
    product_items = data['productItems']

    for item in product_items:
        try:
            quantity = int(item['quantity'])
            price = float(item['price']) # convert cents to dollars
        except (ValueError, KeyError) as e:
            return jsonify({"error": f"Invalid data: {e}"}), 400

        new_product_item = Product_Item(
            product_id=product_id,
            product_image="https://www.esports.net/wp-content/uploads/2020/05/kekw-emote-2.jpg",
            quantity=quantity,
            price=price
        )

        db.session.add(new_product_item)
        db.session.commit()

        product_item_id = new_product_item.id

        for option in item.get('options', []):
            try:
                product_type_selection_id = int(option['productTypeId'])
            except (ValueError, KeyError) as e:
                return jsonify({"error": f"Invalid data: {e}"}), 400

            product_option = Product_Options(
                product_type_selection_id=product_type_selection_id,
                product_item_id=product_item_id
            )

            db.session.add(product_option)
            db.session.commit()

    return jsonify({"success": True}), 201



    

    
        
            

   


