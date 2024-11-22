import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  export default function ReturnsPage() {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl mt-12">
        <h1 className="text-3xl font-bold mb-8">Returns Policy</h1>
  
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Return Period</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Items can be returned within 7 days of delivery</li>
                <li>Must be unworn, unwashed, and with original tags attached</li>
                <li>Original receipt or proof of purchase required</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
  
          <AccordionItem value="item-2">
            <AccordionTrigger>Eligible Items</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Clothing and accessories in original condition</li>
                <li>Defective or damaged items</li>
                <li>Incorrect items received</li>
                <li>Items must be in original packaging</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
  
          <AccordionItem value="item-3">
            <AccordionTrigger>Non-Returnable Items</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Intimates and swimwear</li>
                <li>Sale or discounted items</li>
                <li>Items marked as final sale</li>
                <li>Customized or personalized items</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
  
          <AccordionItem value="item-4">
            <AccordionTrigger>Return Process</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal list-inside space-y-2">
                <li>Contact customer service with your order number</li>
                <li>Fill out the return form</li>
                <li>Pack items securely with all original tags</li>
                <li>Ship to provided return address</li>
                <li>Refund will be processed within 5-7 business days after receipt</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
  
          <AccordionItem value="item-5">
            <AccordionTrigger>Refund Options</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Original payment method refund</li>
                <li>Store credit (additional 5% bonus)</li>
                <li>Exchange for different size/color if available</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }