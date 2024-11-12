
function showAddCategoryForm() {
    document.getElementById("addCategoryForm").style.display = "block";
}


function hideAddCategoryForm() {
    document.getElementById("addCategoryForm").style.display = "none";
}


const categoryForm = document.getElementById("categoryForm");


categoryForm.addEventListener("submit", function (e) {
    e.preventDefault();

    
    const categoryID = document.getElementById("categoryID").value;
    const categoryName = document.getElementById("categoryName").value;
    const description = document.getElementById("description").value;
    const imagen = ""; 
    const mime = ""; 

    
    const categoryDataString = `${categoryID},${categoryName},${description},${imagen},${mime}`;

    
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
