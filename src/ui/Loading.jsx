import images from "../assets/images/chat.jpg";

function Loading() {
  return (
    <>
      {/* //Болк загрузки */}
      <div className="flex flex-col items-center justify-center h-[100vh] bg-[#fff] text-black font-extrabold ">
        <img className="h-[500px] mb-10" src={images} alt="" />
        <h3>Идет загрузка ...</h3>
      </div>
    </>
  );
}

export default Loading;
