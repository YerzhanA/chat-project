import imageContact from "../assets/images/444.png";

function NoContacts() {
  //Блок aside где расположены пустой список контактов
  return (
    <div className="flex flex-col items-center justify-center my-auto mt-[150px]">
      <img className=" h-[180px]" src={imageContact} alt="No Contacts" />
      <h4 className="text-[20px] text-black font-semibold tracking-wide mt-4">
        Еще нет чатов
      </h4>
    </div>
  );
}

export default NoContacts;
