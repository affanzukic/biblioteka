export default function AdminUserComponent() {
  return (
    <div id="container" className="flex flex-row space-x-10 w-full h-full p-4 rounded-lg dark:bg-gray-900 bg-gray-100" style={{ zIndex: -15 }}>
      <div id="email" className="flex">
        <h1>testna.adresa@cetvrta-gimnazija.edu.ba</h1>
      </div>
      <div id="description" className="flex">
        <h1>Administrator</h1>
      </div>
      <div id="remove" className="flex"></div>
    </div>
  );
}
