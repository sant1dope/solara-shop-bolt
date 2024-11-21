'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/components/providers/cart-provider';
import { SimpleLoading } from '@/components/ui/simple-loading';
import { 
  CreditCard, 
  Wallet, 
  User, 
  Mail, 
  Home, 
  Phone, 
  Upload, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

const steps = [
  { title: 'Payment Information', icon: CreditCard },
  { title: 'Billing Details', icon: User },
  { title: 'Summary', icon: CheckCircle2 },
  { title: 'Payment', icon: Wallet }
];

const paymentMethods = [
  { 
    id: 'gcash',
    name: 'GCash',
    image: '/images/gcash.png',
    accountNumber: '09123456789',
    accountName: 'John Doe',
    qrCode: '/images/gcash-qr-placeholder.png'
  },
  { 
    id: 'maya',
    name: 'Maya',
    image: '/images/maya.png',
    accountNumber: '09123456789',
    accountName: 'John Doe',
    qrCode: '/images/maya-qr-placeholder.png'
  }
];

export default function PaymentPage() {
  const { items, total, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    contactNumber: '',
    receipt: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep === 0 && !selectedMethod) {
      toast({
        title: 'Payment method required',
        description: 'You must choose a payment method to continue'
      });
      return;
    }

    if (currentStep === 1) {
      if (!formData.name || !formData.address || !formData.contactNumber) {
        toast({
          title: 'Missing required fields',
          description: 'Please fill in all required fields'
        });
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 10MB'
        });
        return;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file (PNG, JPG, etc.)'
        });
        return;
      }
      setFormData({ ...formData, receipt: file });
    }
  };

  const handleSubmit = async () => {
    if (!formData.receipt) {
      toast({
        title: 'Upload required',
        description: 'Please upload your payment receipt'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order first
      const orderData = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        contactNumber: formData.contactNumber,
        paymentMethod: selectedMethod,
        amount: total,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      };

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const orderResult = await orderResponse.json();

      if (!orderResult.success) {
        throw new Error(orderResult.error || 'Failed to create order');
      }

      // Then upload receipt
      const receiptFormData = new FormData();
      receiptFormData.append('receipt', formData.receipt);
      receiptFormData.append('orderId', orderResult.orderId);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: receiptFormData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Failed to upload receipt');
      }

      // Clear cart and show success message
      clearCart();
      
      toast({
        title: 'Order Successful',
        description: 'Your order has been confirmed and receipt uploaded.'
      });

      // Use replace to prevent back navigation to payment page
      await router.push('/thank-you');
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process payment',
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (!items.length && !isSubmitting) {
      router.push('/cart');
    }
  }, [items.length, isSubmitting, router]);

  if (!items.length) {
    return null;
  }

  if (isSubmitting) {
    return <SimpleLoading />;
  }

  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <Progress value={progress} className="w-full" />
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs text-center">{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-8">
        {currentStep === 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Select Payment Method</h2>
            <div className="text-center mb-8">
              <h3 className="text-lg text-muted-foreground">Amount to Pay</h3>
              <p className="text-4xl font-bold">₱{total.toFixed(2)}</p>
            </div>
            <RadioGroup
              value={selectedMethod}
              onValueChange={setSelectedMethod}
              className="grid grid-cols-1 gap-4"
            >
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`flex items-center space-x-4 border rounded-lg p-4 ${
                    selectedMethod === method.id ? 'border-primary' : ''
                  }`}
                >
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 relative">
                        <Image
                          src={method.image}
                          alt={method.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Account: {method.accountNumber}
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Billing Details</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email (Optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Address *
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNumber" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Number *
                </Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNumber: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <div className="space-y-4 border rounded-lg p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="font-medium">
                    {paymentMethods.find((m) => m.id === selectedMethod)?.name}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Name</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Contact</span>
                  <span className="font-medium">{formData.contactNumber}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Address</span>
                  <span className="font-medium">{formData.address}</span>
                </div>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span>₱{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && selectedPaymentMethod && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Make Your Payment</h2>
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-4">
                  <h3 className="font-semibold">{selectedPaymentMethod.name} Details</h3>
                  <p className="text-muted-foreground">Account Name: {selectedPaymentMethod.accountName}</p>
                  <p className="text-muted-foreground">Account Number: {selectedPaymentMethod.accountNumber}</p>
                </div>
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <Image
                    src={selectedPaymentMethod.qrCode}
                    alt={`${selectedPaymentMethod.name} QR Code`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="receipt"
                  required
                />
                <Label
                  htmlFor="receipt"
                  className="cursor-pointer block space-y-2"
                >
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <div className="text-muted-foreground">
                    Click to upload or drag and drop your payment receipt
                  </div>
                </Label>
              </div>
              {formData.receipt && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Selected file: {formData.receipt.name}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button
            onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              'Processing...'
            ) : currentStep === steps.length - 1 ? (
              <>Submit Payment <CheckCircle2 className="h-4 w-4" /></>
            ) : (
              <>Next <ArrowRight className="h-4 w-4" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}