import Image from 'next/image';

const paymentMethods = [
  {
    name: 'GCash',
    logo: '/images/gcash.png',
    description: 'Fast and secure mobile wallet payments',
    size: { width: 100, height: 50 }
  },
  {
    name: 'Maya',
    logo: '/images/maya.png',
    description: 'Digital banking and payments',
    size: { width: 120, height: 90 }
  },
  {
    name: 'GrabPay',
    logo: '/images/grabpay.png',
    description: 'Convenient payments via Grab app',
    size: { width: 60, height: 45 }
  },
  {
    name: 'BPI',
    logo: '/images/bpi.png',
    description: 'Direct bank transfer',
    size: { width: 90, height: 55 }
  },
  {
    name: 'SeaBank',
    logo: '/images/seabank.svg',
    description: 'Digital banking solutions',
    size: { width: 120, height: 60 }
  },
  {
    name: 'Landbank',
    logo: '/images/landbank.png',
    description: 'Government bank transfers',
    size: { width: 130, height: 50 }
  }
];


export default function PaymentPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-12">
      <h1 className="text-3xl font-bold mb-8">Payment Options</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map((method) => (
          <div
            key={method.name}
            className="bg-card p-6 rounded-lg border hover:shadow-md transition-shadow"
          >
            <div className="relative h-12 w-full mb-4">
              <Image
                src={method.logo}
                alt={`${method.name} logo`}
                width={method.size.width}
                height={method.size.height}
                className="object-contain"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">{method.name}</h3>
            <p className="text-sm text-muted-foreground">{method.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-accent/50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Important Notes</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>All transactions are secure and encrypted</li>
          <li>Payment confirmation may take up to 24 hours for bank transfers</li>
          <li>Keep your transaction reference number for tracking</li>
        </ul>
      </div>
    </div>
  );
}