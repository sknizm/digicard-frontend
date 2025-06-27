// components/business-card/Footer.tsx
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="mt-12 pt-6 border-t border-gray-100 text-center">
      <div className="flex items-center justify-center gap-1">
        <span className="text-gray-500 text-sm">Powered by</span>
        <Button 
          variant="link" 
          className="text-gray-700 hover:text-green-600 p-0 h-auto text-sm font-normal"
          onClick={() => window.open("https://2cd.site", "_blank")}
        >
          2cd.site
        </Button>
      </div>
    </footer>
  );
};