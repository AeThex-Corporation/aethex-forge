import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from './ui/CodeBlock';

interface CodeExample {
  language: string;
  label: string;
  code: string;
}

interface CodeTabsProps {
  examples: CodeExample[];
  title?: string;
}

export function CodeTabs({ examples, title }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState(examples[0]?.language || "");

  if (examples.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {title && (
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
      )}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${examples.length}, 1fr)` }}>
          {examples.map((example) => (
            <TabsTrigger key={example.language} value={example.language}>
              {example.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {examples.map((example) => (
          <TabsContent key={example.language} value={example.language} className="mt-3">
            <CodeBlock
              code={example.code}
              language={example.language}
              showLineNumbers={false}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
