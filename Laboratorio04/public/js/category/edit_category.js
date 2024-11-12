const db = firebase.firestore();
const urlParams = new URLSearchParams(window.location.search);
const documentId = urlParams.get('id');

if (documentId) {
    const editForm = document.getElementById("editForm");
    const categoryIDInput = document.getElementById("categoryID");
    const categoryNameInput = document.getElementById("categoryName");
    const descriptionInput = document.getElementById("description");

    db.collection("categories").doc(documentId).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            const values = data["CategoryID,CategoryName,Description,Imagen,Mime"].split(",");

            categoryIDInput.value = values[0] || "";
            categoryNameInput.value = values[1] || "";
            descriptionInput.value = values[2] || "";
        } else {
            console.error("No se encontró la categoría con el Document ID:", documentId);
        }
    }).catch((error) => {
        console.error("Error al obtener la categoría:", error);
    });

    editForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const updatedCategoryID = categoryIDInput.value;
        const updatedCategoryName = categoryNameInput.value;
        const updatedDescription = descriptionInput.value;
        const updatedData = `${updatedCategoryID},${updatedCategoryName},${updatedDescription},,`;

        db.collection("categories").doc(documentId).update({
            "CategoryID,CategoryName,Description,Imagen,Mime": updatedData
        }).then(() => {
            alert("Categoría actualizada correctamente");
            window.location.href = "categories.html";
        }).catch((error) => {
            console.error("Error al actualizar la categoría:", error);
        });
    });
} else {
    console.error("No se encontró el Document ID en la URL.");
}
