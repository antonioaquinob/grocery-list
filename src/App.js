import './App.css';
import { useState, useEffect, useRef } from 'react';
import GroceryItem from './GroceryItem';

function App() {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState('')
  const [groceryList, setGroceryList] = useState([])

  const [editItemID, setEditItemID] = useState(null)

  // Declare hasLoaded BEFORE useEffects
  const hasLoaded = useRef(false);

  // Load grocery list from localStorage ONCE
  useEffect(() => {
    const stored = localStorage.getItem('groceryList');
    if (stored) {
      try {
        setGroceryList(JSON.parse(stored));
      } catch (e) {
        console.error('Invalid JSON in localStorage');
      }
    }
  }, []);

  // Enable saving AFTER load
  useEffect(() => {
    // Skip saving if first render (still loading)
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      return;
    }

    localStorage.setItem('groceryList', JSON.stringify(groceryList));
  }, [groceryList]);


  const flush = ()=>{
    setName('')
    setBrand('')
    setSize('')
    setEditItemID(null)
    setQuantity('')
  }

  const startEdit = (item) =>{
    setEditItemID(item.id)
    setName(item.itemName)
    setBrand(item.itemBrand)
    setSize(item.itemSize)
    setQuantity(item.itemQuantity)
  }
  const addEditNewItem = ()=>{
   if (!name.trim() || !brand.trim() || !size.trim()) {
  console.log("Validation failed: one of the required fields is empty.");
  return;
}

const qty = parseInt(quantity);
if (isNaN(qty) || qty <= 0) {
  console.log("Validation failed: quantity is invalid.");
  return;
}

    if(editItemID === null){
      // new item
      const newItem = {
        id: groceryList.length === 0 ? 1 : groceryList[groceryList.length - 1].id + 1,
        itemName: name, 
        itemBrand: brand,
        itemSize: size,
        itemQuantity: quantity,
        isCompleted: false
      }

      setGroceryList([...groceryList, newItem])
      flush()
    }else{
      // edit item
      const updateItem = groceryList.map(item=> item.id === editItemID ?
        {...item, itemName:name, itemBrand: brand, itemSize:size, itemQuantity: quantity} :
        item
      )

      setGroceryList(updateItem)
      flush()
    }
  }

  const deleteItem = (id)=>{
    const filterList = groceryList.filter(item=>item.id !== id)

    setGroceryList(filterList)
    flush()
  }

  const completeItem = (id)=>{
    const filterList = groceryList.map(item=> item.id === id ?
      {...item, isCompleted: !item.isCompleted} : item
    )
    setGroceryList(filterList)
  }
  return (
    <div className="App">
    <div className="form-container">
    <input type="text" placeholder="Enter item name..." value={name} onChange={(e) => setName(e.target.value)} />
    <input type="text" placeholder="Enter brand..." value={brand} onChange={(e) => setBrand(e.target.value)} />
    <input type="text" placeholder="Enter size..." value={size} onChange={(e) => setSize(e.target.value)} />
    <input type="text" placeholder="Enter quantity..." value={quantity} onChange={(e) => setQuantity(e.target.value)} />
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
