const PaymentOptions = () => (
  <div className="p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-2">
        <input type="radio" name="payment" className="accent-green-600" />
        Credit Card
      </label>
      <label className="flex items-center gap-2">
        <input type="radio" name="payment" className="accent-green-600" />
        PayPal
      </label>
    </div>
  </div>
);

export default PaymentOptions;
