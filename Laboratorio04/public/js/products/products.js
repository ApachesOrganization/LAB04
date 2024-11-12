document.addEventListener("DOMContentLoaded", function () {
    if (typeof firebase !== 'undefined') {
        console.log("Firebase está cargado. Procediendo con la consulta...");

        const db = firebase.firestore();
        const productList = document.getElementById('productList');

        if (!productList) {
            console.error("Elemento productList no encontrado en el DOM.");
            return;
        }

        loadProducts();
        loadCategories();
    } else {
        console.error("Firebase no está cargado. Verifica tu configuración de Firebase.");
    }
});


function toggleAddProductForm(editing = false) {
    const formContainer = document.getElementById("addProductFormContainer");
    const saveButton = document.querySelector("#addProductForm button");

    if (editing) {
        saveButton.textContent = "Guardar Cambios";
    } else {
        saveButton.textContent = "Guardar Producto";
        document.getElementById("addProductForm").reset(); 
    }

    formContainer.style.display = formContainer.style.display === "none" ? "block" : "none";
}


function loadProducts() {
    const db = firebase.firestore();
    const productList = document.getElementById('productList');
    productList.innerHTML = "";

    db.collection("products").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            addProductRow(doc);
        });

        if (productList.children.length === 0) {
            productList.innerHTML = "<tr><td colspan='3' class='text-center'>No hay productos disponibles</td></tr>";
        }
    }).catch((error) => {
        console.error("Error al recuperar los productos:", error);
    });
}


function loadCategories() {
    const db = firebase.firestore();
    const categorySelect = document.getElementById("categoryID");

    categorySelect.innerHTML = '<option value="">Seleccione una categoría</option>';

    db.collection("categories").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const values = data["CategoryID,CategoryName,Description,Imagen,Mime"].split(",");
            const categoryID = values[0] || "No disponible";
            const categoryName = values[1] || "Sin nombre";

            const option = document.createElement("option");
            option.value = categoryID;
            option.text = categoryName;
            categorySelect.appendChild(option);
        });
    }).catch((error) => {
        console.error("Error al cargar las categorías:", error);
    });
}


function addProductRow(doc) {
    const data = doc.data();
    const productList = document.getElementById('productList');
    let productID, productName, productDataString;

    if (data["ProductID,ProductName,SupplierID,CategoryID,QuantityPerUnit,UnitPrice,UnitsInStock,UnitsOnOrder,ReorderLevel,Discontinued"]) {
        productDataString = data["ProductID,ProductName,SupplierID,CategoryID,QuantityPerUnit,UnitPrice,UnitsInStock,UnitsOnOrder,ReorderLevel,Discontinued"];
        const values = productDataString.split(',');

        if (values.length >= 2) {
            productID = values[0] || "No disponible";
            productName = values[1] || "Sin nombre";
        }
    } else {
        productID = data.ProductID || "No disponible";
        productName = data.ProductName || "Sin nombre";
        productDataString = `${productID},${productName},${data.SupplierID || ''},${data.CategoryID || ''},${data.QuantityPerUnit || ''},${data.UnitPrice || ''},${data.UnitsInStock || ''},${data.UnitsOnOrder || ''},${data.ReorderLevel || ''},${data.Discontinued || ''}`;
    }

    const row = document.createElement('tr');
    row.setAttribute("id", `row-${doc.id}`);
    row.innerHTML = `
        <td>${productID}</td>
        <td>${productName}</td>
        <td>
            <a href="edit_product.html?id=${doc.id}" class="edit-link">Editar</a>
            <a href="#" onclick="deleteProduct('${doc.id}')" class="delete-link ms-3">Borrar</a>
        </td>
    `;
    productList.appendChild(row);
}


function addProduct(event) {
    event.preventDefault();

    const productID = document.getElementById("productID").value;
    const productName = document.getElementById("productName").value;
    const supplierID = document.getElementById("supplierID").value;
    const categoryID = document.getElementById("categoryID").value;
    const quantityPerUnit = document.getElementById("quantityPerUnit").value;
    const unitPrice = document.getElementById("unitPrice").value;
    const unitsInStock = document.getElementById("unitsInStock").value;
    const unitsOnOrder = document.getElementById("unitsOnOrder").value;
    const reorderLevel = document.getElementById("reorderLevel").value;
    const discontinued = document.getElementById("discontinued").value;

    const productDataString = `${productID},${productName},${supplierID},${categoryID},${quantityPerUnit},${unitPrice},${unitsInStock},${unitsOnOrder},${reorderLevel},${discontinued}`;

    const db = firebase.firestore();
    db.collection("products").add({
        "ProductID,ProductName,SupplierID,CategoryID,QuantityPerUnit,UnitPrice,UnitsInStock,UnitsOnOrder,ReorderLevel,Discontinued": productDataString
    }).then((docRef) => {
        alert("Producto agregado con éxito.");
        db.collection("products").doc(docRef.id).get().then((doc) => {
            addProductRow(doc);
        });
        document.getElementById("addProductForm").reset();
        toggleAddProductForm(); 
    }).catch((error) => {
        console.error("Error al agregar el producto:", error);
    });
}


function deleteProduct(productId) {
    const db = firebase.firestore();
    db.collection("products").doc(productId).delete()
        .then(() => {
            alert("Producto eliminado con éxito.");
            document.getElementById(`row-${productId}`).remove();
        })
        .catch((error) => {
            console.error("Error al eliminar el producto:", error);
        });
}
