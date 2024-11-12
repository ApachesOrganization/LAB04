const db = firebase.firestore();
const urlParams = new URLSearchParams(window.location.search);
const documentId = urlParams.get('id'); 

if (documentId) {
    const editForm = document.getElementById("editForm");
    const productIDInput = document.getElementById("productID");
    const productNameInput = document.getElementById("productName");
    const supplierIDInput = document.getElementById("supplierID");
    const categoryIDInput = document.getElementById("categoryID");
    const quantityPerUnitInput = document.getElementById("quantityPerUnit");
    const unitPriceInput = document.getElementById("unitPrice");
    const unitsInStockInput = document.getElementById("unitsInStock");
    const unitsOnOrderInput = document.getElementById("unitsOnOrder");
    const reorderLevelInput = document.getElementById("reorderLevel");
    const discontinuedInput = document.getElementById("discontinued");

    
    function loadCategories(selectedCategoryID) {
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

                
                if (categoryID === selectedCategoryID) {
                    option.selected = true;
                }

                categorySelect.appendChild(option);
            });
        }).catch((error) => {
            console.error("Error al cargar las categorías:", error);
        });
    }

    
    db.collection("products").doc(documentId).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            
            
            const values = data["ProductID,ProductName,SupplierID,CategoryID,QuantityPerUnit,UnitPrice,UnitsInStock,UnitsOnOrder,ReorderLevel,Discontinued"].split(",");

            
            productIDInput.value = values[0] || "";
            productNameInput.value = values[1] || "";
            supplierIDInput.value = values[2] || "";
            categoryIDInput.value = values[3] || ""; 
            quantityPerUnitInput.value = values[4] || "";
            unitPriceInput.value = values[5] || "";
            unitsInStockInput.value = values[6] || "";
            unitsOnOrderInput.value = values[7] || "";
            reorderLevelInput.value = values[8] || "";
            discontinuedInput.value = values[9] || "";

            
            loadCategories(values[3]); 
        } else {
            console.error("No se encontró el producto con el Document ID:", documentId);
        }
    }).catch((error) => {
        console.error("Error al obtener el producto:", error);
    });

    
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const updatedProductID = productIDInput.value;
        const updatedProductName = productNameInput.value;
        const updatedSupplierID = supplierIDInput.value;
        const updatedCategoryID = categoryIDInput.value;
        const updatedQuantityPerUnit = quantityPerUnitInput.value;
        const updatedUnitPrice = unitPriceInput.value;
        const updatedUnitsInStock = unitsInStockInput.value;
        const updatedUnitsOnOrder = unitsOnOrderInput.value;
        const updatedReorderLevel = reorderLevelInput.value;
        const updatedDiscontinued = discontinuedInput.value;

        const updatedData = `${updatedProductID},${updatedProductName},${updatedSupplierID},${updatedCategoryID},${updatedQuantityPerUnit},${updatedUnitPrice},${updatedUnitsInStock},${updatedUnitsOnOrder},${updatedReorderLevel},${updatedDiscontinued}`;

        
        db.collection("products").doc(documentId).update({
            "ProductID,ProductName,SupplierID,CategoryID,QuantityPerUnit,UnitPrice,UnitsInStock,UnitsOnOrder,ReorderLevel,Discontinued": updatedData
        }).then(() => {
            alert("Producto actualizado correctamente");
            window.location.href = "products.html"; 
        }).catch((error) => {
            console.error("Error al actualizar el producto:", error);
        });
    });
} else {
    console.error("No se encontró el Document ID en la URL.");
}
