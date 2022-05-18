import Modal from "./Modal";

function Page() {
  return (
    <div style={{ height: "100vh", backgroundColor: "#10000e0" }}>
      <div
        style={{ height: "100vh", backgroundColor: "#10000e0" }}
        className="flex flex-col items-center font-sans align-middle bg-gray-900 "
      >
        <Modal />
      </div>
    </div>
  );
}

export default Page;
