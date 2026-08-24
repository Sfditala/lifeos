"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { NavLinks } from "@/components/nav-links";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type LifeArea = {
  id: string;
  name: string;
  color: string | null;
  show_meetings: boolean;
  show_files: boolean;
  projectCount: number;
  taskCount: number;
};

export function MobileNav({
  areas,
  appName,
  menuLabel,
  side,
}: {
  areas: LifeArea[];
  appName: string;
  menuLabel: string;
  side: "left" | "right";
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={menuLabel}
          />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side={side} className="w-64 p-4">
        <SheetTitle className="mb-6 font-semibold text-foreground">
          {appName}
        </SheetTitle>
        <NavLinks areas={areas} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
