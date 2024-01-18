import { useEffect } from "react";
import { validUser } from "../api/user";
import { useNavigate } from "react-router-dom";

function Start() {
  const pageRoute = useNavigate();
  useEffect(() => {
    const isValid = async () => {
      const data = await validUser();
      if (!data?.user) {
        pageRoute("/login");
      } else {
        pageRoute("/chats");
      }
    };
    isValid();
  }, [pageRoute]);
  return (
    <div className="bg-black w-[100vw] h-[100vh] flex items-center flex-col -gap-y-10 mb-10">
      <div className="w-[600px] h-[600px] ">
        <div className="bg-[url('./assets/images/anonym10.jpeg')] bg-contain bg-center bg-no-repeat text-[#fff] w-full h-full mt-[150px]"></div>
        <h3 className="text-center text-white text-2xl justify-center items-center w-[600px]">
          Идет загрузка .....
        </h3>
      </div>
    </div>
  );
}

export default Start;
