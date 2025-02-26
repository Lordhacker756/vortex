import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react"; // Import loading spinner
import React from "react";

interface ServerStartingDialogProps {
  open: boolean;
}

const ServerStartingDialog = ({ open }: ServerStartingDialogProps) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Server Starting Up
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Our server is hosted on a shared infrastructure and may take up to
            60 seconds to start up after a period of inactivity. Please wait
            while we get everything ready for you.
            <div className="mt-2 text-sm text-muted-foreground">
              Thank you for your patience!
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ServerStartingDialog;
