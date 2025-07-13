const BillingForm = () => (
  <div className="relative w-1/2">
    <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
    <form className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-4">
        <label htmlFor="">First Name *</label>
      <input type="text" placeholder="Full Name" required className="border p-2" />
      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="">Last Name</label>
      <input type="text" placeholder="Last Name" className="border p-2" />
      </div>
      <div className="flex flex-col gap-4  col-span-2">
        <label htmlFor="">Address *</label>
      <input type="text" placeholder="street Address" required className="border p-2" />
      <input type="text" placeholder="Apartment,suite,unit etc" className="border p-2" />

      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="">Town/City *</label>
      <input type="text" placeholder="City" required className="border p-2" />
      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="">State *</label>
      <input type="text" placeholder="State" required className="border p-2" />
      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="">Postal code *</label>
      <input type="text" placeholder="Postal Code" required className="border p-2" />
      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="">Email address</label>
      <input type="email" placeholder="Email" className="border p-2" />
      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="">Phone Number *</label>
      <input type="number" placeholder="phone number" required className="border p-2" />
      </div>
    </form>
  </div>
);

export default BillingForm;
