import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-primary-dark">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to continue shopping
          </p>
        </div>
        
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-background shadow-2xl rounded-lg p-6",
              headerTitle: "font-display text-2xl hidden",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "font-medium",
              formButtonPrimary: "bg-primary hover:bg-primary/90",
              footerActionLink: "text-primary hover:text-primary/90",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-background border-input",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
            },
            layout: {
              socialButtonsPlacement: "top",
              socialButtonsVariant: "blockButton",
            },
          }}
          redirectUrl="/"
          afterSignInUrl="/"
        />
      </div>
    </div>
  );
}