'use client';

export function SimpleLoading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-sm text-muted-foreground">Processing payment...</p>
        <p className="mt-2 text-xs text-destructive">Please do not close or reload this page</p>
      </div>
    </div>
  );
}