export default function DeliveryPage() {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl mt-12">
        <h1 className="text-3xl font-bold mb-8">Delivery Information</h1>
  
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Standard Delivery</h2>
            <div className="space-y-4">
              <div className="bg-accent/50 p-6 rounded-lg">
                <ul className="list-disc list-inside space-y-2">
                  <li>Free for orders of ₱500 or more</li>
                  <li>₱75 for orders less than ₱500</li>
                  <li>Generally arrives in 3–8 business days</li>
                </ul>
              </div>
            </div>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>
            <div className="bg-card p-6 rounded-lg space-y-4">
              <ul className="list-disc list-inside space-y-3">
                <li>Orders are processed Monday–Friday, except for national holidays.</li>
                <li>Orders may experience longer processing and delivery times during public holidays.</li>
                <li>Delivery fees are not refundable unless you receive an incorrect item.</li>
                <li>Orders can be delivered nationwide.</li>
              </ul>
            </div>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold mb-4">Delivery Areas</h2>
            <div className="bg-card p-6 rounded-lg">
              <p className="text-muted-foreground">
                We deliver to all major cities and provinces across the Philippines. Delivery times may
                vary depending on your location and local courier service availability.
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  }