import { useState, useEffect } from 'react'
import "../../node_modules/draft-js/dist/Draft.css"
import { Link } from "react-router-dom";
import "../styles/Home.css"
import { relative } from 'path';

const api_url = "http://localhost:5000/api/"

function HomePage() {
  const EntryList = () => {
    const [entries, setEntries] = useState([]);

    const getEntries = async () => {
      const raw_response = await fetch(`${api_url}0`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
      setEntries(await raw_response.json());
    };

    const EntriesAsElem = () => {
      return (
        <>
          {
            entries.map((entry, i) => {
              const entryDate = new Date(new Date(entry["creation_date"]).toLocaleString());
              const year:String = String(entryDate.getUTCFullYear()).padStart(2, '0');
              const month:String = String(entryDate.getUTCMonth() + 1).padStart(2, '0'); //months from 1-12
              const day:String = String(entryDate.getUTCDate()).padStart(2, '0');

              return (
                <div key={i} className="homeEntryContainer">
                  <Link to={`/entry/${entry["id"]}`}>
                    <h1>{entry["title"]}</h1>
                    <p>{`${year}.${month}.${day}`}</p>
                  </Link>
                </div>
              );
            })
          }
        </>
      )
    };

    // const getNewId = () => {
    //   return Math.floor(Math.random() * 4294967294 + 1);
    // };

    useEffect(() => { getEntries(); }, []);

    return (
      <>
        <EntriesAsElem />
      </>
    );
  }
  
  return (
    <div className="homeEntriesContainer"> 
      <div className="CreateButton">
        <Link to={`/new_entry/${Math.floor(Math.random() * 4294967294 + 1)}`}>
          <p>Create</p>
        </Link>
      </div>
      <EntryList />
    </div>
  );
}
export default HomePage;
