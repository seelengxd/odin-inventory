function deleteItem(id) {
  fetch(`/items/${id}`, { method: "DELETE" }).then((response) => {
    window.location.href = "/items";
  });
}

function deleteCategory(id) {
  fetch(`/categories/${id}`, { method: "DELETE" }).then((response) => {
    window.location.href = "/categories";
  });
}
