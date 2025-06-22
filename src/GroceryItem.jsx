function GroceryItem({ item, onComplete, onDelete, onEdit, isEditing }) {
  return (
    <div className={`grocery-tile ${item.isCompleted ? 'completed' : ''}`}>
      <p><strong>Name:</strong> {item.itemName}</p>
      <p><strong>Brand:</strong> {item.itemBrand}</p>
      <p><strong>Size:</strong> {item.itemSize}</p>
      <p><strong>Quantity:</strong> {item.itemQuantity}</p>

      <button onClick={() => onComplete(item.id)}>
        {item.isCompleted ? 'Undone' : 'Done'}
      </button>

      {!isEditing && !item.isCompleted && (
        <button onClick={() => onEdit(item)}>Edit</button>
      )}

      <button onClick={() => onDelete(item.id)}>Delete</button>
    </div>
  );
}

export default GroceryItem;
