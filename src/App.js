import React, { useState, useEffect } from 'react';
import IngredientInput from './IngredientInput';
import './App.css';

function App() {
  const [ingredients, setIngredients] = useState([{ name: '', cost: 0, quantity: 1 }]);
  const [cakes, setCakes] = useState([]); // State to store created cakes
  const [cakeName, setCakeName] = useState(''); // State to store the cake name
  const [image, setImage] = useState(null); // State to store the uploaded image
  const profitMargin = 0.30; // 30% profit margin

  // Load cakes from localStorage when the app starts
  useEffect(() => {
    const storedCakes = localStorage.getItem('cakes');
    if (storedCakes) {
      setCakes(JSON.parse(storedCakes)); // Parse and set stored cakes
    }
  }, []);

  // Save cakes to localStorage whenever the cakes state changes
  useEffect(() => {
    if (cakes.length > 0) {
      localStorage.setItem('cakes', JSON.stringify(cakes)); // Save cakes to localStorage
    }
  }, [cakes]);

  // Function to add a new ingredient field
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', cost: 0, quantity: 1 }]);
  };

  // Function to update ingredient values based on user input
  const handleIngredientChange = (index, updatedIngredient) => {
    const updatedIngredients = ingredients.map((ingredient, i) =>
      i === index ? updatedIngredient : ingredient
    );
    setIngredients(updatedIngredients);
  };

  // Function to calculate the total cost of the ingredients
  const calculateTotalCost = () => {
    return ingredients.reduce((total, ingredient) => {
      return total + (ingredient.cost * ingredient.quantity);
    }, 0);
  };

  // Function to calculate the total selling price with 30% profit margin
  const calculateSellingPrice = () => {
    const totalCost = calculateTotalCost();
    const sellingPrice = totalCost + totalCost * profitMargin;
    return sellingPrice;
  };

  // Function to handle the image upload and convert it to base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result); // Save the base64 encoded image to state
    };

    if (file) {
      reader.readAsDataURL(file); // Read the file as base64
    }
  };

  // Function to create a cake and save its data
  const handleCreateCake = () => {
    const cake = {
      name: cakeName || `Cake ${cakes.length + 1}`, // Use the given name or a default name
      ingredients: [...ingredients],
      totalCost: calculateTotalCost(),
      sellingPrice: calculateSellingPrice(),
      imageUrl: image, // Store the base64 image
    };
    setCakes([...cakes, cake]);
    setIngredients([{ name: '', cost: 0, quantity: 1 }]); // Reset ingredients after cake creation
    setCakeName(''); // Reset cake name after cake creation
    setImage(null); // Reset image after cake creation
  };

  // Function to delete a cake
  const handleDeleteCake = (index) => {
    const updatedCakes = cakes.filter((_, i) => i !== index); // Remove the cake from state
    setCakes(updatedCakes);
    localStorage.setItem('cakes', JSON.stringify(updatedCakes)); // Update localStorage
  };

  return (
    <div className="App">
      <header className="app-header">
        <button className="nav-button">Home</button>
        <button className="nav-button">Back</button>
      </header>

      <h1>Cake Recipe Price Calculator</h1>
      
      <input
        type="text"
        placeholder="Nome do Bolo"
        value={cakeName}
        onChange={(e) => setCakeName(e.target.value)}
        className="cake-name-input"
      />
      
      {ingredients.map((ingredient, index) => (
        <IngredientInput
          key={index}
          ingredient={ingredient}
          onChange={(updatedIngredient) => handleIngredientChange(index, updatedIngredient)}
        />
      ))}
      
      {/* Image Upload Input */}
      <div>
        <input type="file" onChange={handleImageUpload} accept="image/*" />
        {image && <img src={image} alt="Cake Preview" className="cake-image-preview" />} {/* Display the preview */}
      </div>

      <div className="buttons-container">
        <button onClick={handleAddIngredient} className="action-button">Adicionar Ingrediente</button>
        <button onClick={handleCreateCake} className="action-button">Criar Bolo</button>
      </div>
      
      <div className="result">
        <p>Custo total do Ingrediente: ${calculateTotalCost().toFixed(2)}</p>
        <p>Preço de Venda (incluindo 30% de lucro): ${calculateSellingPrice().toFixed(2)}</p>
      </div>

      <div className="cakes-list">
        <h2>Bolos Criados</h2>
        {cakes.length === 0 && <p>Nenhum Bolo Criado Ainda.</p>}
        {cakes.map((cake, index) => (
          <div key={index} className="cake">
            <h3>{cake.name}</h3> {/* Display the cake's name */}
            {cake.imageUrl && (
              <img src={cake.imageUrl} alt={cake.name} className="cake-image" /> /* Display the uploaded image */
            )}
            <ul>
              {cake.ingredients.map((ingredient, idx) => (
                <li key={idx}>
                  {ingredient.quantity} x {ingredient.name} @ ${ingredient.cost.toFixed(2)} per unit
                </li>
              ))}
            </ul>
            <p>Custo Total: ${cake.totalCost.toFixed(2)}</p>
            <p>Preço de Venda(30% profit): ${cake.sellingPrice.toFixed(2)}</p>
            <button onClick={() => handleDeleteCake(index)} className="delete-button">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
