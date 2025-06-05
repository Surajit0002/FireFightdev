import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

export default function PageHeader({ title, description, icon: Icon, gradient }: PageHeaderProps) {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h1 className={`font-orbitron text-4xl font-bold bg-gradient-to-r ${gradient.replace('bg-gradient-to-r', '')} bg-clip-text text-transparent`}>
          {title}
        </h1>
      </div>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
}