import { type ReactNode } from "react";
import Navbar from "../components/Navbar";

interface ChatLayoutProps {
  children: ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  // const [activeContactId, setActiveContactId] = useState<string>("1");
  // const [showPanel, setShowPanel] = useState<boolean>(true);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Chat History - hide on mobile */}
        {/* <div className="hidden md:flex">
          <ChatHistory
            activeId={activeContactId}
            onSelect={setActiveContactId}
          />
        </div> */}
        <main className="flex-1 overflow-y-auto bg-white">{children}</main>
        {/* {showPanel && (
          <div className="hidden lg:flex">
            <CustomerPanel
              customer={mockCustomer}
              onClose={() => setShowPanel(false)}
            />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ChatLayout;
