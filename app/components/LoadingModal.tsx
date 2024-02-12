import { Dialog } from "@mui/material";

interface LoadingModalProps {
  isOpen: boolean;
  setIsOpen: (isLoading: boolean) => void;
}

const LoadingModal = ({ isOpen, setIsOpen }: LoadingModalProps) => {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <p>hello world</p>
    </Dialog>
  );
};

export default LoadingModal;
