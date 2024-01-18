import { useSelector } from "react-redux";
import "./home.css";
import Profile from "../widgets/Profile";
import ChatComponent from "../widgets/Chat";
import AsideChat from "../widgets/AsideChat";

function HomePage() {
  const { showProfile, showNotifications } = useSelector(
    (state) => state.profile
  );

  const profileAnimation = `transition-transform ease-out duration-500 transform ${
    showProfile ? "translate-x-0" : "translate-x-full"
  }`;

  const asideChatAnimation = `transition-transform ease-out duration-500 transform ${
    !showProfile ? "translate-x-0" : "translate-x-full"
  }`;

  return (
    <div className="home-page h-[900px] min-w-[400px] flex items-center justify-center bg-black scrollbar-hide z-10 overflow-y-hidden shadow-2xl relative animate-slideInDown">
      <div className={profileAnimation}>{showProfile && <Profile />}</div>
      <div className={asideChatAnimation}>
        {!showProfile && <AsideChat showNotifications={showNotifications} />}
      </div>
      <ChatComponent />
    </div>
  );
}

export default HomePage;
