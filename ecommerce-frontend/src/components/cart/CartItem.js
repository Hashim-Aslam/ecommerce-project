import React from 'react';

const CartItem = ({ item, onRemove }) => {
  return (
    <div>
      <h5>{item.name}</h5>
      <p>Qty: {item.quantity} × ${item.price}</p>
      <button onClick={() => onRemove(item.product_id)}>Remove</button>
    </div>
  );
};

export default CartItem; 