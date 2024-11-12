document.addEventListener("DOMContentLoaded", function () {
    if (typeof firebase !== 'undefined') {
        console.log("Firebase está cargado. Procediendo con la consulta...");

        const db = firebase.firestore();
        loadCategories();
    } else {
        console.error("Firebase no está cargado. Verifica tu configuración de Firebase.");
    }
});

// Función para mostrar el formulario de agregar categoría
function showAddCategoryForm() {
    document.getElementById("addCategoryForm").style.display = "block";
}

// Función para ocultar el formulario de agregar categoría
function hideAddCategoryForm() {
    document.getElementById("addCategoryForm").style.display = "none";
}

// Maneja el envío del formulario para agregar una nueva categoría
const categoryForm = document.getElementById("categoryForm");
categoryForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const categoryID = document.getElementById("categoryID").value;
    const categoryName = document.getElementById("categoryName").value;
    const description = document.getElementById("description").value;
    const categoryDataString = `${categoryID},${categoryName},${description},,`;

    firebase.firestore().collection("categories").add({
        "CategoryID,CategoryName,Description,Imagen,Mime": categoryDataString
    }).then(() => {
        alert("Categoría agregada correctamente");
        hideAddCategoryForm();
        location.reload();
    }).catch((error) => {
        console.error("Error al agregar la categoría: ", error);
        alert("Hubo un problema al agregar la categoría.");
    });
});

// Función para cargar y mostrar categorías
function loadCategories() {
    const db = firebase.firestore();
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = "";

    db.collection("categories").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const values = data["CategoryID,CategoryName,Description,Imagen,Mime"].split(",");
            const categoryID = values[0] || "No disponible";
            const categoryName = values[1] || "Sin nombre";
            const description = values[2] || "No disponible";

            const row = document.createElement('tr');
            row.setAttribute("id", `row-${doc.id}`);
            row.innerHTML = `
                <td>${categoryID}</td>
                <td>${categoryName}</td>
                <td>${description}</td>
                <td>
                    <a href="edit_category.html?id=${doc.id}" class="edit-link">Editar</a>
                    <a href="#" onclick="deleteCategory('${doc.id}')" class="delete-link ms-3">Borrar</a>
                </td>
            `;
            categoryList.appendChild(row);
        });
    }).catch((error) => {
        console.error("Error al recuperar las categorías: ", error);
    });
}

// Función para eliminar una categoría
function deleteCategory(categoryId) {
    const db = firebase.firestore();
    db.collection("categories").doc(categoryId).delete()
        .then(() => {
            alert("Categoría eliminada correctamente");
            document.getElementById(`row-${categoryId}`).remove();
        })
        .catch((error) => {
            console.error("Error al eliminar categoría: ", error);
            alert("Hubo un problema al eliminar la categoría.");
        });
}
