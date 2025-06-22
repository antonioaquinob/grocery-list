import './App.css';
import { useState, useEffect } from 'react';
import GroceryItem from './GroceryItem';
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';

function App() {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState('');
  const [groceryList, setGroceryList] = useState([]);
  const [editItemID, setEditItemID] = useState(null);

  const flush = () => {
    setName('');
    setBrand('');
    setSize('');
    setEditItemID(null);
    setQuantity('');
  };

  const fetchGroceryList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'groceryList'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGroceryList(items);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchGroceryList();
  }, []);

  const startEdit = item => {
    setEditItemID(item.id);
    setName(item.itemName);
    setBrand(item.itemBrand);
    setSize(item.itemSize);
    setQuantity(item.itemQuantity);
  };

  const addEditNewItem = async () => {
    if (!name.trim() || !brand.trim() || !size.trim()) {
      console.log('Validation failed: one of the required fields is empty.');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      console.log('Validation failed: quantity is invalid.');
      return;
    }

    const newItem = {
      itemName: name,
      itemBrand: brand,
      itemSize: size,
      itemQuantity: quantity,
      isCompleted: false
    };

    try {
      if (editItemID === null) {
        // Add new item to Firestore
        await addDoc(collection(db, 'groceryList'), newItem);
      } else {
        // Update existing item in Firestore
        await updateDoc(doc(db, 'groceryList', editItemID), newItem);
      }
      flush();
      fetchGroceryList();
    } catch (error) {
      console.error('Error adding/updating item:', error);
    }
  };

  const deleteItem = async id => {
    try {
      await deleteDoc(doc(db, 'groceryList', id));
      fetchGroceryList();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const completeItem = async id => {
    const item = groceryList.find(item => item.id === id);
    if (item) {
      try {
        await updateDoc(doc(db, 'groceryList', id), {
          isCompleted: !item.isCompleted
        });
        fetchGroceryList();
      } catch (error) {
        console.error('Error toggling item completion:', error);
      }
    }
  };

  return (
    <div className="App">
      <div className="form-container">
        <input
          type="text"
          placeholder="Enter item name..."
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter brand..."
          value={brand}
          onChange={e => setBrand(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter size..."
          value={size}
          onChange={e => setSize(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter quantity..."
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
        />
        <button onClick={addEditNewItem}>
          {editItemID === null ? 'Add' : 'Update'}
        </button>
      </div>

      {/* Pending Items */}
      <h2>Pending Items</h2>
      <div className="grocery-list-container">
        {groceryList
          .filter(item => !item.isCompleted)
          .map(item => (
            <GroceryItem
              key={item.id}
              item={item}
              onComplete={completeItem}
              onDelete={deleteItem}
              onEdit={startEdit}
              isEditing={editItemID !== null}
            />
          ))}
      </div>

      {/* Completed Items */}
      <h2>Completed Items</h2>
      <div className="grocery-list-container">
        {groceryList
          .filter(item => item.isCompleted)
          .map(item => (
            <GroceryItem
              key={item.id}
              item={item}
              onComplete={completeItem}
              onDelete={deleteItem}
              isEditing={editItemID !== null}
            />
          ))}
      </div>
    </div>
  );
}

export default App;