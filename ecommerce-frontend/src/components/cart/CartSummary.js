import React from 'react';

const CartSummary = ({ items, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-3 bg-light rounded">
      <h5>Order Summary</h5>
      <p>Total: ${total.toFixed(2)}</p>
      <button onClick={onCheckout} className="btn btn-success">
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;