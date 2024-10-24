import React from 'react';

function IngredientInput({ ingredient, onChange }) {
  const handleNameChange = (e) => {
    onChange({ ...ingredient, name: e.target.value });
  };

  const handleCostChange = (e) => {
    onChange({ ...ingredient, cost: parseFloat(e.target.value) || 0 });
  };

  const handleQuantityChange = (e) => {
    onChange({ ...ingredient, quantity: parseFloat(e.target.value) || 0  });
  };

  return (
    <div className="ingredient-input">
      Nome do ingrediente
      <input
        type="text"
        placeholder="Nome do ingrediente"
        value={ingredient.name}
        onChange={handleNameChange}
      />
      Custo por unidade
      <input
        type="number"
        placeholder="Custo por unidade"
        value={ingredient.cost}
        onChange={handleCostChange}
        min="0"
        step="0.01"
      />
      Quantidade
      <input
        type="number"
        placeholder="Quantidade"
        value={ingredient.quantity}
        onChange={handleQuantityChange}
        min="1"
      />
    </div>
  );
}

export default IngredientInput;
