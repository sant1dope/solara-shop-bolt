import Link from 'next/link';
import {
  Package2,
  Truck,
  RotateCcw,
  CreditCard,
  Contact
} from 'lucide-react';

const helpLinks = [
  {
    href: '/help/order-status',
    label: 'Order Status',
    icon: Package2
  },
  {
    href: '/help/delivery',
    label: 'Delivery',
    icon: Truck
  },
  {
    href: '/help/returns',
    label: 'Returns',
    icon: RotateCcw
  },
  {
    href: '/help/payment',
    label: 'Payment Options',
    icon: CreditCard
  },
  {
    href: '/help/contact',
    label: 'Contact Us',
    icon: Contact
  }
];

export default function FooterNav() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Help</h3>
      <nav className="space-y-2">
        {helpLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}