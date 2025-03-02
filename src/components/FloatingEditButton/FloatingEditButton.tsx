import * as React from "react";
import { Button } from "../ui/button";
import { Pencil, Save } from "lucide-react";

interface FloatingEditButtonProps {
  isEditing: boolean;
  onClick: () => void;
}

function FloatingEditButton({ isEditing, onClick }: FloatingEditButtonProps) {
  return (
    <Button
      className="fixed bottom-4 right-4 rounded-full p-3 shadow-lg"
      size="icon"
      aria-label="Edit"
      type="button"
      onClick={onClick}
    >
      {/* In edit mode: turn into Save button. Otherwise become a Pencil button */}
      {isEditing === false ? (
        <Pencil className="h-5 w-5" />
      ) : (
        <Save className="h-5 w-5" />
      )}
    </Button>
  );
}

export default FloatingEditButton;
