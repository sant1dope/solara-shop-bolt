import {
    Mail,
    MessageCircle,
    Phone,
    MapPin,
    Clock
  } from 'lucide-react';
  
  export default function ContactPage() {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl mt-12">
        <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-muted-foreground">inquireatsolara@gmail.com</p>
                <p className="text-sm text-muted-foreground">
                  We aim to respond within 24 hours
                </p>
              </div>
            </div>
  
            <div className="flex items-start space-x-4">
              <MessageCircle className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold mb-1">Chat</h3>
                <p className="text-muted-foreground">Available on Facebook Messenger</p>
                <p className="text-sm text-muted-foreground">
                  Quick responses during business hours
                </p>
              </div>
            </div>
  
            <div className="flex items-start space-x-4">
              <Phone className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <p className="text-muted-foreground">(0929) 594 6140</p>
                <p className="text-sm text-muted-foreground">
                  Monday to Friday, 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </div>
  
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold mb-1">Location</h3>
                <p className="text-muted-foreground">
                  Batangas City
                  <br />
                  Batangas, Philippines
                </p>
              </div>
            </div>
  
            <div className="flex items-start space-x-4">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold mb-1">Business Hours</h3>
                <p className="text-muted-foreground">
                  Monday - Friday: 9:00 AM - 6:00 PM
                  <br />
                  Saturday: 10:00 AM - 4:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }