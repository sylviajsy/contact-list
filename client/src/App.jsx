import { useState } from 'react'
import './App.css'
import { ToastContainer } from "react-toastify";
import ContactsPage from "./components/ContactsPage/ContactsPage";
// import GroupPage from "./components/GroupsPage";

function App() {
  const [page, setPage] = useState("contacts");

  return (
    <>
      <ToastContainer 
          position="top-center"
          autoClose={3000}
          toastStyle={{
            marginTop: "40vh",
            textAlign: "center"
          }}
      />

      <nav>
        <button onClick={() => setPage("contacts")}>
          Contacts
        </button>

        <button onClick={() => setPage("groups")}>
          Groups
        </button>
      </nav>
      
      {page === "contacts" && <ContactsPage />}

      {/* {page === "groups" && <GroupsPage />} */}

    </>
  )
}

export default App
